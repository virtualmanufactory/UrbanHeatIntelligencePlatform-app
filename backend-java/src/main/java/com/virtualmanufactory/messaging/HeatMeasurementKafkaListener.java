package com.virtualmanufactory.messaging;

import com.virtualmanufactory.dto.HeatMeasurementMessage;
import com.virtualmanufactory.entity.HeatMeasurement;
import com.virtualmanufactory.repository.HeatMeasurementRepository;
import com.virtualmanufactory.util.PolandBounds;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.Optional;

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

			if (!PolandBounds.isInPoland(message.getLatitude(), message.getLongitude())) {
				log.warn("Skipping heat measurement outside Poland: lat={}, lon={}, payload={}",
						message.getLatitude(), message.getLongitude(), payload);
				return;
			}

			LocalDate measurementDate = message.getMeasurementDate() != null
					? message.getMeasurementDate()
					: LocalDate.now();
			String localityName = normalizeName(message.getName());

			Optional<HeatMeasurement> existing = findExisting(localityName, message, measurementDate);
			HeatMeasurement entity = existing.orElseGet(HeatMeasurement::new);
			entity.setName(localityName);
			entity.setLatitude(message.getLatitude());
			entity.setLongitude(message.getLongitude());
			entity.setTemperature(message.getTemperature());
			entity.setMeasurementDate(measurementDate);

			repository.save(entity);
			log.info("Persisted heat measurement from Kafka: name={}, lat={}, lon={}, temp={}°C, date={}",
					entity.getName(),
					entity.getLatitude(),
					entity.getLongitude(),
					entity.getTemperature(),
					entity.getMeasurementDate());
		} catch (Exception ex) {
			log.error("Failed to process heat measurement message: {}", payload, ex);
		}
	}

	private Optional<HeatMeasurement> findExisting(
			String localityName,
			HeatMeasurementMessage message,
			LocalDate measurementDate
	) {
		if (localityName != null) {
			Optional<HeatMeasurement> byName = repository.findByNameIgnoreCaseAndMeasurementDate(
					localityName,
					measurementDate
			);
			if (byName.isPresent()) {
				return byName;
			}
		}

		return repository.findByLatitudeAndLongitudeAndMeasurementDate(
				message.getLatitude(),
				message.getLongitude(),
				measurementDate
		);
	}

	private String normalizeName(String name) {
		if (name == null || name.isBlank()) {
			return null;
		}
		return name.trim();
	}
}
