package com.virtualmanufactory.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.LocalDate;

/**
 * Payload published to the {@code heat-measurements} Kafka topic by
 * backend-python-gis (Google Earth Engine ingestion service).
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class HeatMeasurementMessage {

	private Double latitude;

	private Double longitude;

	private Double temperature;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate measurementDate;
}
