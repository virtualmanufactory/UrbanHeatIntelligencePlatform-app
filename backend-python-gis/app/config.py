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

# Approximate geographic bounds of Poland.
POLAND_BOUNDS = {
    "minLatitude": 49.0,
    "maxLatitude": 54.9,
    "minLongitude": 14.1,
    "maxLongitude": 24.2,
}

# Example Polish localities offered as suggestions on the ingest form.
POLISH_LOCALITIES = [
    {"name": "Warszawa", "latitude": 52.2297, "longitude": 21.0122},
    {"name": "Kraków", "latitude": 50.0647, "longitude": 19.9450},
    {"name": "Gdańsk", "latitude": 54.3520, "longitude": 18.6466},
    {"name": "Wrocław", "latitude": 51.1079, "longitude": 17.0385},
    {"name": "Poznań", "latitude": 52.4064, "longitude": 16.9252},
    {"name": "Łódź", "latitude": 51.7592, "longitude": 19.4560},
    {"name": "Szczecin", "latitude": 53.4285, "longitude": 14.5528},
    {"name": "Lublin", "latitude": 51.2465, "longitude": 22.5684},
    {"name": "Białystok", "latitude": 53.1325, "longitude": 23.1688},
    {"name": "Katowice", "latitude": 50.2649, "longitude": 19.0238},
    {"name": "Rzeszów", "latitude": 50.0412, "longitude": 21.9991},
]

# Backwards-compatible alias used by older code paths.
DEFAULT_CITIES = POLISH_LOCALITIES
