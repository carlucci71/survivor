package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.PartitaMockDTO;
import it.ddlsolution.survivor.entity.PartitaMock;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CampionatoMapper.class})
public abstract class PartitaMockMapper implements DtoMapper<PartitaMockDTO, PartitaMock> {

    @Mapping(target = "campionatoId", source = "campionato.id")
    public abstract PartitaMockDTO toDTO(PartitaMock partita);

    @Mapping(target = "campionato.id", source = "campionatoId")
    public abstract PartitaMock toEntity(PartitaMockDTO partitaDTO);
}

