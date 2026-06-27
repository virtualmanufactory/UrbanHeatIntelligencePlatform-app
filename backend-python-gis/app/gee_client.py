"""Google Earth Engine client for land-surface-temperature (LST) retrieval.

When Earth Engine credentials are available the client queries a MODIS LST
product. Otherwise it transparently falls back to a deterministic mock so the
ingestion pipeline remains fully runnable without Google credentials.
"""
import datetime
import logging
import math

from . import config

logger = logging.getLogger(__name__)


class GeeClient:
    def __init__(self) -> None:
        self.mode = "mock"
        self._ee = None
        self._init_earth_engine()

    def _init_earth_engine(self) -> None:
        try:
            import ee  # noqa: WPS433 (import inside method is intentional)
        except Exception as exc:  # pragma: no cover - import guard
            logger.warning("earthengine-api not importable (%s); using mock LST data", exc)
            return

        try:
            if config.GEE_SERVICE_ACCOUNT and config.GEE_SERVICE_ACCOUNT_KEY_FILE:
                credentials = ee.ServiceAccountCredentials(
                    config.GEE_SERVICE_ACCOUNT,
                    config.GEE_SERVICE_ACCOUNT_KEY_FILE,
                )
                ee.Initialize(credentials, project=config.GEE_PROJECT)
            else:
                # Relies on previously stored `earthengine authenticate` creds
                # or application-default credentials.
                ee.Initialize(project=config.GEE_PROJECT)

            self._ee = ee
            self.mode = "earth-engine"
            logger.info("Earth Engine initialized (project=%s)", config.GEE_PROJECT)
        except Exception as exc:
            logger.warning(
                "Earth Engine initialization failed (%s); using mock LST data", exc
            )
            self._ee = None
            self.mode = "mock"

    def get_land_surface_temperature(self, lat: float, lon: float, date_str: str) -> float:
        if self._ee is not None:
            try:
                return self._earth_engine_lst(lat, lon, date_str)
            except Exception as exc:
                logger.warning(
                    "Earth Engine query failed for (%s, %s) (%s); using mock value",
                    lat,
                    lon,
                    exc,
                )
        return self._mock_lst(lat, lon, date_str)

    def _earth_engine_lst(self, lat: float, lon: float, date_str: str) -> float:
        ee = self._ee
        date = ee.Date(date_str)
        start = date.advance(-8, "day")
        end = date.advance(8, "day")
        point = ee.Geometry.Point([lon, lat])

        collection = (
            ee.ImageCollection(config.GEE_LST_COLLECTION)
            .filterDate(start, end)
            .select(config.GEE_LST_BAND)
        )
        image = collection.mean()
        scaled_kelvin = image.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point,
            scale=1000,
        ).get(config.GEE_LST_BAND)

        # MODIS LST is stored as Kelvin * 50 (scale factor 0.02).
        celsius = ee.Number(scaled_kelvin).multiply(0.02).subtract(273.15)
        return round(float(celsius.getInfo()), 2)

    @staticmethod
    def _mock_lst(lat: float, lon: float, date_str: str) -> float:
        """Deterministic, pseudo-realistic surface temperature in °C."""
        day = datetime.date.fromisoformat(date_str)
        # Warmer toward the equator.
        latitude_component = (30.0 - abs(lat)) * 0.2
        # Seasonal swing (hemisphere-aware).
        seasonal = 6.0 * math.cos((day.timetuple().tm_yday / 365.0) * 2 * math.pi)
        seasonal *= 1 if lat >= 0 else -1
        # Stable spatial jitter so repeated calls return identical values.
        jitter = abs(math.sin(lat * 12.9898 + lon * 78.233)) * 8.0
        temperature = 30.0 + latitude_component + seasonal + jitter
        return round(max(10.0, min(50.0, temperature)), 2)
