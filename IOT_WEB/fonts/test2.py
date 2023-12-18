import paho.mqtt.client as mqtt

mqtt_server = "localhost"  # Địa chỉ MQTT broker trên máy tính cá nhân
mqtt_port = 1883  # Cổng MQTT mặc định

# ham callback khi ket noi thanh cong


def on_connect(client, userdata, flags, rc):
    print("Kết nối thành công!")
    client.subscribe("mytopic")  # Đăng ký lắng nghe chủ đề "mytopic"
   

# ham callback khi nhan duoc thong dien tu ben pub


def on_message(client, userdata, message):
    
    print(
        f"Nhận được thông điệp từ {message.topic}: {message.payload.decode()}")


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

#60 - keep-alive
# Trong trường hợp này, giá trị 60 có nghĩa là client
# sẽ gửi một gói tin PINGREQ đến broker mỗi 60 giây để duy trì kết nối.
# Nếu client không gửi PINGREQ trong khoảng thời gian "keep-alive"
# (ví dụ: nếu kết nối bị mất), broker có thể cho rằng kết nối đã bị đóng
# và có thể xử lý tình huống đó.
client.connect(mqtt_server, mqtt_port, 60)
# duy tri ket noi vo thoi han
client.loop_forever()
