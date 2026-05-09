package com.virtualmanufactory.dto;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString(callSuper = true)
public class HeatMeasurementDto {

	private Double latitude;

	private Double longitude;

	private Double temperature;
}
