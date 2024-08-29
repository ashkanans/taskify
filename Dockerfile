# Stage 1: Build
FROM ubuntu:latest AS build
RUN apt-get update && apt-get install openjdk-17-jdk -y
COPY . .
RUN ./gradlew bootJar --no-daemon

# Stage 2: Run
FROM openjdk:17-jdk-slim
EXPOSE 8080
COPY --from=build /path/to/your/jarfile/Taskify-1.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
