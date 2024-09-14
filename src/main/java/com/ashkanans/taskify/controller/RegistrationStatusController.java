package com.ashkanans.taskify.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegistrationStatusController {

    // Flag to control registration status
    public static final boolean REGISTRATION_ENABLED = true;

    @GetMapping("/registration-status")
    public RegistrationStatus getRegistrationStatus() {
        return new RegistrationStatus(!REGISTRATION_ENABLED);
    }

    public static class RegistrationStatus {
        private final boolean registrationBlocked;

        public RegistrationStatus(boolean registrationBlocked) {
            this.registrationBlocked = registrationBlocked;
        }

        public boolean isRegistrationBlocked() {
            return registrationBlocked;
        }
    }
}
