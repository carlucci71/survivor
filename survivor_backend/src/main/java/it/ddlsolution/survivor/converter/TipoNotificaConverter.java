package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoNotificaConverter implements AttributeConverter<Enumeratori.TipoNotifica, String> {

    @Override
    public String convertToDatabaseColumn(Enumeratori.TipoNotifica attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name();
    }

    @Override
    public Enumeratori.TipoNotifica convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Enumeratori.TipoNotifica.valueOf(dbData);
    }
}

