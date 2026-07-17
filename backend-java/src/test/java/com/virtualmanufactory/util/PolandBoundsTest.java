package com.virtualmanufactory.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PolandBoundsTest {

	@Test
	void shouldAcceptCoordinatesInsidePoland() {
		assertTrue(PolandBounds.isInPoland(52.2297, 21.0122));
		assertTrue(PolandBounds.isInPoland(PolandBounds.MIN_LATITUDE, PolandBounds.MIN_LONGITUDE));
		assertTrue(PolandBounds.isInPoland(PolandBounds.MAX_LATITUDE, PolandBounds.MAX_LONGITUDE));
	}

	@Test
	void shouldRejectCoordinatesOutsidePoland() {
		assertFalse(PolandBounds.isInPoland(40.7128, -74.0060));
		assertFalse(PolandBounds.isInPoland(48.9, 21.0));
		assertFalse(PolandBounds.isInPoland(52.0, 13.9));
	}

	@Test
	void shouldRejectNullCoordinates() {
		assertFalse(PolandBounds.isInPoland(null, 21.0));
		assertFalse(PolandBounds.isInPoland(52.0, null));
	}
}
