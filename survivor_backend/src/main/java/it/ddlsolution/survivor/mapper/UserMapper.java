package it.ddlsolution.survivor.mapper;

import it.ddlsolution.survivor.dto.UserDTO;
import it.ddlsolution.survivor.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper extends DtoMapper<UserDTO, User> {
}

