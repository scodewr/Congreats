package com.congreats.integration;

import io.quarkus.test.junit.QuarkusIntegrationTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusIntegrationTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthFlowIT {

    private static final String EMAIL = "integration@test.com";
    private static final String PASSWORD = "password123";
    private static String accessToken;
    private static String refreshToken;

    @Test
    @Order(1)
    void register_worldMode_returnsTokens() {
        var response = given()
                .contentType(ContentType.JSON)
                .body("""
                    {"name":"Integration User","email":"%s","password":"%s"}
                    """.formatted(EMAIL, PASSWORD))
                .when().post("/auth/register")
                .then()
                .statusCode(201)
                .body("accessToken", notNullValue())
                .body("refreshToken", notNullValue())
                .body("expiresIn", greaterThan(0))
                .extract().response();

        accessToken = response.path("accessToken");
        refreshToken = response.path("refreshToken");
    }

    @Test
    @Order(2)
    void register_duplicateEmail_returns409() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {"name":"Dup","email":"%s","password":"%s"}
                    """.formatted(EMAIL, PASSWORD))
                .when().post("/auth/register")
                .then()
                .statusCode(409);
    }

    @Test
    @Order(3)
    void login_validCredentials_returnsTokens() {
        var response = given()
                .contentType(ContentType.JSON)
                .body("""
                    {"email":"%s","password":"%s"}
                    """.formatted(EMAIL, PASSWORD))
                .when().post("/auth/login")
                .then()
                .statusCode(200)
                .body("accessToken", notNullValue())
                .extract().response();

        accessToken = response.path("accessToken");
        refreshToken = response.path("refreshToken");
    }

    @Test
    @Order(4)
    void login_wrongPassword_returns401() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {"email":"%s","password":"wrong"}
                    """.formatted(EMAIL))
                .when().post("/auth/login")
                .then()
                .statusCode(401);
    }

    @Test
    @Order(5)
    void protectedEndpoint_withoutToken_returns401() {
        given()
                .when().get("/profiles/me")
                .then()
                .statusCode(401);
    }

    @Test
    @Order(6)
    void protectedEndpoint_withToken_returns200() {
        given()
                .header("Authorization", "Bearer " + accessToken)
                .when().get("/profiles/me")
                .then()
                .statusCode(200);
    }

    @Test
    @Order(7)
    void refresh_validToken_returnsNewTokens() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {"refreshToken":"%s"}
                    """.formatted(refreshToken))
                .when().post("/auth/refresh")
                .then()
                .statusCode(200)
                .body("accessToken", notNullValue());
    }

    @Test
    @Order(8)
    void logout_invalidatesRefreshToken() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                    {"refreshToken":"%s"}
                    """.formatted(refreshToken))
                .when().post("/auth/logout")
                .then()
                .statusCode(204);
    }
}
