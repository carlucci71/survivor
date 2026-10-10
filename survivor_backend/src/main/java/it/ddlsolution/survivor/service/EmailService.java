package it.ddlsolution.survivor.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    @Transactional
    public void send(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            log.info("Email inviata con successo a: {}", to);
        } catch (Exception e) {
            log.error("Errore nell'invio dell'email a: {}", to, e);
            throw new RuntimeException("Errore nell'invio dell'email", e);
        }
    }

    /**
     * Invia una mail multipart (testo semplice + HTML). I filtri antispam trattano meglio i messaggi con
     * entrambe le parti e un link dietro un pulsante rispetto a un testo con un URL lungo da solo.
     */
    @Transactional
    public void sendHtml(String to, String subject, String textBody, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(textBody, htmlBody);

            mailSender.send(message);
            log.info("Email inviata con successo a: {}", to);
        } catch (Exception e) {
            log.error("Errore nell'invio dell'email a: {}", to, e);
            throw new RuntimeException("Errore nell'invio dell'email", e);
        }
    }

}

