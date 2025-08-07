  #include <WiFi.h>
  #include <PubSubClient.h>
  #include <SPI.h>
  #include <MFRC522.h>
  #include "DHT.h"

  // --- Pin Definitions ---
  #define Temp 14        // DHT
  #define Red_LED 26
  #define Green_LED 27
  #define Buzzer 25
  #define Accepted 2
  #define Denied 13
  #define SS_PIN 5
  #define RST_PIN 22
  #define DHTTYPE DHT22

  #define SOIL_DIGITAL_PIN 32  // New: Soil Digital Input
  #define GAS_DIGITAL_PIN 35   // New: Gas Digital Input

  MFRC522 mfrc522(SS_PIN, RST_PIN);
  DHT dht(Temp, DHTTYPE);

  // --- WiFi and MQTT Configuration ---
  const char *SSID = "BPPTIK-GUEST";
  const char *PASS = "bpptik!!";
  const char *MQTT_SERVER = "broker.emqx.io";
  const int MQTT_PORT = 1883;

  WiFiClient wifiClient;
  PubSubClient mqttClient(wifiClient);

  // --- Timing ---
  unsigned long lastBeepTime = 0;
  const unsigned long beepDuration = 100;
  const unsigned long beepInterval = 3000;

  // --- Authorized RFID UIDs ---
  const String authorizedUIDs[] = {
    "16 9E 17 02",
    "04 65 72 98",
      "A1 B2 C3 D4",
      "11 22 33 44",
      "AB CD EF 01",
      "23 45 67 89",
      "DE AD BE EF",
      "12 34 56 78",
      "90 87 65 43",
      "FF EE DD CC"
  };
  const int numAuthorized = sizeof(authorizedUIDs) / sizeof(authorizedUIDs[0]);

  void connectToWiFi() {
    Serial.print("Connecting to: ");
    Serial.println(SSID);
    WiFi.begin(SSID, PASS);
    while (WiFi.status() != WL_CONNECTED) {
      Serial.print(".");
      delay(500);
    }
    Serial.print("\nConnected to address: ");
    Serial.println(WiFi.localIP());
  }

  void connectToBroker(String clientName) {
    mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
    Serial.println("Connecting to MQTT Broker...");
    String clientId = "ESP32Client-" + clientName;

    while (!mqttClient.connected()) {
      if (mqttClient.connect(clientId.c_str())) {
        Serial.print("Connected to broker as ");
        Serial.println(clientName);
      } else {
        Serial.print("Failed, state: ");
        Serial.print(mqttClient.state());
        Serial.println(" | Retrying in 2 seconds...");
        delay(2000);
      }
    }
  }

  void doPublish(String topic, String payload) {
    mqttClient.publish(topic.c_str(), payload.c_str());
    Serial.print(topic);
    Serial.print(" ==> ");
    Serial.println(payload);
  }

  void setup() {
    Serial.begin(115200);
    SPI.begin();
    mfrc522.PCD_Init();
    Serial.println("Scan your RFID card...");

    pinMode(Red_LED, OUTPUT);
    pinMode(Green_LED, OUTPUT);
    pinMode(Buzzer, OUTPUT);
    pinMode(Accepted, OUTPUT);
    pinMode(Denied, OUTPUT);

    pinMode(SOIL_DIGITAL_PIN, INPUT);  // New
    pinMode(GAS_DIGITAL_PIN, INPUT);   // New

    dht.begin();
    connectToWiFi();
    connectToBroker("SenseHarvest");
  }

  void loop() {
    if (!mqttClient.connected()) {
      connectToBroker("SenseHarvest");
    }
    mqttClient.loop();

    // --- TEMP & HUMIDITY ---
    bool tempHigh = false;
    bool tempModerate = false;
    bool tempLow = false;
    bool moderateBeepActive = false;

    float temperatureC = dht.readTemperature();
    float humidity = dht.readHumidity();
    String tempStatus;
    if (!isnan(temperatureC)) {
      Serial.print("Temperature: ");
      Serial.print(temperatureC);
      Serial.println(" °C");
    

      if (temperatureC >= 30) {
        tempHigh = true;
        tempStatus = "critical";
      } else if (temperatureC >= 21) {
        tempModerate = true;
        tempStatus = "perfect temperature";
      } else if (temperatureC <= 20) {
        tempLow = true;
        tempStatus = "critical";
      }

       String tempJSON = "{ \"temperature\": " + String(temperatureC, 1) + ", \"status\": \"" + tempStatus + "\" }";
       doPublish("Temp/SenseHarvest", tempJSON);
      
      
    }

    unsigned long currentMillis = millis();
    static unsigned long previousBuzzMillis = 0;
    static bool buzzOn = false;

    if (tempHigh || tempLow) {
      digitalWrite(Red_LED, HIGH);
      digitalWrite(Green_LED, LOW);
      if (currentMillis - previousBuzzMillis >= 500) {
        previousBuzzMillis = currentMillis;
        buzzOn = !buzzOn;
        if (buzzOn) tone(Buzzer, 500);
        else noTone(Buzzer);
      }
    } else if (tempModerate) {
      digitalWrite(Red_LED, LOW);
      digitalWrite(Green_LED, HIGH);
      if (currentMillis - lastBeepTime >= 30000) {
        tone(Buzzer, 1000, 300);
        lastBeepTime = currentMillis;
      }
      moderateBeepActive = true;
    } else {
      digitalWrite(Red_LED, LOW);
      digitalWrite(Green_LED, LOW);
    }


    
    if (!tempHigh && !moderateBeepActive) noTone(Buzzer);

    String humidityStatus;
    if (humidity <= 40.0) {
      humidityStatus = "low";
      Serial.println("Warning: Low humidity in warehouse!");
    } else if (humidity >= 70.0) {
      humidityStatus = "high";
      Serial.println("Warning: High humidity in warehouse!");
    } else if (humidity >= 50.00){
      humidityStatus = "ideal";
      Serial.println("Humidity is moderate");
    }

    String humidityJSON = "{\"humidity\": " + String(humidity,1) + ", \"status\": \"" + humidityStatus + "\"}";
    doPublish("Humidity/SenseHarvest", humidityJSON);
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");

    // --- GAS SENSOR (Digital) ---
    int gasDigital = digitalRead(GAS_DIGITAL_PIN);
    Serial.print("Gas Digital: ");
    Serial.println(gasDigital);
    doPublish("GasDigital/SenseHarvest", gasDigital == HIGH ? "Gas Detected" : "Safe");

    if (gasDigital == HIGH) {
      Serial.println("Warning: High gas level detected!");
      doPublish("Warning", "Gas level HIGH!");
    }

    // --- SOIL SENSOR (Digital) ---
    int soilDigital = digitalRead(SOIL_DIGITAL_PIN);
    Serial.print("Soil Digital: ");
    Serial.println(soilDigital);
    doPublish("SoilDigital/SenseHarvest", soilDigital == HIGH ? "Soil is Dry" : "Soil is Wet");

    if (soilDigital == HIGH) {
      Serial.println("Warning: Soil too dry!");
      doPublish("Warning", "Soil is too dry!");
    }

    // --- RFID CHECK ---
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
      String content = "";
      for (byte i = 0; i < mfrc522.uid.size; i++) {
        content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
        content.concat(String(mfrc522.uid.uidByte[i], HEX));
        if (i < mfrc522.uid.size - 1) content.concat(" ");
      }
      content.toUpperCase();

      Serial.print("RFID UID: ");
      Serial.println(content);
      bool authorized = false;
      for (int i = 0; i < numAuthorized; i++) {
        if (content == authorizedUIDs[i]) {
          authorized = true;
          break;
        }
      }

    String status = authorized ? "accepted" : "denied";
    String jsonPayload = "{ \"UID\": \"" + content + "\", \"status\": \"" + status + "\" }";
    doPublish("RFID/SenseHarvest", jsonPayload);

      if (authorized) {
        Serial.println("Authorized access");
        digitalWrite(Accepted, HIGH);
        digitalWrite(Denied, LOW);
      
      } else {
        Serial.println("Access denied");
        digitalWrite(Accepted, LOW);
        digitalWrite(Denied, HIGH);
        
      }

      delay(3000);
      digitalWrite(Accepted, LOW);
      digitalWrite(Denied, LOW);
    }

    
    delay(1000);
  }
