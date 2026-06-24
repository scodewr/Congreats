package com.congreats.application.port.out;

public interface EmailNotifier {
    void send(String to, String subject, String htmlBody);
}
