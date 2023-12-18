#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <BH1750.h>
#include <Wire.h>
#include <string.h>

#define DHTPIN D4             // Chân D4 cho DHT11
#define DHTTYPE DHT11
#define LED_PIN1 D6           // Chân D6 cho LED
#define LED_PIN2 D7           // Chân D7 cho Fan
int ledState = LOW;
int fanState = LOW;
const char* ssid = "So 7 62/15";
const char* password = "12345678@";

const char* mqttServer = "192.168.1.8";
const int mqttPort = 1883;
WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;  // Khởi tạo đối tượng BH1750

void setup() {
  Serial.begin(115200);
  delay(10);
  pinMode(LED_PIN1, OUTPUT);
  pinMode(LED_PIN2, OUTPUT);
  digitalWrite(LED_PIN1, LOW);
  digitalWrite(LED_PIN2, LOW);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  client.setServer(mqttServer, mqttPort);

  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP8266Client")) {
      Serial.println("Connected to MQTT");
      client.subscribe("button");
    } else {
      Serial.print("Failed with state ");
      Serial.print(client.state());
      delay(5000);
    }
  }
  client.setCallback(callback);
  dht.begin();
  Wire.begin();  // Bắt đầu giao tiếp I2C
  lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);  // Bắt đầu đo độ sáng
}

// void loop() {
//   client.loop();
//   static unsigned long previousDHTReadTime = 0;
//   unsigned long currentMillis = millis();
//   const unsigned long DHTReadInterval =2000; // Đọc dữ liệu từ DHT11 mỗi 2 giây

//   if (currentMillis - previousDHTReadTime >= DHTReadInterval) {
//     previousDHTReadTime = currentMillis;

//     float humidity = dht.readHumidity();
//     float temperature = dht.readTemperature();
//     uint16_t light = lightMeter.readLightLevel(); // Đọc độ sáng từ BH1750
//     String data = "DHT11|" + String(humidity) + "|" + String(temperature) + "|" + String(light);
//     Serial.println(data);
//     client.publish("sensor", data.c_str());
//   }
// }
void loop() {
  client.loop();

  static unsigned long previousDHTReadTime = 0;
  const unsigned long DHTReadInterval = 2000; // Đọc dữ liệu từ DHT11 mỗi 2 giây

  if (millis() - previousDHTReadTime >= DHTReadInterval) {
    previousDHTReadTime = millis();

    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    uint16_t light = lightMeter.readLightLevel(); // Đọc độ sáng từ BH1750

    String data = "DHT11|" + String(humidity) + "|" + String(temperature) + "|" + String(light);
    client.publish("sensor", data.c_str());
  }
}

// void callback(char* topic, byte* payload, unsigned int length) {
//   if (strcmp(topic, "button") == 0) {
//     String s = "";
//     for (int i = 0; i < length; i++)
//       s += (char)payload[i];
//     if (s.equalsIgnoreCase("led|off")) {
//       ledState = HIGH;
//     }
//     if (s.equalsIgnoreCase("led|on")) {
//       ledState = LOW;
//     }
//     if (s.equalsIgnoreCase("fan|on")) {
//       fanState = HIGH;
//     }
//     if (s.equalsIgnoreCase("fan|off")) {
//       fanState = LOW;
//     }
//     digitalWrite(LED_PIN1, ledState); // Điều khiển LED
//     digitalWrite(LED_PIN2, fanState); // Điều khiển Fan
//     Serial.println(s);
//     client.publish("action", s.c_str());
//   }
// }
void callback(char* topic, byte* payload, unsigned int length) {
  String command = "";
  for (int i = 0; i < length; i++) {
    command += (char)payload[i];
  }

  // Nhanh chóng cập nhật trạng thái và trả lời
  if (command.equalsIgnoreCase("led|on")) {
    digitalWrite(LED_PIN1, LOW);
  } else if (command.equalsIgnoreCase("led|off")) {
    digitalWrite(LED_PIN1, HIGH);
  } else if (command.equalsIgnoreCase("fan|on")) {
    digitalWrite(LED_PIN2, HIGH);
  } else if (command.equalsIgnoreCase("fan|off")) {
    digitalWrite(LED_PIN2, LOW);
  }
}
