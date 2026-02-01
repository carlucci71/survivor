package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CodiciParametriConverter implements AttributeConverter<Enumeratori.CodiciParametri, String> {

    @Override
    public String convertToDatabaseColumn(Enumeratori.CodiciParametri attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name();
    }

    @Override
    public Enumeratori.CodiciParametri convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Enumeratori.CodiciParametri.valueOf(dbData);
    }
}

