package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.Enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatoLegaConverter implements AttributeConverter<Enumeratori.StatoLega, String> {

    @Override
    public String convertToDatabaseColumn(Enumeratori.StatoLega attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getCodice();
    }

    @Override
    public Enumeratori.StatoLega convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Enumeratori.StatoLega.fromCodice(dbData);
    }
}

