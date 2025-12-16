package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.UserDTO;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.mapper.UserMapper;
import it.ddlsolution.survivor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userrMapper;

    @Transactional(readOnly = true)
    public UserDTO userById(Long userId) {
        return userrMapper.toDTO(userRepository.findById(userId).orElseGet(()->new User()));
    }
}

