# Stage 1: Build the JAR using Gradle
FROM gradle:8-jdk17-alpine AS build
WORKDIR /app
COPY . .
RUN gradle build -x test --no-daemon

# Stage 2: Run the built JAR
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
