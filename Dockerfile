# Stage 1: Build
FROM ubuntu:latest AS build
RUN apt-get update && apt-get install openjdk-17-jdk -y

# Copy all files into the container
COPY . .

# Ensure the gradlew script has executable permissions
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew bootJar --no-daemon

# Stage 2: Run
FROM openjdk:17-jdk-slim
EXPOSE 8080

# Copy the built JAR file from the build stage to the runtime stage
COPY --from=build /path/to/your/jarfile/Taskify-1.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
