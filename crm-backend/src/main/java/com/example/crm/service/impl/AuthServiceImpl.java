package com.example.crm.service.impl;

import com.example.crm.config.CrmProperties;
import com.example.crm.dto.auth.*;
import com.example.crm.entity.*;
import com.example.crm.entity.enums.RoleName;
import com.example.crm.entity.enums.UserStatus;
import com.example.crm.exception.BusinessException;
import com.example.crm.exception.DuplicateResourceException;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.repository.*;
import com.example.crm.security.JwtTokenProvider;
import com.example.crm.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final CrmProperties properties;

    public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
                          RefreshTokenRepository refreshTokenRepository,
                          PasswordResetTokenRepository passwordResetTokenRepository,
                          EmailVerificationTokenRepository emailVerificationTokenRepository,
                          PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider,
                          AuthenticationManager authenticationManager, CrmProperties properties) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.properties = properties;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists", "EMAIL_EXISTS");
        }
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        Role role = roleRepository.findByName(RoleName.SALES_REP)
                .orElseThrow(() -> new BusinessException("Default role not found", "ROLE_NOT_FOUND"));
        user.getRoles().add(role);
        userRepository.save(user);

        String token = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refresh = UUID.randomUUID().toString();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(refresh);
        refreshToken.setExpiresAt(Instant.now().plus(properties.getJwt().getRefreshTokenExpirationMs(), ChronoUnit.MILLIS));
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refresh)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found", "USER_NOT_FOUND"));
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String token = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refresh = UUID.randomUUID().toString();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(refresh);
        refreshToken.setExpiresAt(Instant.now().plus(properties.getJwt().getRefreshTokenExpirationMs(), ChronoUnit.MILLIS));
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refresh)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
                .build();
    }

    @Override
    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .filter(rt -> !rt.isRevoked() && rt.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new BusinessException("Invalid refresh token", "INVALID_REFRESH_TOKEN"));
        User user = refreshToken.getUser();
        String token = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String newRefresh = UUID.randomUUID().toString();
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setToken(newRefresh);
        rt.setExpiresAt(Instant.now().plus(properties.getJwt().getRefreshTokenExpirationMs(), ChronoUnit.MILLIS));
        refreshTokenRepository.save(rt);
        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(newRefresh)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
                .build();
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmailIgnoreCase(request.getEmail()).ifPresent(user -> {
            PasswordResetToken token = new PasswordResetToken();
            token.setUser(user);
            token.setToken(UUID.randomUUID().toString());
            token.setExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));
            passwordResetTokenRepository.save(token);
        });
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.getToken())
                .filter(t -> !t.isUsed() && t.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new BusinessException("Invalid token", "INVALID_TOKEN"));
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        token.setUsed(true);
        userRepository.save(user);
        passwordResetTokenRepository.save(token);
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found", "USER_NOT_FOUND"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("Invalid current password", "INVALID_PASSWORD");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void verifyEmail(VerifyEmailRequest request) {
        EmailVerificationToken token = emailVerificationTokenRepository.findByToken(request.getToken())
                .filter(t -> !t.isUsed() && t.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new BusinessException("Invalid token", "INVALID_TOKEN"));
        User user = token.getUser();
        user.setEmailVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        token.setUsed(true);
        userRepository.save(user);
        emailVerificationTokenRepository.save(token);
    }
}
