package com.virtualmanufactory.repository;

import com.virtualmanufactory.entity.HeatMeasurement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeatMeasurementRepository extends JpaRepository<HeatMeasurement, Long> {
}
