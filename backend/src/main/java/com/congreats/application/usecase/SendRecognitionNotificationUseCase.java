package com.congreats.application.usecase;

import com.congreats.application.port.out.EmailNotifier;
import com.congreats.application.port.out.NotificationPreferencesRepository;
import com.congreats.application.port.out.SmsNotifier;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.model.NotificationPreferences;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class SendRecognitionNotificationUseCase {

    private static final Logger LOG = Logger.getLogger(SendRecognitionNotificationUseCase.class);

    @Inject UserRepository userRepository;
    @Inject NotificationPreferencesRepository prefsRepository;
    @Inject EmailNotifier emailNotifier;
    @Inject SmsNotifier smsNotifier;

    @ConfigProperty(name = "congreats.app.url", defaultValue = "http://localhost:5173")
    String appUrl;

    public void execute(UUID recognizedId, String recognizerName, String categoryName, List<String> skills, String testimonial) {
        try {
            User recognized = userRepository.findById(recognizedId).orElse(null);
            if (recognized == null) return;

            NotificationPreferences prefs = prefsRepository.findByUserId(recognizedId)
                    .orElse(NotificationPreferences.defaultFor(recognizedId));

            String shortTestimonial = testimonial.length() > 120
                    ? testimonial.substring(0, 120) + "…"
                    : testimonial;
            String skillList = String.join(", ", skills);
            String profileUrl = appUrl + "/profile/" + recognizedId;

            if (prefs.emailEnabled()) {
                String subject = "🎉 " + recognizerName + " te reconheceu no Congreats!";
                String body = """
                        <p>Olá, <strong>%s</strong>!</p>
                        <p><strong>%s</strong> te reconheceu em <strong>%s</strong>.</p>
                        <p><em>Habilidades destacadas:</em> %s</p>
                        <blockquote>"%s"</blockquote>
                        <p><a href="%s">Ver seu perfil →</a></p>
                        """.formatted(recognized.name(), recognizerName, categoryName, skillList, shortTestimonial, profileUrl);
                emailNotifier.send(recognized.email().value(), subject, body);
            }

            String smsBody = recognizerName + " te reconheceu em " + categoryName + " no Congreats! " + profileUrl;

            if (prefs.whatsappEnabled() && prefs.whatsappNumber() != null)
                smsNotifier.sendWhatsApp(prefs.whatsappNumber(), smsBody);

            if (prefs.smsEnabled() && prefs.smsNumber() != null)
                smsNotifier.sendSms(prefs.smsNumber(), smsBody);

        } catch (Exception e) {
            LOG.warnf("Falha ao enviar notificação de reconhecimento para %s: %s", recognizedId, e.getMessage());
        }
    }
}
