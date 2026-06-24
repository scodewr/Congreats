package com.congreats.domain.model;

import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.SelfRecognitionException;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class RecognitionTest {

    private static final UUID RECOGNIZER = UUID.randomUUID();
    private static final UUID RECOGNIZED = UUID.randomUUID();
    private static final UUID CATEGORY = UUID.randomUUID();
    private static final String TESTIMONIAL = "Este profissional é excelente em tudo que faz.";

    @Test
    void create_validRecognition_succeeds() {
        Recognition r = Recognition.create(RECOGNIZER, RECOGNIZED, CATEGORY,
                List.of("Java", "Clean Code"), TESTIMONIAL, null, null, null);
        assertNotNull(r.id());
        assertEquals(RECOGNIZER, r.recognizerId());
        assertEquals(RECOGNIZED, r.recognizedId());
        assertNotNull(r.createdAt());
    }

    @Test
    void selfRecognition_throwsException() {
        assertThrows(SelfRecognitionException.class,
                () -> Recognition.create(RECOGNIZER, RECOGNIZER, CATEGORY,
                        List.of("Java"), TESTIMONIAL, null, null, null));
    }

    @Test
    void emptySkills_throwsException() {
        assertThrows(DomainException.class,
                () -> Recognition.create(RECOGNIZER, RECOGNIZED, CATEGORY,
                        List.of(), TESTIMONIAL, null, null, null));
    }

    @Test
    void shortTestimonial_throwsException() {
        assertThrows(DomainException.class,
                () -> Recognition.create(RECOGNIZER, RECOGNIZED, CATEGORY,
                        List.of("Java"), "Muito bom.", null, null, null));
    }

    @Test
    void skills_normalizedToTitleCase() {
        Recognition r = Recognition.create(RECOGNIZER, RECOGNIZED, CATEGORY,
                List.of("java", "CLEAN CODE", "tdd"), TESTIMONIAL, null, null, null);
        assertEquals(List.of("Java", "Clean code", "Tdd"), r.skills());
    }

    @Test
    void duplicateSkills_deduplicated() {
        Recognition r = Recognition.create(RECOGNIZER, RECOGNIZED, CATEGORY,
                List.of("Java", "java", "JAVA"), TESTIMONIAL, null, null, null);
        assertEquals(1, r.skills().size());
    }

    @Test
    void testimonial_isStripped() {
        Recognition r = Recognition.create(RECOGNIZER, RECOGNIZED, CATEGORY,
                List.of("Java"), "  " + TESTIMONIAL + "  ", null, null, null);
        assertEquals(TESTIMONIAL, r.testimonial());
    }
}
