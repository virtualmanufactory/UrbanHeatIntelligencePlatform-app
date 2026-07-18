# Urban Heat Intelligence Platform

Modules:

- `backend-java/` — Spring Boot REST API (Maven, Java 21, Spring Boot 4.0.x). Persists `HeatMeasurement` rows in PostgreSQL, exposes `GET /api/heat`, and **consumes** the `heat-measurements` Kafka topic to ingest measurements.
- `backend-python-gis/` — FastAPI service (Python 3.12). Pulls land-surface temperature from **Google Earth Engine** and **produces** to the `heat-measurements` Kafka topic. Runs on port `8000`.
- `frontend-angular/` — Angular 20 SPA that consumes the Java API and renders the measurements. Dev server runs on port `3000` (the only origin allowed by the backend's CORS config in `CorsConfig.java`).

Data flow:

```
Google Earth Engine ─▶ backend-python-gis ─(Kafka: heat-measurements)─▶ backend-java ─▶ PostgreSQL ─▶ frontend-angular
```

## Cursor Cloud specific instructions

The environment snapshot already has Java 21, Maven, PostgreSQL 16, Node 22, Python 3.12 (+venv), and Kafka 3.9 (KRaft, at `/opt/kafka`) installed. The startup update script pre-resolves Maven deps, runs `npm install` for the frontend, and installs the Python venv. The notes below cover non-obvious startup/run caveats.

### Jackson note (backend-java)

Spring Boot 4 ships **Jackson 3**, whose `ObjectMapper` lives in package `tools.jackson.databind` (not `com.fasterxml.jackson.databind`). Jackson *annotations* (`@JsonFormat`, `@JsonIgnoreProperties`, …) are still under `com.fasterxml.jackson.annotation`. Kafka auto-configuration requires the granular `spring-boot-starter-kafka` (the bare `spring-kafka` artifact has no Spring Boot auto-config, so `@KafkaListener` silently does nothing).

### Database (required before running the app or building anything that boots Spring)

The app connects over TCP to PostgreSQL using the credentials hardcoded in `backend-java/src/main/resources/application.properties` (`jdbc:postgresql://localhost:5432/urban_heat_db`, user `postgres`, password `root`). PostgreSQL is NOT auto-started, so start it and ensure the role password + database exist each session:

```bash
sudo pg_ctlcluster 16 main start
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'root';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='urban_heat_db'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE urban_heat_db;"
```

The schema is created automatically by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) on first boot — no migrations to run.

### Kafka (required for the GIS → Java ingestion pipeline)

Kafka 3.9 runs in single-node KRaft mode from `/opt/kafka` (storage already formatted under `/opt/kafka/data`). It is NOT auto-started:

```bash
/opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/kraft/server.properties   # serves PLAINTEXT on localhost:9092
# topic is auto-created on first use; to create explicitly:
/opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic heat-measurements --partitions 1 --replication-factor 1
```

`backend-java` subscribes to `heat-measurements` on startup; if Kafka is down it logs connection retries but still starts and serves `/api/heat`.

### Running the backend

All commands run from `backend-java/`:

- Run (dev, with devtools hot reload): `mvn spring-boot:run` — serves on port `8080`.
- Build + package: `mvn -B clean package` (output jar in `target/`).
- Tests: there are currently no test sources under `src/test`, so `mvn test` is a no-op.
- Lint: no linter is configured in this repo.

Gotcha: `target/` is checked into git. Do NOT run `git clean`/`git checkout` on `backend-java/target/` while `mvn spring-boot:run` is active — devtools watches `target/classes` and will hot-restart into a broken state (component scan finds 0 controllers/repositories, so `/api/heat` returns 404). If that happens, stop and restart `mvn spring-boot:run`. Also do not commit modified/untracked files under `backend-java/target/`.

### Running the frontend

All commands run from `frontend-angular/` (Angular CLI 20; requires Node 22.12+, which the snapshot's `/exec-daemon/node` satisfies):

- Run (dev): `npm start` — serves on port `3000` (configured in `angular.json`). The backend must be running on `8080` first, otherwise the page loads but shows a connection error.
- Build: `npm run build`.
- Unit tests (headless): `npm test -- --watch=false --browsers=ChromeHeadless` (Chrome is preinstalled at `/usr/bin/google-chrome`).

The backend base URL is hardcoded in `frontend-angular/src/app/heat.service.ts` (`http://localhost:8080/api/heat`).

### Running the Python GIS service

From `backend-python-gis/` (the update script creates `.venv` and installs requirements):

> The Kafka producer (`app/kafka_producer.py`) imports `confluent_kafka` (the librdkafka-backed client), which is pinned in `requirements.txt`. `kafka-python` is also listed but unused. If you reinstall deps while `uvicorn --reload` is running, the reloader can stay crashed on a stale `ModuleNotFoundError`; stop and restart the uvicorn process.

- Run (dev): `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`, `.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` — serves on port `8000` (Swagger UI at `/docs`).
- Trigger ingestion: `curl -X POST http://localhost:8000/ingest` (optional JSON body `{ "date": "YYYY-MM-DD", "points": [...] }`).

Google Earth Engine auth is optional. Without `GEE_PROJECT` + service-account credentials (`GEE_SERVICE_ACCOUNT` / `GEE_SERVICE_ACCOUNT_KEY_FILE`), the service runs in deterministic **mock** mode (still produces to Kafka). `GET /health` reports the active mode (`earth-engine` vs `mock`).

### End-to-end smoke test (full pipeline)

With PostgreSQL, Kafka, `backend-java`, and `backend-python-gis` all running:

```bash
curl -s -X POST http://localhost:8000/ingest -H 'Content-Type: application/json' -d '{"date":"2026-06-27"}'
sleep 3
curl -s http://localhost:8080/api/heat   # now includes the ingested measurements
```
