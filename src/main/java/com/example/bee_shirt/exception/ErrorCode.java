package com.example.bee_shirt.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    INVALID_KEY(1001,"Invalid message key", HttpStatus.UNAUTHORIZED),

    USER_EXISTED(1002,"Username existed",HttpStatus.BAD_REQUEST),

    USER_NOT_EXISTED(1003,"Account not existed",HttpStatus.NOT_FOUND),

    UNAUTHENTICATED(1004,"UnAuthenticated",HttpStatus.BAD_REQUEST),

    USERNAME_INVALID(1005,"Username must be at least 3 characters",HttpStatus.BAD_REQUEST),

    PASSWORD_INVALID(1006,"Password must be at least 5 characters",HttpStatus.BAD_REQUEST),

    UNAUTHORIZED(1007,"You do not have role",HttpStatus.FORBIDDEN),

    TOKEN_INVALID(1008,"Token invalid",HttpStatus.BAD_REQUEST),

    ROLE_NOT_FOUND(1009,"Role not found",HttpStatus.NOT_FOUND),

    ACCOUNT_ALREADY(1010,"Account has been already",HttpStatus.ALREADY_REPORTED),

    FILE_UPLOAD_FAILED(1011,"File upload has been fail",HttpStatus.BAD_REQUEST),

    INVALID_FILE_TYPE(1012,"This file is not image",HttpStatus.BAD_REQUEST),

    ACCOUNT_NOT_FOUND(1013,"Account not found",HttpStatus.NOT_FOUND),

    INVALID_OLD_PASSWORD(1014,"Old password invalid", HttpStatus.BAD_REQUEST),

    EMAIL_EXISTED(1015,"Email existed", HttpStatus.BAD_REQUEST),

    TOKEN_NOT_FOUND(1016,"Token not found", HttpStatus.NOT_FOUND),

    TOKEN_EXPIRED(1017,"Token expired", HttpStatus.BAD_REQUEST),

    EMAIL_SENDING_FAILED(1018,"Email sending failed", HttpStatus.BAD_REQUEST),

    ACCOUNT_BANED(1019,"Account has been baned", HttpStatus.BAD_REQUEST),

    VERIFICATION_TOKEN_NOT_FOUND(1020,"Verification token not found", HttpStatus.NOT_FOUND),  // Lỗi khi không tìm thấy mã xác minh

    VERIFICATION_CODE_EXPIRED(1021,"Verification code expired", HttpStatus.BAD_REQUEST),  // Lỗi khi mã xác minh hết hạn

    INVALID_VERIFICATION_CODE(1022,"Invalid verification code", HttpStatus.BAD_REQUEST),

    USERNAME_NOT_EMPTY(404_001,"Username not empty", HttpStatus.BAD_REQUEST),

    PASSWORD_NOT_EMPTY(404_002,"Password not empty", HttpStatus.BAD_REQUEST),

    VOUCHER_NOT_FOUND(404_003,"Voucher not empty", HttpStatus.NOT_FOUND),

    ;
    private int code;

    private String message;

    private HttpStatusCode statusCode;
}
