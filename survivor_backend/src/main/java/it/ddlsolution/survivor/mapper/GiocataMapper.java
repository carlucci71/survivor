package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.entity.Giocata;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {GiocatoreMapper.class, SquadraMapper.class})
public interface GiocataMapper {

    @Mapping(source = "giocatore.id", target = "giocatoreId")
    @Mapping(source = "squadra.id", target = "squadraId")
    GiocataDTO toDTO(Giocata giocata);

    @Mapping(source = "giocatoreId", target = "giocatore.id")
    @Mapping(source = "squadraId", target = "squadra.id")
    Giocata toEntity(GiocataDTO giocataDTO);

    List<GiocataDTO> toDTOList(List<Giocata> giocate);

    List<Giocata> toEntityList(List<GiocataDTO> giocataDTOs);
}

