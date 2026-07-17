"""FastAPI service that pulls urban-heat data from Google Earth Engine and
streams it to Kafka, where backend-java consumes and persists it."""
import logging
from datetime import date

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from . import config
from .gee_client import GeeClient
from .kafka_producer import HeatProducer
from .models import IngestRequest, IngestResponse, Measurement, Point

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Urban Heat GIS Ingestion Service",
    description="Fetches land-surface temperature from Google Earth Engine and "
    "publishes it to Kafka for the Java backend to persist.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gee_client = GeeClient()
producer = HeatProducer()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "geeMode": gee_client.mode,
        "kafkaBootstrapServers": config.KAFKA_BOOTSTRAP_SERVERS,
        "topic": config.KAFKA_HEAT_TOPIC,
    }


@app.get("/cities")
def cities():
    return config.POLISH_LOCALITIES


@app.get("/voivodeship-capitals")
def voivodeship_capitals():
    return config.VOIVODESHIP_CAPITALS


@app.post("/ingest", response_model=IngestResponse)
def ingest(request: IngestRequest):
    points = request.points
    measurement_date = request.date or date.today().isoformat()

    measurements = []
    for point in points:
        temperature = gee_client.get_land_surface_temperature(
            point.latitude, point.longitude, measurement_date
        )
        message = {
            "name": point.name,
            "latitude": point.latitude,
            "longitude": point.longitude,
            "temperature": temperature,
            "measurementDate": measurement_date,
        }
        try:
            producer.publish(message)
        except Exception as exc:
            logger.exception("Failed to publish measurement to Kafka")
            raise HTTPException(status_code=502, detail=f"Kafka publish failed: {exc}")

        measurements.append(
            Measurement(
                name=point.name,
                latitude=point.latitude,
                longitude=point.longitude,
                temperature=temperature,
                measurementDate=measurement_date,
            )
        )

    producer.flush()
    logger.info(
        "Published %s measurement(s) to topic '%s' (mode=%s)",
        len(measurements),
        config.KAFKA_HEAT_TOPIC,
        gee_client.mode,
    )
    return IngestResponse(
        mode=gee_client.mode,
        topic=config.KAFKA_HEAT_TOPIC,
        published=len(measurements),
        measurements=measurements,
    )
