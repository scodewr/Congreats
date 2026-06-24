package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.EmailNotifier;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

@ApplicationScoped
public class QuarkusEmailNotifier implements EmailNotifier {

    private static final Logger LOG = Logger.getLogger(QuarkusEmailNotifier.class);

    @Inject
    Mailer mailer;

    @Override
    public void send(String to, String subject, String htmlBody) {
        try {
            mailer.send(Mail.withHtml(to, subject, htmlBody));
        } catch (Exception e) {
            LOG.warnf("Falha ao enviar e-mail para %s: %s", to, e.getMessage());
        }
    }
}
