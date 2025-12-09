package it.ddlsolution.survivor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/admin")

@RestController
public class AdminController {

    @GetMapping
    public ResponseEntity<String> prova(){
        return ResponseEntity.ok("BRAVO!");
    }
}
