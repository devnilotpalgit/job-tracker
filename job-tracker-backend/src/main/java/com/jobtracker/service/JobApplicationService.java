package com.jobtracker.service;

import com.jobtracker.dto.ApplicationRequest;
import com.jobtracker.dto.ApplicationResponse;
import com.jobtracker.dto.StatsResponse;
import com.jobtracker.entity.ApplicationStatus;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.User;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.exception.UnauthorizedException;
import com.jobtracker.mapper.ApplicationMapper;
import com.jobtracker.repository.JobApplicationRepository;
import com.jobtracker.repository.UserRepository;
import com.jobtracker.security.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobApplicationService {

    private final JobApplicationRepository repository;
    private final UserRepository userRepository;
    private final ApplicationMapper mapper;

    public JobApplicationService(JobApplicationRepository repository, UserRepository userRepository, ApplicationMapper mapper) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }
        throw new UnauthorizedException("User is not authenticated");
    }

    private JobApplication getApplicationAndVerifyOwner(Long id, User currentUser) {
        JobApplication application = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        if (!application.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not have permission to access this application");
        }

        return application;
    }

    public List<ApplicationResponse> getApplications(ApplicationStatus status) {
        User currentUser = getCurrentUser();
        List<JobApplication> applications;

        if (status != null) {
            applications = repository.findByUserIdAndStatus(currentUser.getId(), status);
        } else {
            applications = repository.findByUserId(currentUser.getId());
        }

        return applications.stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationById(Long id) {
        User currentUser = getCurrentUser();
        JobApplication application = getApplicationAndVerifyOwner(id, currentUser);
        return mapper.toResponse(application);
    }

    public ApplicationResponse createApplication(ApplicationRequest request) {
        User currentUser = getCurrentUser();
        JobApplication application = mapper.toEntity(request);
        application.setUser(currentUser);
        JobApplication saved = repository.save(application);
        return mapper.toResponse(saved);
    }

    public ApplicationResponse updateApplication(Long id, ApplicationRequest request) {
        User currentUser = getCurrentUser();
        JobApplication existing = getApplicationAndVerifyOwner(id, currentUser);

        existing.setCompanyName(request.getCompanyName());
        existing.setJobTitle(request.getJobTitle());
        existing.setLocation(request.getLocation());
        existing.setStatus(request.getStatus());
        existing.setApplicationDate(request.getApplicationDate());

        JobApplication updated = repository.save(existing);
        return mapper.toResponse(updated);
    }

    public void deleteApplication(Long id) {
        User currentUser = getCurrentUser();
        JobApplication existing = getApplicationAndVerifyOwner(id, currentUser);
        repository.delete(existing);
    }

    public StatsResponse getStats() {
        User currentUser = getCurrentUser();
        Long userId = currentUser.getId();

        long total = repository.countByUserId(userId);
        long interviews = repository.countByUserIdAndStatus(userId, ApplicationStatus.INTERVIEW);
        long offers = repository.countByUserIdAndStatus(userId, ApplicationStatus.OFFER);
        long rejections = repository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED);

        return new StatsResponse(total, interviews, offers, rejections);
    }
}
