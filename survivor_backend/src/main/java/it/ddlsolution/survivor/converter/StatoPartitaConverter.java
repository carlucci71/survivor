package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatoPartitaConverter implements AttributeConverter<Enumeratori.StatoPartita, String> {

    @Override
    public String convertToDatabaseColumn(Enumeratori.StatoPartita attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name();
    }

    @Override
    public Enumeratori.StatoPartita convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Enumeratori.StatoPartita.valueOf(dbData);
    }
}

