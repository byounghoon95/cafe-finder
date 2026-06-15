package com.caferadar.cafe;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CafeController.class)
class CafeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CafeSearchService cafeSearchService;

    @Test
    void nearbyBuildsSearchRequest() throws Exception {
        when(cafeSearchService.search(any())).thenReturn(new NearbyCafeResponse(
                new NearbyCafeQueryResponse(37.5, 127.0, 500, "distance"),
                List.of()
        ));

        mockMvc.perform(get("/api/cafes/nearby")
                        .param("lat", "37.5")
                        .param("lng", "127.0")
                        .param("radius", "500")
                        .param("openNow", "true")
                        .param("hasWifi", "true")
                        .param("hasPower", "true")
                        .param("priceLevel", "1,2")
                        .param("tags", "work-friendly,dessert")
                        .param("sort", "distance")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.query.radiusMeters").value(500))
                .andExpect(jsonPath("$.query.sort").value("distance"));

        ArgumentCaptor<NearbyCafeSearchRequest> captor = ArgumentCaptor.forClass(NearbyCafeSearchRequest.class);
        verify(cafeSearchService).search(captor.capture());

        NearbyCafeSearchRequest request = captor.getValue();
        org.assertj.core.api.Assertions.assertThat(request.priceLevels()).containsExactly(1, 2);
        org.assertj.core.api.Assertions.assertThat(request.tags()).containsExactly("work-friendly", "dessert");
        org.assertj.core.api.Assertions.assertThat(request.sort()).isEqualTo(CafeSearchSort.DISTANCE);
    }

    @Test
    void nearbyRejectsUnsupportedRadius() throws Exception {
        mockMvc.perform(get("/api/cafes/nearby")
                        .param("lat", "37.5")
                        .param("lng", "127.0")
                        .param("radius", "750"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void nearbyRejectsInvalidLatitude() throws Exception {
        mockMvc.perform(get("/api/cafes/nearby")
                        .param("lat", "91")
                        .param("lng", "127.0")
                        .param("radius", "500"))
                .andExpect(status().isBadRequest());
    }
}
