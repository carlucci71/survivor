package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {GiocataMapper.class})
public interface GiocatoreMapper {

    GiocatoreDTO toDTO(Giocatore giocatore);

    @Mapping(target = "leghe", ignore = true)
    Giocatore toEntity(GiocatoreDTO giocatoreDTO);

    List<GiocatoreDTO> toDTOList(List<Giocatore> giocatori);

    List<Giocatore> toEntityList(List<GiocatoreDTO> giocatoreDTOs);
}

