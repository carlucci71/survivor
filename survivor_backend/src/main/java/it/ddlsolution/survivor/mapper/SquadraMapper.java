package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Squadra;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class})
public interface SquadraMapper {

    SquadraDTO toDTO(Squadra squadra);

    Squadra toEntity(SquadraDTO squadraDTO);

    List<SquadraDTO> toDTOList(List<Squadra> squadre);

    List<Squadra> toEntityList(List<SquadraDTO> squadraDTOs);
}

