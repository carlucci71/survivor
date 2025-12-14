package it.ddlsolution.survivor.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class BaseResponseException {
    private String errorCode;
    private String message;
    private String nameClassException;
    private Long id;

    public BaseResponseException(){
        id=System.currentTimeMillis();
    }

}
