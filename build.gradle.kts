import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    id("java")
    id("org.springframework.boot") version "3.3.0"
    id("io.spring.dependency-management") version "1.1.0"
}

group = "com.ashkanans.taskify"
version = "1"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-security")
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    runtimeOnly("org.postgresql:postgresql:42.7.2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<Jar> {
    archiveBaseName.set("taskify")
    archiveVersion.set("1.0.0")
    manifest {
        attributes["Main-Class"] = "com.ashkanans.taskify.TodoListAppApplication"
    }
}

tasks.withType<BootJar> {
    mainClass.set("com.ashkanans.taskify.TodoListAppApplication")
}