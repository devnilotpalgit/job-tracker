package com.jobtracker.mapper;

import com.jobtracker.dto.ApplicationRequest;
import com.jobtracker.dto.ApplicationResponse;
import com.jobtracker.entity.JobApplication;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {

    ApplicationResponse toResponse(JobApplication jobApplication);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    JobApplication toEntity(ApplicationRequest request);
}
