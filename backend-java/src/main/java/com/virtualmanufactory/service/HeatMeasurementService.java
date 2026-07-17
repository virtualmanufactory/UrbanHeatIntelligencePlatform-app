package com.virtualmanufactory.service;

import com.virtualmanufactory.dto.HeatMeasurementDto;
import com.virtualmanufactory.entity.HeatMeasurement;
import com.virtualmanufactory.exception.ResourceNotFoundException;
import com.virtualmanufactory.repository.HeatMeasurementRepository;
import com.virtualmanufactory.util.PolandBounds;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HeatMeasurementService {

	private final HeatMeasurementRepository repository;

	public List<HeatMeasurementDto> getAll(LocalDate date) {
		List<HeatMeasurement> entities = date == null
				? repository.findAll()
				: repository.findByMeasurementDate(date);

		return deduplicate(entities)
				.stream()
				.filter(entity -> PolandBounds.isInPoland(entity.getLatitude(), entity.getLongitude()))
				.map(this::toDto)
				.collect(Collectors.toList());
	}

	public void delete(Long id) {
		if (!repository.existsById(id)) {
			throw new ResourceNotFoundException("Nie znaleziono pomiaru o id " + id);
		}
		repository.deleteById(id);
	}

	private HeatMeasurementDto toDto(HeatMeasurement entity) {
		return HeatMeasurementDto.builder()
				.id(entity.getId())
				.name(entity.getName())
				.latitude(entity.getLatitude())
				.longitude(entity.getLongitude())
				.temperature(entity.getTemperature())
				.measurementDate(entity.getMeasurementDate())
				.build();
	}

	private List<HeatMeasurement> deduplicate(List<HeatMeasurement> entities) {
		Map<String, HeatMeasurement> unique = new LinkedHashMap<>();

		for (HeatMeasurement entity : entities) {
			String key = buildKey(entity);
			unique.merge(key, entity, (existing, candidate) ->
					existing.getId() > candidate.getId() ? existing : candidate);
		}

		return new ArrayList<>(unique.values());
	}

	private String buildKey(HeatMeasurement entity) {
		String date = entity.getMeasurementDate() != null
				? entity.getMeasurementDate().toString()
				: "none";

		if (entity.getName() != null && !entity.getName().isBlank()) {
			return date + "|" + entity.getName().trim().toLowerCase(Locale.ROOT);
		}

		return date + "|" + roundCoordinate(entity.getLatitude()) + "|" + roundCoordinate(entity.getLongitude());
	}

	private String roundCoordinate(Double value) {
		return value == null ? "0" : String.format(Locale.ROOT, "%.4f", value);
	}
}
