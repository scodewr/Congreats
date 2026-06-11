package com.congreats.application.dto;

import java.util.List;

public record PageResult<T>(List<T> content, long total, int page, int size) {
    public boolean hasNext() {
        return (long) (page + 1) * size < total;
    }
}
