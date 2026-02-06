package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.NotificationDTO;
import it.ddlsolution.survivor.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class NotificationMapper implements DtoMapper<NotificationDTO, Notification> {
}

