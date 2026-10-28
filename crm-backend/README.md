# CRM Backend

Production-ready CRM backend built with Spring Boot 3.x, Java 21, PostgreSQL, and JWT authentication.

## Features

- JWT Authentication with refresh tokens
- Role and Permission based authorization
- Customer, Lead, Deal, Contact management
- Sales Pipeline with stages
- Activities, Tasks, Notes
- Email templates and sending
- Notifications
- Dashboard and Reports with Excel/PDF export
- Audit logging
- File attachments
- Global search

## Prerequisites

- Java 21
- Maven 3.9+
- PostgreSQL 16+
- Redis (optional)

## Running locally

```bash
mvn spring-boot:run
```

## Running with Docker

```bash
docker compose up -d
```

## Swagger UI

http://localhost:8080/swagger-ui.html

## API Docs

http://localhost:8080/v3/api-docs
