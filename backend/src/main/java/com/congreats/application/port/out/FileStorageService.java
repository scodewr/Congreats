package com.congreats.application.port.out;

import java.io.IOException;

public interface FileStorageService {
    String store(byte[] content, String filename, String mimeType) throws IOException;
    void delete(String url) throws IOException;
}
