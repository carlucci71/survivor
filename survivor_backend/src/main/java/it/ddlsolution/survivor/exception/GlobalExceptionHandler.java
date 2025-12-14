package it.ddlsolution.survivor.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponseException> genericExceptionHandler(Exception ex) {
        BaseResponseException baseResponse = new BaseResponseException();
        baseResponse.setErrorCode("ERR00");
        baseResponse.setMessage(ex.getMessage());
        baseResponse.setNameClassException(ex.getClass().getName());
        log.error("Errore generico: " + baseResponse.getId(), ex);
        int stato;
        if (ex instanceof ErrorResponse){
            stato= ((ErrorResponse)ex).getStatusCode().value();
        } else {
            stato=HttpStatus.INTERNAL_SERVER_ERROR.value();
        }
        return ResponseEntity.status(stato).body(baseResponse);
    }

}
