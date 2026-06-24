package com.congreats.application.usecase;

import com.congreats.application.port.out.EmailNotifier;
import com.congreats.application.port.out.NotificationPreferencesRepository;
import com.congreats.application.port.out.SmsNotifier;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.model.NotificationPreferences;
import com.congreats.domain.model.User;
import com.congreats.domain.model.ValidationStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.util.UUID;

@ApplicationScoped
public class SendValidationNotificationUseCase {

    private static final Logger LOG = Logger.getLogger(SendValidationNotificationUseCase.class);

    @Inject UserRepository userRepository;
    @Inject NotificationPreferencesRepository prefsRepository;
    @Inject EmailNotifier emailNotifier;
    @Inject SmsNotifier smsNotifier;

    @ConfigProperty(name = "congreats.app.url", defaultValue = "http://localhost:5173")
    String appUrl;

    public void execute(UUID userId, String skill, ValidationStatus status) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) return;

            NotificationPreferences prefs = prefsRepository.findByUserId(userId)
                    .orElse(NotificationPreferences.defaultFor(userId));

            String validationsUrl = appUrl + "/validations/mine";
            String subject;
            String body;
            String smsBody;

            if (status == ValidationStatus.IN_PROGRESS) {
                subject = "Um validador foi atribuído à sua habilidade " + skill;
                body = """
                        <p>Olá, <strong>%s</strong>!</p>
                        <p>Um validador foi atribuído para avaliar sua habilidade <strong>%s</strong>.</p>
                        <p><a href="%s">Ver status da validação →</a></p>
                        """.formatted(user.name(), skill, validationsUrl);
                smsBody = "Um validador foi atribuído para sua habilidade " + skill + " no Congreats.";
            } else if (status == ValidationStatus.APPROVED) {
                subject = "✅ Sua habilidade " + skill + " foi validada!";
                body = """
                        <p>Parabéns, <strong>%s</strong>!</p>
                        <p>Sua habilidade <strong>%s</strong> foi validada no Congreats.</p>
                        <p><a href="%s">Ver suas validações →</a></p>
                        """.formatted(user.name(), skill, validationsUrl);
                smsBody = "Sua habilidade " + skill + " foi validada no Congreats! " + validationsUrl;
            } else if (status == ValidationStatus.REJECTED) {
                subject = "Resultado da validação da habilidade " + skill;
                body = """
                        <p>Olá, <strong>%s</strong>!</p>
                        <p>A validação da sua habilidade <strong>%s</strong> foi concluída.</p>
                        <p><a href="%s">Ver detalhes →</a></p>
                        """.formatted(user.name(), skill, validationsUrl);
                smsBody = "A validação de " + skill + " foi concluída. Veja os detalhes: " + validationsUrl;
            } else {
                return;
            }

            if (prefs.emailEnabled())
                emailNotifier.send(user.email().value(), subject, body);

            if (prefs.whatsappEnabled() && prefs.whatsappNumber() != null)
                smsNotifier.sendWhatsApp(prefs.whatsappNumber(), smsBody);

            if (prefs.smsEnabled() && prefs.smsNumber() != null)
                smsNotifier.sendSms(prefs.smsNumber(), smsBody);

        } catch (Exception e) {
            LOG.warnf("Falha ao enviar notificação de validação para %s: %s", userId, e.getMessage());
        }
    }
}
