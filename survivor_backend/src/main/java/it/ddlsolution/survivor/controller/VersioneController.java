package it.ddlsolution.survivor.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
public class VersioneController {

    @GetMapping(value = "/versione", produces = MediaType.TEXT_PLAIN_VALUE)
    public String getVersion() throws Exception {
        try {
            return new String(Files.readAllBytes(Paths.get("build_be.html")), StandardCharsets.UTF_16);
        } catch (Exception e) {
            return "N/D";
        }
    }
}