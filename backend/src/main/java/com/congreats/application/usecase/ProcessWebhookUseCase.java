package com.congreats.application.usecase;

import com.congreats.application.port.out.IntegrationRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Email;
import com.congreats.domain.model.Integration;
import com.congreats.domain.model.IntegrationPlatform;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class ProcessWebhookUseCase {

    private static final Logger LOG = Logger.getLogger(ProcessWebhookUseCase.class);

    @Inject IntegrationRepository integrationRepository;
    @Inject UserRepository userRepository;
    @Inject CreateRecognitionUseCase createRecognition;

    public record WebhookEvent(String platform, String secret, String signature,
                                String payload, Map<String, Object> parsed) {}

    public void execute(WebhookEvent event) {
        Integration integration = integrationRepository.findByWebhookSecret(event.secret())
                .orElseThrow(() -> new NotFoundException("Integração não encontrada"));

        if (!integration.active())
            throw new DomainException("Integração desativada");

        if (!verifySignature(event.signature(), event.payload(), integration.webhookSecret(), integration.platform()))
            throw new DomainException("Assinatura inválida");

        WebhookData data = extractData(integration.platform(), event.parsed());
        if (data == null) {
            LOG.infof("Payload ignorado para plataforma %s — evento não suportado", integration.platform());
            return;
        }

        Optional<User> recognized = userRepository.findByEmail(new Email(data.recipientEmail()));
        if (recognized.isEmpty()) {
            LOG.infof("Usuário com email %s não encontrado, webhook ignorado", data.recipientEmail());
            return;
        }

        createRecognition.execute(new CreateRecognitionUseCase.Command(
                integration.ownerId(),
                recognized.get().id(),
                data.categoryName(),
                data.skills(),
                data.message(),
                null, null,
                integration.workspaceId()
        ));
    }

    private boolean verifySignature(String signature, String payload, String secret, IntegrationPlatform platform) {
        if (signature == null || signature.isBlank()) return false;
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] computed = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String hex = HexFormat.of().formatHex(computed);
            String expected = switch (platform) {
                case GITHUB -> "sha256=" + hex;
                case JIRA, LINEAR -> hex;
            };
            return constantTimeEquals(expected, signature);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            return false;
        }
    }

    private boolean constantTimeEquals(String a, String b) {
        if (a.length() != b.length()) return false;
        int diff = 0;
        for (int i = 0; i < a.length(); i++) diff |= a.charAt(i) ^ b.charAt(i);
        return diff == 0;
    }

    @SuppressWarnings("unchecked")
    private WebhookData extractData(IntegrationPlatform platform, Map<String, Object> body) {
        return switch (platform) {
            case GITHUB -> extractGitHub(body);
            case JIRA -> extractJira(body);
            case LINEAR -> extractLinear(body);
        };
    }

    @SuppressWarnings("unchecked")
    private WebhookData extractGitHub(Map<String, Object> body) {
        // pull_request merged or issue closed with assignee
        String action = (String) body.get("action");
        Map<String, Object> pr = (Map<String, Object>) body.get("pull_request");
        if (pr == null) return null;
        if (!"closed".equals(action) || !Boolean.TRUE.equals(pr.get("merged"))) return null;

        Map<String, Object> assignee = (Map<String, Object>) pr.get("assignee");
        if (assignee == null) return null;
        String email = (String) assignee.get("email");
        if (email == null) return null;

        String title = (String) pr.getOrDefault("title", "Pull Request");
        return new WebhookData(email, "Contribuição Técnica",
                java.util.List.of("Code Review", "GitHub"),
                "Pull Request mergeado: " + title);
    }

    @SuppressWarnings("unchecked")
    private WebhookData extractJira(Map<String, Object> body) {
        String webhookEvent = (String) body.get("webhookEvent");
        if (!"jira:issue_updated".equals(webhookEvent)) return null;

        Map<String, Object> issue = (Map<String, Object>) body.get("issue");
        if (issue == null) return null;
        Map<String, Object> fields = (Map<String, Object>) issue.get("fields");
        if (fields == null) return null;
        Map<String, Object> assignee = (Map<String, Object>) fields.get("assignee");
        if (assignee == null) return null;
        String email = (String) assignee.get("emailAddress");
        if (email == null) return null;

        String summary = (String) fields.getOrDefault("summary", "Tarefa");
        return new WebhookData(email, "Entrega de Projeto",
                java.util.List.of("Jira", "Execução"),
                "Tarefa concluída no Jira: " + summary);
    }

    @SuppressWarnings("unchecked")
    private WebhookData extractLinear(Map<String, Object> body) {
        String type = (String) body.get("type");
        if (!"Issue".equals(type)) return null;
        Map<String, Object> data = (Map<String, Object>) body.get("data");
        if (data == null) return null;
        String state = (String) ((Map<String, Object>) data.getOrDefault("state", Map.of())).get("name");
        if (!"Done".equals(state) && !"Completed".equals(state)) return null;

        Map<String, Object> assignee = (Map<String, Object>) data.get("assignee");
        if (assignee == null) return null;
        String email = (String) assignee.get("email");
        if (email == null) return null;

        String title = (String) data.getOrDefault("title", "Issue");
        return new WebhookData(email, "Entrega de Projeto",
                java.util.List.of("Linear", "Execução"),
                "Issue concluída no Linear: " + title);
    }

    private record WebhookData(String recipientEmail, String categoryName,
                                java.util.List<String> skills, String message) {}
}
