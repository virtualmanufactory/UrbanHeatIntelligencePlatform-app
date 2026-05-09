package com.virtualmanufactory.service;

import com.virtualmanufactory.dto.HeatMeasurementDto;
import com.virtualmanufactory.repository.HeatMeasurementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HeatMeasurementService {

	private final HeatMeasurementRepository repository;

	public List<HeatMeasurementDto> getAll() {
		return repository.findAll()
				.stream()
				.map(entity -> HeatMeasurementDto.builder()
						.latitude(entity.getLatitude())
						.longitude(entity.getLongitude())
						.temperature(entity.getTemperature())
						.build())
				.collect(Collectors.toList());
	}
}
