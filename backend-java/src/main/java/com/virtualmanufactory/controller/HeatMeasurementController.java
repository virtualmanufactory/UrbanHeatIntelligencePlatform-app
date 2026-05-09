package com.virtualmanufactory.controller;

import com.virtualmanufactory.dto.HeatMeasurementDto;
import com.virtualmanufactory.service.HeatMeasurementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/heat")
@RequiredArgsConstructor
public class HeatMeasurementController {

	private final HeatMeasurementService service;

	@GetMapping
	public List<HeatMeasurementDto> getAll() {
		return service.getAll();
	}
}
