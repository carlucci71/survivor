package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.UserDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GiocatoreService {
    private final GiocatoreRepository giocatoreRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final GiocatoreMapper giocatoreMapper;
    private final GiocataRepository giocataRepository;

    @Transactional
    public GiocatoreDTO me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        return giocatoreMapper.projectionToDTO(giocatoreRepository.findProjectionByUserId(userId).orElseGet(
                () -> {
                    //Se non esiste ancora un giocatore associato allo user, lo creo e glielo associo
                    Giocatore giocatore = new Giocatore();
                    User user = userRepository.findById(userId).get();
                    giocatore.setUser(user);
                    giocatore.setNome(user.getName());
                    giocatoreRepository.save(giocatore);
                    return giocatoreRepository.findProjectionByUserId(userId).get();
                }
        ));
    }

    @Transactional
    public Giocatore findMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        return giocatoreRepository.findByUser_Id(userId).orElseGet(()->{
            User user = userRepository.findById(userId).get();
            Giocatore giocatore=new Giocatore();
            giocatore.setNome(user.getName());
            giocatore.setUser(user);
            giocatoreRepository.save(giocatore);
            return giocatore;
        });
    }

    @Transactional
    public GiocatoreDTO findByUserId(Long userId) {
        return giocatoreMapper.toDTO(giocatoreRepository.findByUser_Id(userId).orElseThrow(()->new RuntimeException("Giocatore non trovato con user: " + userId)));
    }

    @Transactional
    public GiocatoreDTO find(Long id) {
        return giocatoreMapper.toDTO(giocatoreRepository.findById(id).orElseThrow(()->new RuntimeException("Giocatore non trovato: " + id)));
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
    public GiocatoreDTO getMyInfoInLega(LegaDTO legaDTO,Long userId) {
        Giocatore giocatore = giocatoreRepository.findByGiocatoreLeghe_Lega_IdAndUser_Id(legaDTO.getId(), userId).orElseThrow(()->new RuntimeException("Ruolo non trovato in lega"));
        return giocatoreMapper.toDTO(giocatore);
    }

}

