package com.virtualmanufactory.repository;

import com.virtualmanufactory.entity.HeatMeasurement;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class HeatMeasurementRepositoryIntegrationTest {

	@Autowired
	private HeatMeasurementRepository repository;

	@Test
	void shouldFindMeasurementsByDate() {
		LocalDate date = LocalDate.parse("2026-07-01");
		repository.save(HeatMeasurement.builder()
				.name("Warszawa")
				.latitude(52.2297)
				.longitude(21.0122)
				.temperature(24.5)
				.measurementDate(date)
				.build());
		repository.save(HeatMeasurement.builder()
				.name("Kraków")
				.latitude(50.0647)
				.longitude(19.9450)
				.temperature(26.1)
				.measurementDate(LocalDate.parse("2026-06-27"))
				.build());

		List<HeatMeasurement> result = repository.findByMeasurementDate(date);

		assertEquals(1, result.size());
		assertEquals("Warszawa", result.getFirst().getName());
	}

	@Test
	void shouldFindMeasurementByNameIgnoreCaseAndDate() {
		LocalDate date = LocalDate.parse("2026-07-01");
		repository.save(HeatMeasurement.builder()
				.name("Poznań")
				.latitude(52.4064)
				.longitude(16.9252)
				.temperature(23.0)
				.measurementDate(date)
				.build());

		Optional<HeatMeasurement> result = repository.findByNameIgnoreCaseAndMeasurementDate("poznań", date);

		assertTrue(result.isPresent());
		assertEquals("Poznań", result.get().getName());
	}

	@Test
	void shouldFindMeasurementByCoordinatesAndDate() {
		LocalDate date = LocalDate.parse("2026-07-01");
		repository.save(HeatMeasurement.builder()
				.name("Wrocław")
				.latitude(51.1079)
				.longitude(17.0385)
				.temperature(21.5)
				.measurementDate(date)
				.build());

		Optional<HeatMeasurement> result = repository.findByLatitudeAndLongitudeAndMeasurementDate(
				51.1079,
				17.0385,
				date
		);

		assertTrue(result.isPresent());
		assertEquals("Wrocław", result.get().getName());
	}
}
