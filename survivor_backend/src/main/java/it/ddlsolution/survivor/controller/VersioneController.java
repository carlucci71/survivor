package it.ddlsolution.survivor.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
public class VersioneController {

    record MinVersionResponse(int minVersionCode) {}

    @GetMapping(value = "/versione", produces = MediaType.TEXT_PLAIN_VALUE)
    public String getVersion() throws Exception {
        try {
            return new String(Files.readAllBytes(Paths.get("build_be.html")), StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "N/D";
        }
    }

    @GetMapping(value = "/versione/minima", produces = MediaType.APPLICATION_JSON_VALUE)
    public MinVersionResponse getMinVersion() {
        try {
            String content = new String(Files.readAllBytes(Paths.get("min_version_code.txt")), StandardCharsets.UTF_8).trim();
            return new MinVersionResponse(Integer.parseInt(content));
        } catch (Exception e) {
            return new MinVersionResponse(0);
        }
    }
}