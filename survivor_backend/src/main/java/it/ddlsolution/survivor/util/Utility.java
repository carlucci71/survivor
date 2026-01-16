package it.ddlsolution.survivor.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.TimeZone;

@Component
@Slf4j
public class Utility {
    @Autowired
    public final static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
    public final static SimpleDateFormat dateFormatLite = new SimpleDateFormat("yyyyMMdd");
    ObjectMapper mapper = null;

    public StopWatch startStopWatch(String nome){
        StopWatch stopWatch = new StopWatch(nome);
        stopWatch.start();
        return stopWatch;
    }
    public void stopStopWatch(StopWatch stopWatch){
        stopWatch.stop();
        log.info("process {} executed in {} ms",stopWatch.getId() , stopWatch.getTotalTimeMillis());
    }

    private ObjectMapper getMapper() {
        if (mapper == null) {
            mapperGetInstance();
        }
        return mapper;
    }

    private synchronized void mapperGetInstance() {
        if (mapper == null) {
            mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        }
    }

    public String toJson(Object o) {
        try {
            byte[] data = getMapper().writeValueAsBytes(o);
            return new String(data, StandardCharsets.ISO_8859_1);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String toJson(Object o, Charset charset) {
        try {
            byte[] data = getMapper().writeValueAsBytes(o);
            return new String(data, charset);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public <T> T fromJson(String json, Class<T> clazz) {
        try {
            return getMapper().readValue(json, clazz);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Calendar datasimpleToCalendar(String dataRiferimento) {
        try {
            Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Europe/Rome"));
            calendar.setTime(dateFormatLite.parse(dataRiferimento));
            return calendar;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String calendarToDatasimple(Calendar dataRiferimento) {
        return dateFormatLite.format(dataRiferimento.getTime());
    }


    public String calendarToData(Calendar dataRiferimento, String pattern) {
        return new SimpleDateFormat(pattern).format(dataRiferimento.getTime());
    }


    public static BigDecimal bdFromDouble(Double d) {
        return new BigDecimal(String.valueOf(Double.toString(d)));
    }

    public static BigDecimal bdFromFloat(Float d) {
        return new BigDecimal(String.valueOf(Float.toString(d)));
    }

    public static long diffDateFromFormatLite(String primaData, String secondaData) {


        LocalDate primaDataL = LocalDate.of(Integer.parseInt(primaData.substring(0, 4)), Integer.parseInt(primaData.substring(4, 6)), Integer.parseInt(primaData.substring(6, 8)));
        LocalDate secondaDataL = LocalDate.of(Integer.parseInt(secondaData.substring(0, 4)), Integer.parseInt(secondaData.substring(4, 6)), Integer.parseInt(secondaData.substring(6, 8)));

        // Calcola la differenza tra le due date
        long differenzaGiorni = ChronoUnit.DAYS.between(secondaDataL, primaDataL);
        return differenzaGiorni;
    }

    public static BigDecimal roundBigDecimal(BigDecimal value, int newScale) {
        if (value == null) return BigDecimal.ZERO.stripTrailingZeros();
        return value.setScale(newScale, RoundingMode.HALF_UP);
    }


}
