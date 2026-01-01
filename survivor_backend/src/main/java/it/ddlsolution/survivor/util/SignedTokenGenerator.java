package it.ddlsolution.survivor.util;

import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class SignedTokenGenerator {
    private SecureRandom secureRandom = new SecureRandom();
    private SecretKey secretKey;
    public static final String MAGIC_LINK_SECRET_TOKEN = "0349dffb83027c2e2ba5b1cdf14bd63c5bdf9f809466c056999cfb754bf4092b";//TODO in yaml

    public SignedTokenGenerator() {
        this.secretKey = new SecretKeySpec(MAGIC_LINK_SECRET_TOKEN.getBytes(), "HmacSHA256");
    }

    public String generateToken(String addInfo)  {
        try {
            byte[] randomBytes = new byte[16];
            secureRandom.nextBytes(randomBytes);
            String randomPart = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

            String payload = randomPart + "." + (ObjectUtils.isEmpty(addInfo) ? "NO_DATA" : addInfo);

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKey);
            byte[] signature = mac.doFinal(payload.getBytes());
            String signaturePart = Base64.getUrlEncoder().withoutPadding().encodeToString(signature);

            return payload + "." + signaturePart;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean verifyAndExtract(String token) {
        try {
            // split limitato a 3 per preservare eventuali punti in addInfo
            String[] parts = token.split("\\.", 3);
            if (parts.length != 3) return false;

            String payload = parts[0] + "." + parts[1];
            String receivedSignature = parts[2];

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKey);
            byte[] expectedSignature = mac.doFinal(payload.getBytes());
            String expectedSignaturePart = Base64.getUrlEncoder().withoutPadding().encodeToString(expectedSignature);

            return expectedSignaturePart.equals(receivedSignature);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // Metodo di utilità per ottenere addInfo (null se NON_DATA o firma non valida)
    public String extractAddInfo(String token) {
        if (!verifyAndExtract(token)) return null;
        String[] parts = token.split("\\.", 3);
        String addInfo = parts[1];
        return "NO_DATA".equals(addInfo) ? "" : addInfo;
    }
}
