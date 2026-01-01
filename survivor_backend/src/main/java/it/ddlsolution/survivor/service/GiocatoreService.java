package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GiocatoreService {
    private final GiocatoreRepository giocatoreRepository;
    private final UserRepository userRepository;
    private final GiocatoreMapper giocatoreMapper;

    @Transactional
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

    @Transactional
    public Giocatore findMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        return giocatoreRepository.findByUser_Id(userId).orElseThrow(()->new RuntimeException("Utente non trovato: " + userId));
    }


    @Transactional
    public GiocatoreDTO aggiorna(GiocatoreDTO giocatoreDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        Giocatore giocatore = giocatoreRepository.findById(giocatoreDTO.getId()).get();
        // Aggiorna solo i campi della tabella giocatore
        giocatore.setNome(giocatoreDTO.getNome());

        giocatoreRepository.save(giocatore);
        return giocatoreMapper.projectionToDTO(giocatoreRepository.findProjectionByUserId(userId).get());
    }

    @Transactional(readOnly = true)
    public GiocatoreDTO getMyInfoInLega(LegaDTO legaDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        Giocatore giocatore = giocatoreRepository.findByGiocatoreLeghe_Lega_IdAndUser_Id(legaDTO.getId(), userId).orElse(new Giocatore());//TODO rilanciare ()->new RuntimeException("Ruolo non trovato in lega")
        return giocatoreMapper.toDTO(giocatore);
    }

}

