# backend-python-gis

GIS ingestion service for the Urban Heat Intelligence Platform.

It fetches land-surface temperature (LST) for a set of geographic points from
**Google Earth Engine** and publishes each measurement to a **Kafka** topic
(`heat-measurements`). The Java backend (`backend-java`) consumes that topic and
persists the measurements, which then surface through `GET /api/heat` and the
Angular frontend.

```
Google Earth Engine ──▶ backend-python-gis ──(Kafka: heat-measurements)──▶ backend-java ──▶ PostgreSQL ──▶ Angular
```

## Run

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Endpoints

- `GET /health` — service status, the active Earth Engine mode, and Kafka target.
- `GET /cities` — the default sample points used by `/ingest`.
- `POST /ingest` — fetch LST for the given points (or the default cities) and
  publish them to Kafka. Body is optional:

  ```json
  {
    "date": "2026-06-27",
    "points": [{ "name": "Madrid", "latitude": 40.4168, "longitude": -3.7038 }]
  }
  ```

## Google Earth Engine auth

Set `GEE_PROJECT` plus either a service account (`GEE_SERVICE_ACCOUNT` +
`GEE_SERVICE_ACCOUNT_KEY_FILE`) or application-default credentials. Without
valid credentials the service automatically falls back to deterministic mock
LST values, so the Kafka pipeline remains fully testable. The active mode is
reported by `GET /health` (`earth-engine` vs `mock`).
