package com.example.bee_shirt.exception;

import com.example.bee_shirt.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

//@ControllerAdvice sẽ bao quanh tất cả Exception và đưa ra cái đã thiết lập
@ControllerAdvice
public class GlobalExceptionHandle{

    //Ngoại lệ đã xử lý
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse response = new ApiResponse();
        response.setCode(errorCode.getCode());
        response.setMessage(errorCode.getMessage());
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(response);
    }

    //Validation
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception) {

        String enumKey = exception.getFieldError().getDefaultMessage();

        System.out.println(enumKey);

        com.example.bee_shirt.exception.ErrorCode errorCode = com.example.bee_shirt.exception.ErrorCode.INVALID_KEY;

        try {
            errorCode = com.example.bee_shirt.exception.ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException e) {

        }

        ApiResponse response = new ApiResponse();
        response.setCode(errorCode.getCode());

        response.setMessage(errorCode.getMessage());

        return ResponseEntity.badRequest().body(response);
    }
}
