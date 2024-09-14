package com.ashkanans.taskify.api.architecture;

public class ApiError {

    private int code;        // HTTP status code, e.g., 401, 403, 500
    private String description; // Error description

    // Constructor
    public ApiError(int code, String description) {
        this.code = code;
        this.description = description;
    }

    // Getters and setters
    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
