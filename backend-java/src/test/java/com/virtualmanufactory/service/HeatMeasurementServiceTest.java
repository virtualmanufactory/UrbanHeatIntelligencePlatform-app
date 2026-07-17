package com.virtualmanufactory.service;

import com.virtualmanufactory.dto.HeatMeasurementDto;
import com.virtualmanufactory.entity.HeatMeasurement;
import com.virtualmanufactory.exception.ResourceNotFoundException;
import com.virtualmanufactory.repository.HeatMeasurementRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HeatMeasurementServiceTest {

	@Mock
	private HeatMeasurementRepository repository;

	@InjectMocks
	private HeatMeasurementService service;

	@Test
	void getAllShouldFilterOutMeasurementsOutsidePoland() {
		when(repository.findAll()).thenReturn(List.of(
				HeatMeasurement.builder()
						.id(1L)
						.name("Warszawa")
						.latitude(52.2297)
						.longitude(21.0122)
						.temperature(24.5)
						.measurementDate(LocalDate.parse("2026-07-01"))
						.build(),
				HeatMeasurement.builder()
						.id(2L)
						.name("Berlin")
						.latitude(52.5200)
						.longitude(13.4050)
						.temperature(26.0)
						.measurementDate(LocalDate.parse("2026-07-01"))
						.build()
		));

		List<HeatMeasurementDto> result = service.getAll(null);

		assertEquals(1, result.size());
		assertEquals("Warszawa", result.getFirst().getName());
	}

	@Test
	void getAllShouldDeduplicateMeasurementsByNameAndDate() {
		when(repository.findAll()).thenReturn(List.of(
				HeatMeasurement.builder()
						.id(1L)
						.name("Kraków")
						.latitude(50.0647)
						.longitude(19.9450)
						.temperature(22.0)
						.measurementDate(LocalDate.parse("2026-07-01"))
						.build(),
				HeatMeasurement.builder()
						.id(2L)
						.name("Kraków")
						.latitude(50.0647)
						.longitude(19.9450)
						.temperature(25.0)
						.measurementDate(LocalDate.parse("2026-07-01"))
						.build()
		));

		List<HeatMeasurementDto> result = service.getAll(null);

		assertEquals(1, result.size());
		assertEquals(25.0, result.getFirst().getTemperature());
	}

	@Test
	void getAllShouldUseRepositoryDateFilter() {
		LocalDate date = LocalDate.parse("2026-06-27");
		when(repository.findByMeasurementDate(date)).thenReturn(List.of(
				HeatMeasurement.builder()
						.id(3L)
						.name("Gdańsk")
						.latitude(54.3520)
						.longitude(18.6466)
						.temperature(20.0)
						.measurementDate(date)
						.build()
		));

		List<HeatMeasurementDto> result = service.getAll(date);

		assertEquals(1, result.size());
		assertEquals("Gdańsk", result.getFirst().getName());
		verify(repository).findByMeasurementDate(date);
	}

	@Test
	void deleteShouldRemoveExistingMeasurement() {
		when(repository.existsById(10L)).thenReturn(true);

		service.delete(10L);

		verify(repository).deleteById(10L);
	}

	@Test
	void deleteShouldThrowWhenMeasurementDoesNotExist() {
		when(repository.existsById(99L)).thenReturn(false);

		assertThrows(ResourceNotFoundException.class, () -> service.delete(99L));
	}
}
