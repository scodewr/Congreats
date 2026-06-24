package com.congreats.application.port.out;

public interface SmsNotifier {
    void sendSms(String to, String message);
    void sendWhatsApp(String to, String message);
}
