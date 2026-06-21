package com.printrm.studio.domain.onboarding;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/onboarding")
public class OnboardingController {

    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @GetMapping
    public ResponseEntity<OnboardingDTO> getStatus() {
        return ResponseEntity.ok(onboardingService.getStatus());
    }

    @PostMapping
    public ResponseEntity<OnboardingDTO> complete(@RequestBody OnboardingDTO dto) {
        return ResponseEntity.ok(onboardingService.complete(dto));
    }
}
