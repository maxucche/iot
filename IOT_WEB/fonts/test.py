import paho.mqtt.client as mqtt
from random import randrange, uniform
from datetime import datetime
import time

mqtt_server = "localhost"  # Địa chỉ MQTT broker trên máy tính cá nhân
mqtt_port = 1883  # Cổng MQTT mặc định


# def on_publish(client, userdata, mid):
#     print(f"Đã gửi thông điệp với mã số: {mid}")


client = mqtt.Client("Information")
# client.on_publish = on_publish

client.connect(mqtt_server, mqtt_port, 60)

message_to_send_1 = "NGUYỄN ĐỨC HÒA"
message_to_send_2 = "B20DCCN264"
# Gửi thông điệp đến chủ đề "mytopic"
while True:
    current_time = datetime.now().strftime("%H:%M:%S %d-%m-%Y")  # Lấy thời gian hiện tại
    message_with_time = f"{message_to_send_1} lúc {current_time}"  # Kết hợp thông điệp và thời gian
    client.publish("mytopic", message_with_time)
    print(f"Đã gửi thông điệp: '{message_with_time}'")
    
    time.sleep(1)
# client.disconnect()
