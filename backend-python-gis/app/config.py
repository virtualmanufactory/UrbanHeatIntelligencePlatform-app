"""Runtime configuration sourced from environment variables."""
import os

# Kafka
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_HEAT_TOPIC = os.getenv("KAFKA_HEAT_TOPIC", "heat-measurements")

# Google Earth Engine
# - GEE_PROJECT: the Google Cloud project registered for Earth Engine.
# - GEE_SERVICE_ACCOUNT + GEE_SERVICE_ACCOUNT_KEY_FILE: service-account auth.
#   GOOGLE_APPLICATION_CREDENTIALS is honoured as a fallback key-file path.
GEE_PROJECT = os.getenv("GEE_PROJECT")
GEE_SERVICE_ACCOUNT = os.getenv("GEE_SERVICE_ACCOUNT")
GEE_SERVICE_ACCOUNT_KEY_FILE = (
    os.getenv("GEE_SERVICE_ACCOUNT_KEY_FILE")
    or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
)

# MODIS land-surface-temperature product queried when Earth Engine is available.
GEE_LST_COLLECTION = os.getenv("GEE_LST_COLLECTION", "MODIS/061/MOD11A1")
GEE_LST_BAND = os.getenv("GEE_LST_BAND", "LST_Day_1km")

# Sample cities used when an ingest request does not specify its own points.
DEFAULT_CITIES = [
    {"name": "New York", "latitude": 40.7128, "longitude": -74.0060},
    {"name": "London", "latitude": 51.5074, "longitude": -0.1278},
    {"name": "Paris", "latitude": 48.8566, "longitude": 2.3522},
    {"name": "Tokyo", "latitude": 35.6895, "longitude": 139.6917},
    {"name": "Cairo", "latitude": 30.0444, "longitude": 31.2357},
    {"name": "Warsaw", "latitude": 52.2297, "longitude": 21.0122},
]
