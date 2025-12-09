package it.ddlsolution.survivor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/util")

@RestController
@RequiredArgsConstructor
public class UtilController {

    private final Environment environment;


    @GetMapping("/profilo")
    public ResponseEntity<Map<String,String>> profilo(){
        String[] activeProfiles = environment.getActiveProfiles();
        String profilo = activeProfiles.length > 0 ? String.join(", ", activeProfiles) : "default";

        return ResponseEntity.ok(Map.of("profilo",profilo));
    }
}
