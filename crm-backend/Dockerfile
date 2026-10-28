FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd -r -u 1001 crm
COPY target/crm-backend-1.0.0.jar app.jar
RUN mkdir -p /app/uploads && chown -R crm:crm /app
USER crm
EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
