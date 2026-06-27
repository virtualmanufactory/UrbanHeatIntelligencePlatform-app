"""Thin wrapper around a Kafka producer that streams heat measurements."""
import json
import logging
from typing import Optional

from kafka import KafkaProducer

from . import config

logger = logging.getLogger(__name__)


class HeatProducer:
    def __init__(self) -> None:
        self._producer: Optional[KafkaProducer] = None

    def _get(self) -> KafkaProducer:
        if self._producer is None:
            logger.info(
                "Connecting Kafka producer to %s", config.KAFKA_BOOTSTRAP_SERVERS
            )
            self._producer = KafkaProducer(
                bootstrap_servers=config.KAFKA_BOOTSTRAP_SERVERS.split(","),
                value_serializer=lambda value: json.dumps(value).encode("utf-8"),
                acks="all",
                retries=3,
                request_timeout_ms=10000,
            )
        return self._producer

    def publish(self, message: dict) -> None:
        producer = self._get()
        future = producer.send(config.KAFKA_HEAT_TOPIC, message)
        # Block so callers learn about delivery failures synchronously.
        future.get(timeout=10)

    def flush(self) -> None:
        if self._producer is not None:
            self._producer.flush()

    def close(self) -> None:
        if self._producer is not None:
            self._producer.close()
            self._producer = None
