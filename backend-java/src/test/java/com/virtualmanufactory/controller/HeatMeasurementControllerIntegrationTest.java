package com.virtualmanufactory.controller;

import com.virtualmanufactory.entity.HeatMeasurement;
import com.virtualmanufactory.repository.HeatMeasurementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class HeatMeasurementControllerIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private HeatMeasurementRepository repository;

	@BeforeEach
	void setUp() {
		repository.deleteAll();
	}

	@Test
	void getAllShouldReturnOnlyPolishMeasurementsForRequestedDate() throws Exception {
		LocalDate date = LocalDate.parse("2026-07-01");
		repository.save(HeatMeasurement.builder()
				.name("Warszawa")
				.latitude(52.2297)
				.longitude(21.0122)
				.temperature(24.5)
				.measurementDate(date)
				.build());
		repository.save(HeatMeasurement.builder()
				.name("Berlin")
				.latitude(52.5200)
				.longitude(13.4050)
				.temperature(30.0)
				.measurementDate(date)
				.build());
		repository.save(HeatMeasurement.builder()
				.name("Kraków")
				.latitude(50.0647)
				.longitude(19.9450)
				.temperature(26.1)
				.measurementDate(LocalDate.parse("2026-06-27"))
				.build());

		mockMvc.perform(get("/api/heat").param("date", "2026-07-01"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name").value("Warszawa"))
				.andExpect(jsonPath("$[0].temperature").value(24.5));
	}

	@Test
	void deleteShouldRemoveMeasurement() throws Exception {
		HeatMeasurement saved = repository.save(HeatMeasurement.builder()
				.name("Gdańsk")
				.latitude(54.3520)
				.longitude(18.6466)
				.temperature(20.0)
				.measurementDate(LocalDate.parse("2026-07-01"))
				.build());

		mockMvc.perform(delete("/api/heat/{id}", saved.getId()))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/heat"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	void deleteShouldReturnNotFoundForMissingMeasurement() throws Exception {
		mockMvc.perform(delete("/api/heat/{id}", 9999L))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Nie znaleziono pomiaru o id 9999"));
	}
}
