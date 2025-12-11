package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.entity.Lega;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class, GiocatoreMapper.class})
public interface LegaMapper {

    LegaDTO toDTO(Lega lega);

    Lega toEntity(LegaDTO legaDTO);

    List<LegaDTO> toDTOList(List<Lega> leghe);

    List<Lega> toEntityList(List<LegaDTO> legaDTOs);
}

