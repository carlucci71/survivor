package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.SquadraRepository;
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
    private final SquadraRepository squadraRepository;

    @Transactional
    public GiocatoreDTO me() {
        // Usa l'entity completa (non la projection) per popolare statiPerLega e ruoliPerLega via @AfterMapping
        return giocatoreMapper.toDTO(findMe());
    }


    @Transactional
    public Giocatore findMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        return giocatoreRepository.findByUser_Id(userId).orElseGet(()->{
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User non trovato: " + userId));
            Giocatore giocatore=new Giocatore();
            giocatore.setNickname(user.getName());
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
    public GiocatoreDTO findById(Long id) {
        return giocatoreMapper.toDTO(findByIdEntity(id));
    }

    @Transactional
    public Giocatore findByIdEntity(Long id) {
        return giocatoreRepository.findById(id).orElseThrow(()->new RuntimeException("Giocatore non trovato: " + id));
    }


    @Transactional
    public GiocatoreDTO aggiorna(GiocatoreDTO giocatoreDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        Giocatore giocatore = giocatoreRepository.findById(giocatoreDTO.getId())
            .orElseThrow(() -> new RuntimeException("Giocatore non trovato con id: " + giocatoreDTO.getId()));

        // Aggiorna solo i campi della tabella giocatore
        giocatore.setNickname(giocatoreDTO.getNickname());

        // Aggiorna nickname (opzionale)
        if (giocatoreDTO.getNickname() != null && !giocatoreDTO.getNickname().trim().isEmpty()) {
            giocatore.setNickname(giocatoreDTO.getNickname().trim());
        } else {
            giocatore.setNickname(null);
        }

        // Aggiorna squadra del cuore (opzionale)
        if (giocatoreDTO.getSquadraCuore() != null && giocatoreDTO.getSquadraCuore().getId() != null) {
            // Usa l'ID (Long) per cercare la squadra
            Squadra squadra = squadraRepository.findById(giocatoreDTO.getSquadraCuore().getId())
                .orElse(null);
            if (squadra != null) {
                System.out.println("✅ Squadra del cuore (Calcio) salvata: ID=" + squadra.getId() + ", Nome=" + squadra.getNome());
            }
            giocatore.setSquadraCuore(squadra);
        } else if (giocatoreDTO.getSquadraCuore() != null && giocatoreDTO.getSquadraCuore().getNome() != null) {
            // Fallback: cerca per nome se non c'è ID
            Squadra squadra = squadraRepository.findByNome(giocatoreDTO.getSquadraCuore().getNome())
                .orElse(null);
            if (squadra != null) {
                System.out.println("✅ Squadra del cuore (Calcio) salvata (da nome): ID=" + squadra.getId() + ", Nome=" + squadra.getNome());
            }
            giocatore.setSquadraCuore(squadra);
        } else {
            giocatore.setSquadraCuore(null);
        }

        // Aggiorna squadra basket del cuore (opzionale)
        if (giocatoreDTO.getSquadraBasketCuore() != null && giocatoreDTO.getSquadraBasketCuore().getId() != null) {
            Squadra squadra = squadraRepository.findById(giocatoreDTO.getSquadraBasketCuore().getId())
                .orElse(null);
            if (squadra != null) {
                System.out.println("✅ Squadra del cuore (Basket) salvata: ID=" + squadra.getId() + ", Nome=" + squadra.getNome());
            }
            giocatore.setSquadraBasketCuore(squadra);
        } else if (giocatoreDTO.getSquadraBasketCuore() != null && giocatoreDTO.getSquadraBasketCuore().getNome() != null) {
            Squadra squadra = squadraRepository.findByNome(giocatoreDTO.getSquadraBasketCuore().getNome())
                .orElse(null);
            if (squadra != null) {
                System.out.println("✅ Squadra del cuore (Basket) salvata (da nome): ID=" + squadra.getId() + ", Nome=" + squadra.getNome());
            }
            giocatore.setSquadraBasketCuore(squadra);
        } else {
            giocatore.setSquadraBasketCuore(null);
        }

        // Aggiorna tennista del cuore (opzionale)
        if (giocatoreDTO.getTennistaCuore() != null && giocatoreDTO.getTennistaCuore().getId() != null) {
            Squadra squadra = squadraRepository.findById(giocatoreDTO.getTennistaCuore().getId())
                .orElse(null);
            if (squadra != null) {
                System.out.println("✅ Tennista del cuore salvato: ID=" + squadra.getId() + ", Nome=" + squadra.getNome());
            }
            giocatore.setTennistaCuore(squadra);
        } else if (giocatoreDTO.getTennistaCuore() != null && giocatoreDTO.getTennistaCuore().getNome() != null) {
            Squadra squadra = squadraRepository.findByNome(giocatoreDTO.getTennistaCuore().getNome())
                .orElse(null);
            if (squadra != null) {
                System.out.println("✅ Tennista del cuore salvato (da nome): ID=" + squadra.getId() + ", Nome=" + squadra.getNome());
            }
            giocatore.setTennistaCuore(squadra);
        } else {
            giocatore.setTennistaCuore(null);
        }

        giocatoreRepository.save(giocatore);
        return giocatoreMapper.projectionToDTO(
            giocatoreRepository.findProjectionByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Giocatore non trovato per userId: " + userId))
        );
    }

    @Transactional(readOnly = true)
    public GiocatoreDTO getMyInfoInLega(LegaDTO legaDTO,Long userId) {
        Giocatore giocatore = giocatoreRepository.findByGiocatoreLeghe_Lega_IdAndUser_Id(legaDTO.getId(), userId).orElseThrow(()->new RuntimeException("Ruolo non trovato in lega"));
        return giocatoreMapper.toDTO(giocatore);
    }



}

