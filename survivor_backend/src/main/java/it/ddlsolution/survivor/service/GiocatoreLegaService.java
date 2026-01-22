package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.entity.GiocatoreLega;
import it.ddlsolution.survivor.repository.GiocatoreLegaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GiocatoreLegaService {

    private final GiocatoreLegaRepository giocatoreLegaRepository;

    @Transactional
    public Optional<GiocatoreLega> findByLega_IdAndGiocatore_User_Id(Long idLega, Long userId) {
        return giocatoreLegaRepository.findByLega_IdAndGiocatore_User_Id(idLega, userId);
    }


}

