package it.ddlsolution.survivor.exception;

import lombok.Data;

@Data
public class ManagedException extends RuntimeException{

    private String internalCode;
    public ManagedException(String msg, String internalCode){
        super(msg);
        this.internalCode=internalCode;
    }
}
