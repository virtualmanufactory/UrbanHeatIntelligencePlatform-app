from confluent_kafka import Producer
import json

class HeatProducer:

    def __init__(self):
        self.producer = Producer({
            "bootstrap.servers": "127.0.0.1:9092"
        })

    def publish(self, message):
        self.producer.produce(
            "heat-measurements",
            json.dumps(message).encode("utf-8")
        )

    def flush(self):
        self.producer.flush()