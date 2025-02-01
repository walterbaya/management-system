# Usa una imagen base de Java
FROM openjdk:17-jdk-alpine

# Copia el archivo JAR generado
COPY target/management-0.0.1-SNAPSHOT.jar  app.jar

# Expone el puerto en el que corre tu aplicación Spring Boot
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]