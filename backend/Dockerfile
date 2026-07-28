FROM gradle:8-jdk17-alpine AS build
WORKDIR /app
COPY . .
RUN gradle build -x test --no-daemon

FROM eclipse-temurin:17-jre
VOLUME /tmp
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java","-Djava.net.preferIPv4Stack=true","-jar","/app.jar"]