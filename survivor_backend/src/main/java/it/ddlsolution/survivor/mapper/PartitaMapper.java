package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.entity.Partita;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class})
public abstract class PartitaMapper implements DtoMapper<PartitaDTO, Partita> {

    @Mapping(target = "sportId", source = "campionato.sport.id")
    @Mapping(target = "campionatoId", source = "campionato.id")
    public abstract PartitaDTO toDTO(Partita partita);

    @Mapping(target = "campionato.id", source = "campionatoId")
    @Mapping(target = "campionato.sport.id", source = "sportId")
    public abstract Partita toEntity(PartitaDTO partitaDTO);
}

