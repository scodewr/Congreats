package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.SmsNotifier;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@ApplicationScoped
public class TwilioSmsNotifier implements SmsNotifier {

    private static final Logger LOG = Logger.getLogger(TwilioSmsNotifier.class);

    @ConfigProperty(name = "congreats.twilio.account-sid", defaultValue = "")
    String accountSid;

    @ConfigProperty(name = "congreats.twilio.auth-token", defaultValue = "")
    String authToken;

    @ConfigProperty(name = "congreats.twilio.sms-from", defaultValue = "")
    String smsFrom;

    @ConfigProperty(name = "congreats.twilio.whatsapp-from", defaultValue = "")
    String whatsappFrom;

    private final HttpClient http = HttpClient.newHttpClient();

    @Override
    public void sendSms(String to, String message) {
        if (accountSid.isBlank() || smsFrom.isBlank()) {
            LOG.debugf("SMS desabilitado (Twilio não configurado). Para: %s | Mensagem: %s", to, message);
            return;
        }
        sendTwilio(smsFrom, to, message);
    }

    @Override
    public void sendWhatsApp(String to, String message) {
        if (accountSid.isBlank() || whatsappFrom.isBlank()) {
            LOG.debugf("WhatsApp desabilitado (Twilio não configurado). Para: %s | Mensagem: %s", to, message);
            return;
        }
        sendTwilio("whatsapp:" + whatsappFrom, "whatsapp:" + to, message);
    }

    private void sendTwilio(String from, String to, String body) {
        try {
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
            String payload = "From=" + URLEncoder.encode(from, StandardCharsets.UTF_8)
                    + "&To=" + URLEncoder.encode(to, StandardCharsets.UTF_8)
                    + "&Body=" + URLEncoder.encode(body, StandardCharsets.UTF_8);

            String credentials = Base64.getEncoder()
                    .encodeToString((accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Basic " + credentials)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                LOG.warnf("Twilio retornou %d para %s", response.statusCode(), to);
            }
        } catch (Exception e) {
            LOG.warnf("Falha ao enviar mensagem Twilio para %s: %s", to, e.getMessage());
        }
    }
}
