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
        String normalizedEmail = email.toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> createNewUser(normalizedEmail));
        return user;
    }

    @Transactional(readOnly = true)
    public User findByEmailExisting(String email) {
        return userRepository.findByEmailIgnoreCase(email.toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));
    }


    @Transactional
    public User createNewUser(String email) {
        String normalizedEmail = email.toLowerCase();
        User user = new User();
        user.setEmail(normalizedEmail);
        user.setName(extractNameFromEmail(normalizedEmail));
        user.setEnabled(true);
        return userRepository.save(user);
    }

    private String extractNameFromEmail(String email) {
        return email.substring(0, email.indexOf('@'));
    }

}

