# Urban Heat Intelligence Platform — Java Backend

A Spring Boot REST API exposing urban heat measurements. The single module lives in `backend-java/` (Maven, Java 21, Spring Boot 4.0.x). It persists `HeatMeasurement` rows in PostgreSQL and exposes `GET /api/heat`.

## Cursor Cloud specific instructions

The environment snapshot already has Java 21, Maven, and PostgreSQL 16 installed; the startup update script pre-resolves Maven dependencies. The notes below cover non-obvious startup/run caveats.

### Database (required before running the app or building anything that boots Spring)

The app connects over TCP to PostgreSQL using the credentials hardcoded in `backend-java/src/main/resources/application.properties` (`jdbc:postgresql://localhost:5432/urban_heat`, user `postgres`, password `root`). PostgreSQL is NOT auto-started, so start it and ensure the role password + database exist each session:

```bash
sudo pg_ctlcluster 16 main start
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'root';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='urban_heat'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE urban_heat;"
```

The schema is created automatically by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) on first boot — no migrations to run.

### Running

All commands run from `backend-java/`:

- Run (dev, with devtools hot reload): `mvn spring-boot:run` — serves on port `8080`.
- Build + package: `mvn -B clean package` (output jar in `target/`).
- Tests: there are currently no test sources under `src/test`, so `mvn test` is a no-op.
- Lint: no linter is configured in this repo.

Note: `target/` is checked into git, so a build will show modified/untracked files under `backend-java/target/` — do not commit those.

### Smoke test

```bash
curl -s http://localhost:8080/api/heat   # -> [] initially
# seed a row, then GET again returns it:
PGPASSWORD=root psql -h localhost -U postgres -d urban_heat \
  -c "INSERT INTO heat_measurement (latitude, longitude, temperature, measurement_date) VALUES (40.7128, -74.0060, 35.6, '2026-06-27');"
curl -s http://localhost:8080/api/heat   # -> [{"latitude":40.7128,"longitude":-74.006,"temperature":35.6}]
```
