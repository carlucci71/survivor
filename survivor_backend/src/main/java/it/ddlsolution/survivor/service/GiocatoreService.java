package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GiocatoreService {
    private final GiocatoreRepository giocatoreRepository;
    private final UserRepository userRepository;
    private final GiocatoreMapper giocatoreMapper;

    public GiocatoreDTO me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        return giocatoreMapper.projectionToDTO(giocatoreRepository.findProjectionByUserId(userId).orElseGet(
                () -> {
                    Giocatore giocatore = new Giocatore();
                    giocatore.setNome("TBD");
                    giocatore.setUser(userRepository.findById(userId).get());
                    giocatoreRepository.save(giocatore);
                    return giocatoreRepository.findProjectionByUserId(giocatore.getId()).get();
                }
        ));
    }

    public GiocatoreDTO aggiorna(GiocatoreDTO giocatoreDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        Giocatore giocatore = giocatoreRepository.findById(giocatoreDTO.getId()).get();
        // Aggiorna solo i campi della tabella giocatore
        giocatore.setNome(giocatoreDTO.getNome());

        giocatoreRepository.save(giocatore);
        return giocatoreMapper.projectionToDTO(giocatoreRepository.findProjectionByUserId(userId).get());
    }
}

