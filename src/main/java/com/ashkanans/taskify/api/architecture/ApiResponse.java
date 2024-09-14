package com.ashkanans.taskify.api.architecture;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private String status;  // "success" or "error"
    private String message; // Human-readable message
    private T data;         // Response data for success case
    private ApiError error; // Error object for failure case

    // Constructors
    public ApiResponse(String status, String message, T data, ApiError error) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    // Static helper methods for creating success and error responses
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("success", message, data, null);
    }

    public static ApiResponse<?> error(String message, ApiError error) {
        return new ApiResponse<>("error", message, null, error);
    }

    // Getters and setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public ApiError getError() {
        return error;
    }

    public void setError(ApiError error) {
        this.error = error;
    }
}
