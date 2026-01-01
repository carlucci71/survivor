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

    @Transactional
    public User salva(User user) {
        return userRepository.save(user);
    }


    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email));
        return user;
    }


    @Transactional
    public User createNewUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setName(extractNameFromEmail(email));
        user.setEnabled(true);
        return userRepository.save(user);
    }

    private String extractNameFromEmail(String email) {
        return email.substring(0, email.indexOf('@'));
    }

}

