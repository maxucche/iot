const express = require('express');
const app = express();
const mysql2 = require('mysql2');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const cors = require('cors');
app.use(cors());

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '16072002',
    database: 'iot',
    dateStrings: ['DATETIME']
});

const mqttClient = mqtt.connect('mqtt://localhost:1883');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({server: server});

db.connect((error) => error ? console.error('Connect error:', error) : console.log('Connected MySQL'));

// đăng ký nhận thông điệp từ hai topic là 'sensor' và 'action'.
mqttClient.on('connect', () =>{
    console.log('Successfully connected to MQTT broker');
    mqttClient.subscribe('sensor');
    mqttClient.subscribe('action');
})
mqttClient.on('message', (topic, message) =>{
    console.log(message.toString());
    const data = message.toString().split('|');
    const subdata = `${message}|${timeNow()}`;
    const subdata2 = `${message.toString()}|${timeNow()}`
    console.log(subdata);
    console.log(subdata2);
    if(topic === 'sensor'){
        db.query(`INSERT INTO sensor (device_id, humidity, temperature, light, time) VALUES ('${data[0]}', ${data[1]}, ${data[2]}, ${data[3]}, '${timeNow()}')`, (err) =>{
            if(err){
                console.log('cannot insert');
            }
        });
    }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(subdata.toString());
        }
    });
})

// wss.on('connection',(ws)=>{
//     console.log('Client connected');
//     ws.on('message',(message)=>{
//         console.log(message.toString())
//         const data = message.toString().split('|');
//         db.query(`INSERT INTO action (device_id, status, time) VALUES ('${data[0]}', '${data[1]}', '${timeNow()}')`,(error)=>{
//             if(error){
//                 console.error('cannot insert into action');
//             }
//         })
//         mqttClient.publish('button', data[0] + "|" + data[1]);
//     })
//     ws.on('close', ()=> console.log('Client disconnected'));
// })


wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(message.toString());
        const data = message.toString().split('|');

        // Xử lý thông điệp từ WebSocket một cách nhanh chóng
        db.query(`INSERT INTO action (device_id, status, time) VALUES (?, ?, ?)`, 
          [data[0], data[1], timeNow()],
          (error) => {
              if (error) {
                  console.error('Error inserting into action:', error);
              }
          }
        );

        // Gửi thông điệp đến MQTT
        mqttClient.publish('button', message.toString());
    });

    ws.on('close', () => console.log('Client disconnected'));
});

function timeNow() {
    const dateTime = new Date();
    time = dateTime.toTimeString().split(' ')[0];
    [month, day, year] = dateTime.toLocaleDateString().split('/');
    return year + '-' + month + '-' + day + ' ' + time;
}

app.get('/api/sensor/data',(req, res)=>{
    db.query('SELECT * FROM sensor',(err, data)=>{
        if(err){
            console.error(err);
        }else{
            res.send(data)
        }
    })
})

server.listen(3000, ()=>{
    console.log('listening on port 3000');
})

app.get('/api/action/data',(req, res)=>{
    db.query('SELECT * FROM action',(err, data)=>{
        if(err){
            console.error(err);
        }else{
            res.send(data)
        }
    })
})

function timeFormatter(datetime) {
    [date, time] = datetime.split(' ');
    [day, month, year] = date.split('-');
    return year + "-" + month + "-" + day + " " + time;
}

app.get('/api/sensor/time/start=:start&end=:end', (req, res) => {
    timeStart = timeFormatter(req.params.start);
    timeEnd = timeFormatter(req.params.end);
    db.query(`SELECT * FROM sensor WHERE time >= '${timeStart}' and time <= '${timeEnd}'`,
        (err, data) => {
            if (err) {
                console.error(err);
            } else {
                res.send(data);
            }
        });
});

app.get('/api/action/time/start=:start&end=:end', (req, res) => {
    timeStart = timeFormatter(req.params.start);
    timeEnd = timeFormatter(req.params.end);
    db.query(`SELECT * FROM action WHERE time >= '${timeStart}' and time <= '${timeEnd}'`,
        (err, data) => {
            if (err) {
                console.error(err);
            } else {
                res.send(data);
            }
        });
});

app.get('/api/sensor/sort/value=:value&type=:type', (req, res) => {
    db.query(`SELECT * FROM sensor ORDER BY ${req.params.value} ${req.params.type}`, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.send(data);
        }
    });
});

// app.get('/api/sensor/search/type=:type&search=:search', (req, res) => {
//     db.query(`SELECT * FROM sensor WHERE ${req.params.type} LIKE '%${req.params.search}%'`,
//         (err, data) => {
//             if (err) {
//                 console.error(err);
//             } else {
//                 res.send(data);
//             }
//         });
// });
app.get('/api/sensor/search/type=:type&search=:search', (req, res) => {
    db.query(`SELECT * FROM sensor WHERE ${req.params.type} = '${req.params.search}'`,
        (err, data) => {
            if (err) {
                console.error(err);
            } else {
                res.send(data);
            }
        });
});
