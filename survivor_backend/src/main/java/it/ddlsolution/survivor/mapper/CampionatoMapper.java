package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.entity.Campionato;
import it.ddlsolution.survivor.entity.projection.CampionatoProjection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {SportMapper.class})
public interface CampionatoMapper  extends DtoMapper<CampionatoDTO, Campionato> {

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "squadre", ignore = true)
    CampionatoDTO toDTO(Campionato campionato);

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "squadre", ignore = true)
    CampionatoDTO toDTO(CampionatoProjection campionatoProjection);

    @Mapping(target = "leghe", ignore = true)
    @Mapping(target = "squadre", ignore = true)
    Campionato toEntity(CampionatoDTO campionatoDTO);
}

