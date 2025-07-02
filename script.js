const clientID = "web_" + parseInt(Math.random() * 100000, 10);
const host = "a559f98d6d7a4f4ebfb441aada2b1175.s1.eu.hivemq.cloud";
const port = 8884;
const path = "/mqtt";
const client = new Paho.Client(host, port, path, clientID);

const options = {
  useSSL: true,
  userName: "webclient_user",     // ganti sesuai akun HiveMQ
  password: "Webpassword123",     // ganti sesuai akun HiveMQ
  onSuccess: onConnect,
  onFailure: function (e) {
    console.error("❌ Gagal konek:", e);
    updateMQTTStatus("Gagal konek", false);
  }
};

console.log("🔧 Starting MQTT client...");
console.log("Broker:", host, "Port:", port, "Path:", path);

client.connect(options);

client.onConnectionLost = function (response) {
  console.error("⚠️ Koneksi putus:", response.errorMessage);
  updateMQTTStatus("Putus", false);
};

client.onMessageArrived = function (message) {
  console.log("📥 Pesan masuk:", message.destinationName, message.payloadString);

  if (message.destinationName === "lampu/status") {
    const statusEl = document.getElementById("lamp-status");
    const timeEl = document.getElementById("last-updated");

    statusEl.innerText = message.payloadString;

    const now = new Date();
    timeEl.innerText = now.toLocaleTimeString();
  }
};

function onConnect() {
  console.log("✅ Terhubung ke MQTT Broker");
  updateMQTTStatus("Terhubung", true);
  client.subscribe("lampu/status");
}

function sendMessage(topic, msg) {
  console.log(`📤 Mengirim pesan ke "${topic}":`, msg);
  const message = new Paho.Message(msg);
  message.destinationName = topic;
  client.send(message);
}

function updateMQTTStatus(text, isConnected) {
  const el = document.getElementById("mqtt-status");
  el.innerText = `🔌 MQTT: ${text}`;
  el.className = "status-box " + (isConnected ? "connected" : "disconnected");
}

window.turnOn = function () {
  sendMessage("lampu/control", "ON");
};

window.turnOff = function () {
  sendMessage("lampu/control", "OFF");
};

window.setSchedule = function (event) {
  event.preventDefault();
  const jam = document.getElementById("jam").value.padStart(2, "0");
  const menit = document.getElementById("menit").value.padStart(2, "0");
  const action = document.getElementById("action").value;
  const scheduleString = `${jam}:${menit}=${action}`;
  sendMessage("lampu/schedule", scheduleString);
  alert("✅ Jadwal dikirim: " + scheduleString);
};
