package com.caferadar.cafe;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.time.LocalTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CafeRepositoryTest {

    private static final DockerImageName POSTGIS_IMAGE = DockerImageName
            .parse("postgis/postgis:16-3.4")
            .asCompatibleSubstituteFor("postgres");

    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(POSTGIS_IMAGE)
            .withDatabaseName("cafe_radar_test")
            .withUsername("cafe_user")
            .withPassword("cafe_password");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.flyway.enabled", () -> "true");
    }

    @Autowired
    private CafeRepository cafeRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void storesCafeWithGeneratedPostgisPoint() {
        Cafe cafe = new Cafe(
                "Seongsu Coffee Lab",
                "Seongsu",
                "12 Seongsui-ro, Seongdong-gu, Seoul",
                new BigDecimal("37.544900"),
                new BigDecimal("127.056300"),
                new BigDecimal("4.6"),
                328,
                2,
                LocalTime.of(8, 0),
                LocalTime.of(22, 0),
                true,
                true,
                48,
                new String[] {"work-friendly", "dessert"}
        );

        Cafe saved = cafeRepository.saveAndFlush(cafe);

        String pointText = jdbcTemplate.queryForObject(
                "SELECT ST_AsText(geom::geometry) FROM cafes WHERE id = ?",
                (ResultSet rs, int rowNum) -> rs.getString(1),
                saved.getId()
        );
        Integer srid = jdbcTemplate.queryForObject(
                "SELECT ST_SRID(geom::geometry) FROM cafes WHERE id = ?",
                Integer.class,
                saved.getId()
        );

        assertThat(saved.getId()).isNotNull();
        assertThat(pointText).isEqualTo("POINT(127.0563 37.5449)");
        assertThat(srid).isEqualTo(4326);
    }
}
