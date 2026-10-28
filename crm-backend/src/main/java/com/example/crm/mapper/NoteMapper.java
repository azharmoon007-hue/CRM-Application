package com.example.crm.mapper;

import com.example.crm.dto.note.NoteRequest;
import com.example.crm.dto.note.NoteResponse;
import com.example.crm.entity.Note;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NoteMapper {
    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "createdByName", expression = "java(note.getCreatedBy() != null ? note.getCreatedBy().getFullName() : null)")
    NoteResponse toResponse(Note note);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "lead", ignore = true)
    @Mapping(target = "deal", ignore = true)
    @Mapping(target = "contact", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Note toEntity(NoteRequest request);
}
