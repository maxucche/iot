
// const btoff = document.querySelector(".device.light .button-class:last-child");
//const lightimg = document.querySelector(".device.light img");
// const bton = document.querySelector(".device.light .button-class:first-child");
// const fanon = document.querySelector(".device.fan .button-class:first-child");
// const fanoff = document.querySelector(".device.fan .button-class:last-child");
const fanimg = document.querySelector(".device.fan img");
const sidebarItem = document.querySelectorAll(".sidebar li");
const dashboard = document.getElementById("dashboard");
const profile = document.getElementById("profile");
const sensor = document.getElementById("sensor-data");
const action = document.getElementById("action-data");
const startTimesensor = document.getElementById("startTimesensor");
const endTimesensor = document.getElementById("endTimesensor");
const startTimeaction = document.getElementById("startTimeaction");
const endTimeaction = document.getElementById("endTimeaction");
const btnDTSS = document.getElementById("btnDTSS");
const btnDTAC = document.getElementById("btnDTAC");
const selectSensor = document.getElementById("selectSensor")
const SU = document.getElementById("SU");
const SD = document.getElementById("SD");
const selectSearch = document.getElementById("selectSearch")
const inputSSensor = document.getElementById("inputSSensor")
const btnSSensor = document.getElementById("btnSSensor")
//const deviceid = document.getElementById();

//let idAction = 1;

// function updateAction(deviceID, action) {
//     const actionData = document.getElementById("action").getElementsByTagName('tbody')[0];

//     const newRow = actionData.insertRow();

//     const currentTime = new Date();

//     const IDCell = newRow.insertCell(0)
//     const deviceIDCell = newRow.insertCell(1)
//     const actionCell = newRow.insertCell(2)
//     const timeCell = newRow.insertCell(3)

//     IDCell.textContent = idAction++;
//     deviceIDCell.textContent = deviceID;
//     actionCell.textContent = action;
//     timeCell.textContent = currentTime.toLocaleTimeString();

// }
const webSocket = new WebSocket('ws://localhost:3000');

webSocket.onopen = () => {
    console.log('webSocket connected');
}

webSocket.onclose = () => {
    console.log('webSocket disconnected');
}

function buttonONOFF(button_id) {
    if (button_id === 'ledon') {
        webSocket.send('led|on');
    }
    if (button_id === 'ledoff') {
        webSocket.send('led|off');
    }
    if (button_id === 'fanon') {
        webSocket.send('fan|on');
    }
    if (button_id === 'fanoff') {
        webSocket.send('fan|off');
    }
}

function updateImgLed(Id, status) {
    var img_device = document.getElementById(Id);
    if (status === 'on') {
        img_device.src = "img/images.png";
    }
    else {
        img_device.src = "img/images.jpg";
    }
}

function updateImgFan(Id, status) {
    var img_device = document.getElementById(Id);
    if (status === 'on') {
        img_device.src = "img/fan-animate2.gif";
    }
    else {
        img_device.src = "img/fan-static2.png";
    }
}

webSocket.onmessage = (message) => {
    const data = message.data.split('|');
    // if (data[0] === 'DHT11') {

    // }
    if (data[0] === 'led') {
        updateImgLed(data[0], data[1]);
    }
    if (data[0] === 'fan') {
        updateImgFan(data[0], data[1]);
    }
    updateChart(data[1], data[2], data[3], data[4]);
        
}
// btoff.addEventListener("click", function () {
//     lightimg.src = "img/images.jpg";
//     updateAction(1, "OFF");
// });

// bton.addEventListener("click", function () {
//     lightimg.src = "img/images.png";
//     updateAction(1, "ON");
// });

// fanoff.addEventListener("click", function () {
//     fanimg.src = "img/fan-static2.png";
//     updateAction(2, "OFF");
// });

// fanon.addEventListener("click", function () {
//     fanimg.src = "img/fan-animate2.gif";
//     updateAction(2, "ON");
// });


// Khai báo biến và hằng số
const itemsPerPage = 10; // Số dòng dữ liệu hiển thị trên mỗi trang
let currentSSPage = 1; // Trang hiện tại

// Hàm hiển thị dữ liệu trên trang cần
function displayDataOnPageSS(data, page) {
    const tbody = document.querySelector('#sensor_table tbody');
    tbody.innerHTML = ''; // Xóa nội dung tbody

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    for (let i = startIndex; i < endIndex; i++) {
        if (data[i]) {
            const item = data[i];
            const row = document.createElement('tr');
            // Tạo các td và thiết lập nội dung
            // ...
            const device_id = document.createElement('td');
            device_id.textContent = item.device_id;
            row.appendChild(device_id);
            const humidity = document.createElement('td');
            humidity.textContent = item.humidity;
            row.appendChild(humidity);
            const temperature = document.createElement('td');
            temperature.textContent = item.temperature;
            row.appendChild(temperature);
            const light = document.createElement('td');
            light.textContent = item.light;
            row.appendChild(light);
            const time = document.createElement('td');
            time.textContent = item.time;
            row.appendChild(time);
            tbody.appendChild(row);
        }
    }
}

// Hàm cập nhật giao diện phân trang
function updatePaginationSS(data) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pageSelector = document.querySelector('#page-selector-sensor');

    // Xóa tất cả các tùy chọn
    pageSelector.innerHTML = '';

    // Tạo các tùy chọn cho selector
    for (let i = 1; i <= totalPages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;

        pageSelector.appendChild(option);
    }

    // Thiết lập giá trị trang hiện tại cho selector
    pageSelector.value = currentSSPage;

    // Hiển thị dữ liệu trên trang hiện tại
    displayDataOnPageSS(data, currentSSPage);
}

let activity = 'show';
const typeup = 'ASC';
const typedown = 'DESC';
// Xử lý sự kiện khi chọn trang từ selector

document.querySelector('#page-selector-sensor').addEventListener('change', (event) => {
    currentSSPage = parseInt(event.target.value);
    if (activity === 'show') {
        fetchAndDisplayDataSS();
    } else if(activity == 'searchwithtimerange'){
        fetchAndDisplayDataSSWithTimeRange(startTimesensor.value, endTimesensor.value);
    } else if(activity == 'sortup'){
        fetchAndDisplaySortDataSS(selectSensor.value, typeup)
    } else if(activity == 'sortdown'){
        fetchAndDisplaySortDataSS(selectSensor.value, typedown)
    } else if(activity == 'search'){
        fetchSearchDataSS(selectSearch.value, inputSSensor.value)
    }
});

// Xử lý sự kiện khi nhấn nút "Back"
document.querySelector('#page-back-sensor').addEventListener('click', () => {
    if (currentSSPage > 1) {
        currentSSPage--;
        if (activity === 'show') {
            fetchAndDisplayDataSS();
        } else if(activity == 'searchwithtimerange'){
            fetchAndDisplayDataSSWithTimeRange(startTimesensor.value, endTimesensor.value);
        } else if(activity == 'sortup'){
            fetchAndDisplaySortDataSS(selectSensor.value, typeup)
        } else if(activity == 'sortdown'){
            fetchAndDisplaySortDataSS(selectSensor.value, typedown)
        } else if(activity == 'search'){
            fetchSearchDataSS(selectSearch.value, inputSSensor.value)
        }
    }
});

// Xử lý sự kiện khi nhấn nút "Next"
document.querySelector('#page-next-sensor').addEventListener('click', () => {
    const totalPages = parseInt(document.querySelector('#page-selector-sensor').options[document.querySelector('#page-selector-sensor').options.length - 1].value);
    if (currentSSPage < totalPages) {
        currentSSPage++;
        if (activity === 'show') {
            fetchAndDisplayDataSS();
        } else if(activity == 'searchwithtimerange'){
            fetchAndDisplayDataSSWithTimeRange(startTimesensor.value, endTimesensor.value);
        } else if(activity == 'sortup'){
            fetchAndDisplaySortDataSS(selectSensor.value, typeup)
        } else if(activity == 'sortdown'){
            fetchAndDisplaySortDataSS(selectSensor.value, typedown)
        } else if(activity == 'search'){
            fetchSearchDataSS(selectSearch.value, inputSSensor.value)
        }
    }
});



// Hàm fetch và hiển thị dữ liệu
function fetchAndDisplayDataSS() {
    fetch('http://localhost:3000/api/sensor/data')
        .then((res) => res.json())
        .then((data) => {
            updatePaginationSS(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
fetchAndDisplayDataSS();




// Hàm fetch và hiển thị dữ liệu theo thời gian bắt đầu và kết thúc
function fetchAndDisplayDataSSWithTimeRange(startTime, endTime) {
    const url = `http://localhost:3000/api/sensor/time/start=${startTime}&end=${endTime}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            updatePaginationSS(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Xử lý sự kiện khi nhấn nút "Tìm kiếm"
btnDTSS.addEventListener('click', () => {
    const startTime = startTimesensor.value;
    const endTime = endTimesensor.value;
    activity = 'searchwithtimerange';
    // Xử lý sự kiện khi chọn trang từ selector

    fetchAndDisplayDataSSWithTimeRange(startTime, endTime);
});

function fetchAndDisplaySortDataSS(value, type) {
    const url = `http://localhost:3000/api/sensor/sort/value=${value}&type=${type}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            updatePaginationSS(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const sensorValue = selectSensor.value;
SU.addEventListener('click', () => {
    const value = selectSensor.value;
    activity = 'sortup'
    fetchAndDisplaySortDataSS(value, typeup);
})

SD.addEventListener('click', () => {
    const value = selectSensor.value;
    activity = 'sortdown'
    fetchAndDisplaySortDataSS(value, typedown);
})

function fetchSearchDataSS(type, search){
    const url = `http://localhost:3000/api/sensor/search/type=${type}&search=${search}`
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            updatePaginationSS(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

btnSSensor.addEventListener('click', () => {
    const type = selectSearch.value;
    const search = inputSSensor.value;
    activity='search'
    fetchSearchDataSS(type, search);
})
// Gọi hàm fetch và hiển thị dữ liệu khi trang được tải


//----------------------------------------------------------------------------


// Khai báo biến và hằng số
let currentACPage = 1; // Trang hiện tại
isSearchingAC = false
// Hàm hiển thị dữ liệu trên trang cần
function displayDataOnPageAC(data, page) {
    const tbody = document.querySelector('#action_table tbody');
    tbody.innerHTML = ''; // Xóa nội dung tbody

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    for (let i = startIndex; i < endIndex; i++) {
        if (data[i]) {
            const item = data[i];
            const row = document.createElement('tr');
            // Tạo các td và thiết lập nội dung
            // ...
            const device_id = document.createElement('td');
            device_id.textContent = item.device_id;
            row.appendChild(device_id);
            const status = document.createElement('td');
            status.textContent = item.status;
            row.appendChild(status);
            const time = document.createElement('td');
            time.textContent = item.time;
            row.appendChild(time);
            tbody.appendChild(row);
        }
    }
}

// Hàm cập nhật giao diện phân trang
function updatePaginationAC(data) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pageSelector = document.querySelector('#page-selector-action');

    // Xóa tất cả các tùy chọn
    pageSelector.innerHTML = '';

    // Tạo các tùy chọn cho selector
    for (let i = 1; i <= totalPages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;

        pageSelector.appendChild(option);
    }

    // Thiết lập giá trị trang hiện tại cho selector
    pageSelector.value = currentACPage;

    // Hiển thị dữ liệu trên trang hiện tại
    displayDataOnPageAC(data, currentACPage);
}

// Xử lý sự kiện khi chọn trang từ selector
document.querySelector('#page-selector-action').addEventListener('change', (event) => {
    currentACPage = parseInt(event.target.value);
    if (isSearchingAC) {
        fetchAndDisplayDataACWithTimeRange(startTimeaction.value, endTimeaction.value)
    } else {
        fetchAndDisplayDataAC();
    }
});

// Xử lý sự kiện khi nhấn nút "Back"
document.querySelector('#page-back-action').addEventListener('click', () => {
    if (currentACPage > 1) {
        currentACPage--;
        if (isSearchingAC) {
            fetchAndDisplayDataACWithTimeRange(startTimeaction.value, endTimeaction.value)
        } else {
            fetchAndDisplayDataAC();
        }
    }
});

// Xử lý sự kiện khi nhấn nút "Next"
document.querySelector('#page-next-action').addEventListener('click', () => {
    const totalPages = parseInt(document.querySelector('#page-selector-action').options[document.querySelector('#page-selector-action').options.length - 1].value);
    if (currentACPage < totalPages) {
        currentACPage++;
        if (isSearchingAC) {
            fetchAndDisplayDataACWithTimeRange(startTimeaction.value, endTimeaction.value)
        } else {
            fetchAndDisplayDataAC();
        }
    }
});

// Hàm fetch và hiển thị dữ liệu
function fetchAndDisplayDataAC() {
    fetch('http://localhost:3000/api/action/data')
        .then((res) => res.json())
        .then((data) => {
            updatePaginationAC(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
fetchAndDisplayDataAC();

function fetchAndDisplayDataACWithTimeRange(startTime, endTime) {
    const url = `http://localhost:3000/api/action/time/start=${startTime}&end=${endTime}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            updatePaginationAC(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Xử lý sự kiện khi nhấn nút "Tìm kiếm"
btnDTAC.addEventListener('click', () => {
    const startTime = startTimeaction.value;
    const endTime = endTimeaction.value;
    isSearchingAC = true;
    // Xử lý sự kiện khi chọn trang từ selector

    fetchAndDisplayDataACWithTimeRange(startTime, endTime);
});








sidebarItem.forEach(function (item) {
    item.addEventListener("click", function () {
        dashboard.style.display = "none";
        profile.style.display = "none";
        sensor.style.display = "none";
        action.style.display = "none";

        if (item.textContent === "Dashboard") {
            dashboard.style.display = "block";
        } else if (item.textContent === "Profile") {
            profile.style.display = "flex";
        } else if (item.textContent === "Sensor Data") {
            sensor.style.display = "flex";
        } else if (item.textContent === "Action") {
            action.style.display = "flex";
        }
    })
})

function picktime(element, defaultDateValue) {
    flatpickr(element, {
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        defaulDate: defaultDateValue,
        time_24hr: true
    })
}

picktime(startTimesensor, new Date());
picktime(endTimesensor, new Date());
picktime(startTimeaction, new Date());
picktime(endTimeaction, new Date());

// Lấy tham chiếu đến thẻ canvas
const ctx = document.getElementById('chartCanvas');

// Biểu đồ dạng đa đường
const colorTemp = ['#FFE6E6', '#FFCDCD', '#FFB3B3', '#FF9A9A', '#FF8080', '#FF6666', '#FF4D4D', '#FF3333', '#FF1A1A', '#FF0000'];
const colorHumi = ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1"];
const colorBright = ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825", "#F57F17"];
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Nhiệt độ',
            data: [],
            yAxisID: 'y',
            cubicInterpolationMode: 'monotone',
            borderColor: "#FF0000",
            borderWidth: 0.4,
        },
        {
            label: 'Độ ẩm',
            cubicInterpolationMode: 'monotone',
            data: [],
            yAxisID: 'y',
            borderColor: "#0D47A1",
            borderWidth: 0.4,
        },
        {
            label: 'Ánh sáng',
            cubicInterpolationMode: 'monotone',
            data: [],
            yAxisID: 'y',
            borderColor: "#F57F17",
            borderWidth: 0.4,
        },],
        labels: []
    },
    options: {
        responsive: true,
        scales: {
            x: {
                display: true,
            },
            y: {
                display: true,
                position: 'left',
                max: 100,
                min: 0
            },
            y1: {
                display: true,
                position: 'right',
                max: 1100,
                min: 0
            }
        }
    }
});
function updateChart(humi, temp, light, time) {
    if (chart.data.datasets[0].data.length >= 10) {
        chart.data.datasets[0].data.shift()
        chart.data.datasets[1].data.shift()
        chart.data.datasets[2].data.shift()
        chart.data.labels.shift()
    }
    chart.data.datasets[1].data.push(humi)
    chart.data.datasets[2].data.push(light)
    chart.data.datasets[0].data.push(temp)
    chart.data.labels.push(time);
    chart.update()


    // let newData = Math.floor(Math.random() * 100) + 1;
    // let newData1 = Math.floor(Math.random() * 100) + 1;
    // let newData2 = Math.floor(Math.random() * 100) + 1;
    // if (humidityData.length > 5)
    //     humidityData.shift();
    // humidityData.push(newData);
    // if (temperatureData.length > 5)
    //     temperatureData.shift();
    // temperatureData.push(newData1);
    // if (lightData.length > 5)
    //     lightData.shift();
    // lightData.push(newData2);
    // let x = document.getElementById('doam');
    // let x1 = document.getElementById('nhietdo');
    // let x2 = document.getElementById('as');
    // x.textContent = `${newData.toFixed(1)}%`;
    // x1.textContent = `${newData1.toFixed(1)} độ`;
    // x2.textContent = `${newData2.toFixed(1)} LUX`;

    // const xs = document.getElementById("tp");
    // const xs1 = document.getElementById("hm");
    // const xs2 = document.getElementById("lt");


    // //chart.data.datasets[0].data = humidityData;
    // //chart.data.datasets[1].data = lightData;
    // //chart.data.datasets[2].data = temperatureData;
    // //console.log(typeof newData1.toFixed(1))
    // //console.log(newData1.toFixed(1))
    // chart.update();

    // if (parseFloat(newData1.toFixed(1)) > 50)
    //     xs.style.background = "linear-gradient(45deg, #d1bbbf, red)";
    // else {
    //     xs.style.background = "linear-gradient(45deg, yellow, green)";
    // }
    // if (parseFloat(newData.toFixed(1)) > 50)
    //     xs1.style.background = "linear-gradient(45deg, rgb(181,181,237), green)";
    // else {
    //     xs1.style.background = "linear-gradient(45deg, white, blue )";
    // }
    // if (parseFloat(newData2.toFixed(1)) > 50)
    //     xs2.style.background = "linear-gradient(45deg, yellow , orange)";
    // else {
    //     xs2.style.background = "linear-gradient(45deg, white, yellow)";
    // }
    document.getElementById('lt').style.background = colorTemp[parseInt(light / 100)];
    document.getElementById('anhsang').textContent = `${parseInt(light).toFixed(1)} LUX`;
    document.getElementById('nhietdo').textContent = `${parseInt(temp).toFixed(1)} độ C`;
    document.getElementById('doam').textContent = `${parseInt(humi).toFixed(1)} %`;
}

// function updateData_and_Color(humi, temp, light) {
//     document.getElementById('tp').style.background = colorTemp[parseInt(temp / 10)]
//     document.getElementById('hm').style.background = colorTemp[parseInt(humi / 10)]
//     document.getElementById('lt').style.background = colorTemp[parseInt(light / 100)]
//     document.getElementById('anhsang').textContent = `${parseInt(light).toFixed(1)} LUX`;
//     document.getElementById('nhietdo').textContent = `${parseInt(temp).toFixed(1)} độ C`;
//     document.getElementById('doam').textContent = `${parseInt(humi).toFixed(1)} %`;
// }
// function updateData_and_Color(humi, temp, light) {
//     document.getElementById('tp').style.background = colorTemp[parseInt(temp / 10)];

//     // Kiểm tra giá trị của humi
//     if (humi >= 65 && humi <= 75) {
//         // Thiết lập màu nền thành màu xanh nếu humi khoảng 69
//         document.getElementById('hm').style.background = 'blue';
//     } else {
//         // Sử dụng màu từ mảng colorHumi nếu không nằm trong khoảng trên
//         document.getElementById('hm').style.background = colorHumi[parseInt(humi / 10)];
//     }

//     document.getElementById('lt').style.background = colorTemp[parseInt(light / 100)];
//     document.getElementById('anhsang').textContent = `${parseInt(light).toFixed(1)} LUX`;
//     document.getElementById('nhietdo').textContent = `${parseInt(temp).toFixed(1)} độ C`;
//     document.getElementById('doam').textContent = `${parseInt(humi).toFixed(1)} %`;
// }




function updateData_and_Color(humi, temp, light) {
    // Cập nhật màu nền cho nhiệt độ (tp)
    if (temp >= 0 && temp < 10) {
        document.getElementById('tp').style.background = 'rgb(200,255,255)';
    } else if (temp >= 10 && temp < 20) {
        document.getElementById('tp').style.background = 'rgb(11,117,28)';
    } else if (temp >= 20 && temp <= 30) {
        document.getElementById('tp').style.background = 'rgb(255,223,46)';
    } else if (temp > 30) {
        document.getElementById('tp').style.background = 'rgb(255,41,6)';
    }

    // Cập nhật màu nền cho độ ẩm (hm)
    if (humi >= 0 && humi < 50) {
        document.getElementById('hm').style.background = 'rgb(230,244,255)';
    } else if (humi >= 50 && humi < 80) {
        document.getElementById('hm').style.background = 'rgb(148,207,255)';
    } else if (humi >= 80 && humi <= 100) {
        document.getElementById('hm').style.background = 'rgb(72,138,255)';
    }

    // Cập nhật giá trị cho ánh sáng và các thông số khác
    document.getElementById('lt').style.background = colorTemp[parseInt(light / 100)];
    document.getElementById('anhsang').textContent = `${parseInt(light).toFixed(1)} LUX`;
    document.getElementById('nhietdo').textContent = `${parseInt(temp).toFixed(1)} độ C`;
    document.getElementById('doam').textContent = `${parseInt(humi).toFixed(1)} %`;
}

// let idcount = 1;

// function updateSensortable() {
//     const sensorData = document.getElementById("sensor-data").getElementsByTagName('tbody')[0];

//     const newRow = sensorData.insertRow();

//     while (sensorData.rows.length > 10) {
//         sensorData.deleteRow(0);
//     }

//     const currentTime = new Date();

//     const IDCell = newRow.insertCell(0)
//     const timeCell = newRow.insertCell(1)
//     const tempCell = newRow.insertCell(2)
//     const humidCell = newRow.insertCell(3)
//     const lightCell = newRow.insertCell(4)

//     IDCell.textContent = idcount++;
//     timeCell.textContent = currentTime.toLocaleTimeString();
//     tempCell.textContent = temperatureData[temperatureData.length - 1] + " độ";
//     humidCell.textContent = humidityData[humidityData.length - 1] + " %";
//     lightCell.textContent = lightData[lightData.length - 1] + " lux";

// }


// setInterval(function () {
//     updateArrayAndChart(),
//         updateSensortable()
// }, 1000);



