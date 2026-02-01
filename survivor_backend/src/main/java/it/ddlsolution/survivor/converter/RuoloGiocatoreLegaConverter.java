package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RuoloGiocatoreLegaConverter implements AttributeConverter<Enumeratori.RuoloGiocatoreLega, String> {

    @Override
    public String convertToDatabaseColumn(Enumeratori.RuoloGiocatoreLega attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getCodice();
    }

    @Override
    public Enumeratori.RuoloGiocatoreLega convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Enumeratori.RuoloGiocatoreLega.fromCodice(dbData);
    }
}

