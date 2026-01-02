package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Squadra;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SquadraMapper  extends DtoMapper<SquadraDTO, Squadra> {

    @Override
    @Mapping(target = "campionato", ignore = true)
    SquadraDTO toDTO(Squadra squadra);
}

