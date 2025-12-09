package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.Enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class EsitoGiocataConverter implements AttributeConverter<Enumeratori.EsitoGiocata, String> {

    @Override
    public String convertToDatabaseColumn(Enumeratori.EsitoGiocata esitoGiocata) {
        return esitoGiocata == null ? null : esitoGiocata.name();
    }

    @Override
    public Enumeratori.EsitoGiocata convertToEntityAttribute(String dbData) {
        if (dbData==null) return null;
        return Enumeratori.EsitoGiocata.valueOf(dbData);
    }
}
