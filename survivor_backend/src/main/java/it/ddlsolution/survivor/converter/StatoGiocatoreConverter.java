package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatoGiocatoreConverter implements AttributeConverter<enumeratori.StatoGiocatore, String> {

    @Override
    public String convertToDatabaseColumn(enumeratori.StatoGiocatore attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getCodice();
    }

    @Override
    public enumeratori.StatoGiocatore convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return enumeratori.StatoGiocatore.fromCodice(dbData);
    }
}

