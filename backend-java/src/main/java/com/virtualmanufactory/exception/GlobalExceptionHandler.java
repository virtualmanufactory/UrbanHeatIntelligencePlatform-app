package com.virtualmanufactory.exception;

import com.virtualmanufactory.exception.dto.ErrorResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<ErrorResponseDto> handleApiException(ApiException ex, HttpServletRequest request) {

		ErrorResponseDto response = ErrorResponseDto.builder()
				.timestamp(LocalDateTime.now())
				.status(ex.getStatus().value())
				.error(ex.getStatus().getReasonPhrase())
				.message(ex.getMessage())
				.path(request.getRequestURI())
				.build();

		return ResponseEntity
				.status(ex.getStatus())
				.body(response);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponseDto> handleException(Exception ex, HttpServletRequest request) {
		ErrorResponseDto response = ErrorResponseDto.builder()
				.timestamp(LocalDateTime.now())
				.status(500)
				.error("Internal Server Error")
				.message(ex.getMessage())
				.path(request.getRequestURI())
				.build();

		return ResponseEntity
				.internalServerError()
				.body(response);
	}
}
