package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.repository.LegaRepository;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RequestMapping("/api/survivorBe/first")

@RestController
public class FirstController {

    private final LegaRepository legaRepository;
    private final LegaMapper legaMapper;
    private final Environment environment;

    public FirstController(LegaRepository legaRepository, LegaMapper legaMapper, Environment environment) {
        this.legaRepository = legaRepository;
        this.legaMapper = legaMapper;
        this.environment = environment;
    }

    @GetMapping
    public ResponseEntity<List<LegaDTO>> prova(){
        Iterable<Lega> all = legaRepository.findAll();
        List<Lega> l = StreamSupport.stream(legaRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
        List<LegaDTO> dtoList = legaMapper.toDTOList(l);

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/profilo")
    public ResponseEntity<Map<String,String>> profilo(){
        String[] activeProfiles = environment.getActiveProfiles();
        String profilo = activeProfiles.length > 0 ? String.join(", ", activeProfiles) : "default";

        return ResponseEntity.ok(Map.of("profilo",profilo));
    }
}
