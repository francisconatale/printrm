# Stage 1: Build
FROM gradle:8.5-jdk17 AS build
WORKDIR /app

# Cache dependencies
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon || true

# Copy source and build jar
COPY src ./src
RUN gradle bootJar --no-daemon -x test

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Install wget for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*

# Create persistent storage folder
RUN mkdir -p /app/data/saved-uploads

# Copy initial seed database and uploads if present
COPY studio.db* /app/data/
COPY saved-uploads/ /app/data/saved-uploads/

# Copy built jar from builder
COPY --from=build /app/build/libs/printly-studio-backend-*.jar /app/app.jar

# Configuration environment variables
ENV SPRING_DATASOURCE_URL=jdbc:sqlite:/app/data/studio.db \
    STUDIO_BASE_PATH=/app/data \
    SERVER_PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
