package it.ddlsolution.survivor.exception;

import lombok.Data;

@Data
public class ManagedException extends RuntimeException{

    private InternalCode internalCode;
    public ManagedException(String msg, InternalCode internalCode){
        super(msg);
        this.internalCode=internalCode;
    }

    public enum InternalCode{
        PWD_LEGA_ERRATA, ALREADY_JOINED, CODE_LEGA_PRESENTE
    }
}
