package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.repository.LegaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
@Slf4j
public class LegaService {
    private final LegaRepository legaRepository;
    private final LegaMapper legaMapper;

    public List<LegaDTO> prova() {
        Iterable<Lega> all = legaRepository.findAll();
        List<Lega> l = StreamSupport.stream(legaRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
        return legaMapper.toDTOList(l);
    }

    public List<LegaDTO>  mieLeghe(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userId;
        // Supponendo che principal sia una classe custom con getId(), altrimenti adattare
        if (principal instanceof it.ddlsolution.survivor.entity.Giocatore) {
            userId = ((it.ddlsolution.survivor.entity.Giocatore) principal).getId();
        } else {
            // Gestione alternativa, ad esempio se principal è uno username
            userId = 1L; // fallback temporaneo
        }
        return legheUser(userId);
    }

    public List<LegaDTO> legheUser(Long userId) {
        List<Lega> byGiocatoriUserId = legaRepository.findByGiocatori_User_Id(userId);
        return legaMapper.toDTOList(byGiocatoriUserId);
    }

    public LegaDTO getLegaById(Long id) {
        LegaDTO legaDTO = legaRepository.findById(id)
                .map(legaMapper::toDTO)
                .orElse(null);
        legaDTO.setGiocatori(
                legaDTO.getGiocatori().stream().sorted(Comparator.comparing(GiocatoreDTO::getId)).toList()
        );
        return legaDTO;
    }

}
