package com.virtualmanufactory.messaging;

import com.virtualmanufactory.entity.HeatMeasurement;
import com.virtualmanufactory.repository.HeatMeasurementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class HeatMeasurementKafkaListenerIntegrationTest {

	@Autowired
	private HeatMeasurementKafkaListener listener;

	@Autowired
	private HeatMeasurementRepository repository;

	@BeforeEach
	void setUp() {
		repository.deleteAll();
	}

	@Test
	void onMessageShouldPersistPolishMeasurement() {
		listener.onMessage("""
				{
				  "name": "Warszawa",
				  "latitude": 52.2297,
				  "longitude": 21.0122,
				  "temperature": 24.5,
				  "measurementDate": "2026-07-01"
				}
				""");

		List<HeatMeasurement> measurements = repository.findAll();

		assertEquals(1, measurements.size());
		assertEquals("Warszawa", measurements.getFirst().getName());
		assertEquals(24.5, measurements.getFirst().getTemperature());
	}

	@Test
	void onMessageShouldSkipMeasurementOutsidePoland() {
		listener.onMessage("""
				{
				  "name": "Berlin",
				  "latitude": 52.5200,
				  "longitude": 13.4050,
				  "temperature": 30.0,
				  "measurementDate": "2026-07-01"
				}
				""");

		assertTrue(repository.findAll().isEmpty());
	}

	@Test
	void onMessageShouldUpsertExistingLocalityForSameDate() {
		LocalDate date = LocalDate.parse("2026-07-01");
		repository.save(HeatMeasurement.builder()
				.name("Kraków")
				.latitude(50.0647)
				.longitude(19.9450)
				.temperature(22.0)
				.measurementDate(date)
				.build());

		listener.onMessage("""
				{
				  "name": "Kraków",
				  "latitude": 50.0647,
				  "longitude": 19.9450,
				  "temperature": 27.5,
				  "measurementDate": "2026-07-01"
				}
				""");

		List<HeatMeasurement> measurements = repository.findAll();

		assertEquals(1, measurements.size());
		assertEquals(27.5, measurements.getFirst().getTemperature());
	}
}
