package it.ddlsolution.survivor.service.externalapi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Map;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;

@Service
@Profile(CALENDARIO_API2)
public class CalendarioAPI2 implements ICalendario{

    @Value("${external-api.calendario.implementation.API2.url}")
    String url;

    @Override
    public Map<String, Object> calendario(String sport, String campionato) {
        return Map.of("url",url);
    }
}
