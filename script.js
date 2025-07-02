const clientID = "web_" + parseInt(Math.random() * 100000, 10);
const host = "a559f98d6d7a4f4ebfb441aada2b1175.s1.eu.hivemq.cloud";
const port = 8884;
const path = "/mqtt";   // wajib ada
const client = new Paho.MQTT.Client(host, port, path, clientID);

const options = {
  useSSL: true,
  userName: "webclient_user",
  password: "webpassword123",
  onSuccess: onConnect,
  onFailure: function (e) {
    console.error("❌ Gagal konek:", e);
  }
};

console.log("🔧 Starting Paho MQTT client...");
console.log("Broker:", host, "Port:", port, "Path:", path);

client.connect(options);

client.onConnectionLost = function (response) {
  console.error("❌ Koneksi putus:", response.errorMessage);
};

client.onMessageArrived = function (message) {
  if (message.destinationName === "lampu/status") {
    document.getElementById("lamp-status").innerText = message.payloadString;
  }
};

function onConnect() {
  console.log("✅ Terhubung ke MQTT Broker");
  client.subscribe("lampu/status");
}

function sendMessage(topic, msg) {
  const message = new Paho.MQTT.Message(msg);
  message.destinationName = topic;
  client.send(message);
}

function turnOn() { sendMessage("lampu/control", "ON"); }
function turnOff() { sendMessage("lampu/control", "OFF"); }

function setSchedule(event) {
  event.preventDefault();
  const jam = document.getElementById("jam").value.padStart(2, "0");
  const menit = document.getElementById("menit").value.padStart(2, "0");
  const action = document.getElementById("action").value;
  const scheduleString = `${jam}:${menit}=${action}`;
  sendMessage("lampu/schedule", scheduleString);
  alert("✅ Jadwal dikirim: " + scheduleString);
}
