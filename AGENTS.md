# Urban Heat Intelligence Platform

Two modules:

- `backend-java/` — Spring Boot REST API (Maven, Java 21, Spring Boot 4.0.x). Persists `HeatMeasurement` rows in PostgreSQL and exposes `GET /api/heat`.
- `frontend-angular/` — Angular 20 SPA that consumes the backend and renders the measurements. Dev server runs on port `3000` (the only origin allowed by the backend's CORS config in `CorsConfig.java`).

## Cursor Cloud specific instructions

The environment snapshot already has Java 21, Maven, PostgreSQL 16, and Node 22 installed; the startup update script pre-resolves Maven dependencies and runs `npm install` for the frontend. The notes below cover non-obvious startup/run caveats.

### Database (required before running the app or building anything that boots Spring)

The app connects over TCP to PostgreSQL using the credentials hardcoded in `backend-java/src/main/resources/application.properties` (`jdbc:postgresql://localhost:5432/urban_heat`, user `postgres`, password `root`). PostgreSQL is NOT auto-started, so start it and ensure the role password + database exist each session:

```bash
sudo pg_ctlcluster 16 main start
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'root';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='urban_heat'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE urban_heat;"
```

The schema is created automatically by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) on first boot — no migrations to run.

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

### Smoke test

```bash
curl -s http://localhost:8080/api/heat   # -> [] initially
# seed a row, then GET again returns it:
PGPASSWORD=root psql -h localhost -U postgres -d urban_heat \
  -c "INSERT INTO heat_measurement (latitude, longitude, temperature, measurement_date) VALUES (40.7128, -74.0060, 35.6, '2026-06-27');"
curl -s http://localhost:8080/api/heat   # -> [{"latitude":40.7128,"longitude":-74.006,"temperature":35.6}]
```
