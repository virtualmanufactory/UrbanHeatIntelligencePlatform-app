package com.virtualmanufactory.util;

public final class PolandBounds {

	public static final double MIN_LATITUDE = 49.0;
	public static final double MAX_LATITUDE = 54.9;
	public static final double MIN_LONGITUDE = 14.1;
	public static final double MAX_LONGITUDE = 24.2;

	private PolandBounds() {
	}

	public static boolean isInPoland(Double latitude, Double longitude) {
		if (latitude == null || longitude == null) {
			return false;
		}

		return latitude >= MIN_LATITUDE
				&& latitude <= MAX_LATITUDE
				&& longitude >= MIN_LONGITUDE
				&& longitude <= MAX_LONGITUDE;
	}
}
