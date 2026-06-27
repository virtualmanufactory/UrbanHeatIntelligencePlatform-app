package com.virtualmanufactory.messaging;

import com.virtualmanufactory.dto.HeatMeasurementMessage;
import com.virtualmanufactory.entity.HeatMeasurement;
import com.virtualmanufactory.repository.HeatMeasurementRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;

/**
 * Consumes urban-heat measurements streamed from the Python GIS service and
 * persists them so they become available through {@code GET /api/heat}.
 */
@Component
@RequiredArgsConstructor
public class HeatMeasurementKafkaListener {

	private static final Logger log = LoggerFactory.getLogger(HeatMeasurementKafkaListener.class);

	private final HeatMeasurementRepository repository;
	private final ObjectMapper objectMapper;

	@KafkaListener(topics = "${app.kafka.heat-topic}", groupId = "${spring.kafka.consumer.group-id}")
	public void onMessage(String payload) {
		try {
			HeatMeasurementMessage message = objectMapper.readValue(payload, HeatMeasurementMessage.class);

			if (message.getLatitude() == null || message.getLongitude() == null || message.getTemperature() == null) {
				log.warn("Skipping invalid heat measurement (missing coordinates/temperature): {}", payload);
				return;
			}

			HeatMeasurement entity = HeatMeasurement.builder()
					.latitude(message.getLatitude())
					.longitude(message.getLongitude())
					.temperature(message.getTemperature())
					.measurementDate(message.getMeasurementDate() != null ? message.getMeasurementDate() : LocalDate.now())
					.build();

			repository.save(entity);
			log.info("Persisted heat measurement from Kafka: lat={}, lon={}, temp={}°C",
					entity.getLatitude(), entity.getLongitude(), entity.getTemperature());
		} catch (Exception ex) {
			log.error("Failed to process heat measurement message: {}", payload, ex);
		}
	}
}
