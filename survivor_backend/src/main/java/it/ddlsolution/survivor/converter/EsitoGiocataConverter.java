package it.ddlsolution.survivor.converter;

import it.ddlsolution.survivor.util.enumeratori;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class EsitoGiocataConverter implements AttributeConverter<enumeratori.EsitoGiocata, String> {

    @Override
    public String convertToDatabaseColumn(enumeratori.EsitoGiocata esitoGiocata) {
        return esitoGiocata == null ? null : esitoGiocata.name();
    }

    @Override
    public enumeratori.EsitoGiocata convertToEntityAttribute(String dbData) {
        return enumeratori.EsitoGiocata.valueOf(dbData);
    }
}
