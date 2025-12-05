package it.ddlsolution.survivor.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@survivor.com}")
    private String fromEmail;

    public void sendMagicLinkEmail(String to, String magicLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Il tuo Magic Link per accedere a Survivor");
            message.setText(buildEmailContent(magicLink));

            mailSender.send(message);
            log.info("Email inviata con successo a: {}", to);
        } catch (Exception e) {
            log.error("Errore nell'invio dell'email a: {}", to, e);
            throw new RuntimeException("Errore nell'invio dell'email", e);
        }
    }

    private String buildEmailContent(String magicLink) {
        return """
            Ciao,
            
            Clicca sul link seguente per accedere a Survivor:
            
            %s
            
            Questo link è valido per 15 minuti.
            
            Se non hai richiesto questo accesso, ignora questa email.
            
            Saluti,
            Il team di Survivor
            """.formatted(magicLink);
    }
}

