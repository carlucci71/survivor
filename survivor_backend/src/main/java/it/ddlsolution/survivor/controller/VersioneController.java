package it.ddlsolution.survivor.controller;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@RestController
public class VersioneController {

    record MinVersionResponse(int minVersionCode) {}

    @Value("${app.min-version-code}")
    private int minVersionCode;

    private static final DateTimeFormatter BUILD_TIME_FORMAT = DateTimeFormatter
            .ofPattern("dd/MM/yyyy HH:mm")
            .withZone(ZoneId.of("Europe/Rome"));

    private final BuildProperties buildProperties;

    public VersioneController(ObjectProvider<BuildProperties> buildProperties) {
        this.buildProperties = buildProperties.getIfAvailable();
    }

    @GetMapping(value = "/versione", produces = MediaType.TEXT_PLAIN_VALUE)
    public String getVersion() {
        if (buildProperties == null) {
            return "N/D";
        }
        return BUILD_TIME_FORMAT.format(buildProperties.getTime());
    }

    @GetMapping(value = "/versione/minima", produces = MediaType.APPLICATION_JSON_VALUE)
    public MinVersionResponse getMinVersion() {
        return new MinVersionResponse(minVersionCode);
    }
}