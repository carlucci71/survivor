package it.ddlsolution.survivor.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;
import java.util.Set;

public interface DtoMapper<D, O> {
    O toEntity(D dto);

    D toDTO(O other);

    List<O> toEntityList(List<D> dtoList);

    List<D> toDTOList(List<O> otherList);

    Set<O> toEntitySet(Set<D> dtoList);

    Set<D> toDTOSet(Set<O> otherList);

    @Named("partialUpdate")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(@MappingTarget O other, D dto);
}
