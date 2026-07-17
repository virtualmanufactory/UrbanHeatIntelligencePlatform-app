package com.virtualmanufactory.repository;

import com.virtualmanufactory.entity.HeatMeasurement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HeatMeasurementRepository extends JpaRepository<HeatMeasurement, Long> {

	List<HeatMeasurement> findByMeasurementDate(LocalDate measurementDate);

	Optional<HeatMeasurement> findByNameIgnoreCaseAndMeasurementDate(String name, LocalDate measurementDate);

	Optional<HeatMeasurement> findByLatitudeAndLongitudeAndMeasurementDate(
			Double latitude,
			Double longitude,
			LocalDate measurementDate
	);
}
