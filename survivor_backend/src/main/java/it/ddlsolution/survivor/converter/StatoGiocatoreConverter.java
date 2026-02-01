package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatoGiocatoreConverter implements AttributeConverter<Enumeratori.StatoGiocatore, String> {

    @Override
    public String convertToDatabaseColumn(Enumeratori.StatoGiocatore attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getCodice();
    }

    @Override
    public Enumeratori.StatoGiocatore convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Enumeratori.StatoGiocatore.fromCodice(dbData);
    }
}

