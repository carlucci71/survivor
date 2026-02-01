package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

@Converter(autoApply = false)
@Slf4j
public class EsitoGiocataConverter implements AttributeConverter<Enumeratori.EsitoGiocata, String> {

    @Override
    public String convertToDatabaseColumn(Enumeratori.EsitoGiocata esitoGiocata) {
        return esitoGiocata == null ? null : esitoGiocata.name();
    }

    @Override
    public Enumeratori.EsitoGiocata convertToEntityAttribute(String dbData) {
        if (dbData==null) return null;
        if (dbData.trim().equals("")) return null;
        try{
            return Enumeratori.EsitoGiocata.valueOf(dbData);
        }
        catch (Exception e){
            log.info("Errore con codice: " + dbData);
            throw e;
        }
    }
}
