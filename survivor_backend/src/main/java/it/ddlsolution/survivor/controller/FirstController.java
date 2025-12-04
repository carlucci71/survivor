package it.ddlsolution.survivor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/first")

@RestController
public class FirstController {
    @GetMapping
    public ResponseEntity<String> prova(){
        return ResponseEntity.ok("ciao");
    }
}
