package com.virtualmanufactory.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;

@Data
@Builder
@ToString(callSuper = true)
public class HeatMeasurementDto {

	private Long id;

	private String name;

	private Double latitude;

	private Double longitude;

	private Double temperature;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate measurementDate;
}
