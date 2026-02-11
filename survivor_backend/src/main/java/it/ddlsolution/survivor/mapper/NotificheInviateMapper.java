package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.NotificheInviateDTO;
import it.ddlsolution.survivor.entity.NotificheInviate;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class NotificheInviateMapper implements DtoMapper<NotificheInviateDTO, NotificheInviate> {



}
