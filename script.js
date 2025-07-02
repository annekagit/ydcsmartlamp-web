const clientID = "web_" + Math.floor(Math.random() * 100000);
const host = "a559f98d6d7a4f4ebfb441aada2b1175.s1.eu.hivemq.cloud";
const port = 8884;
const path = "/mqtt";

const client = new Paho.Client(host, port, path, clientID);

const options = {
  useSSL: true,
  userName: "webclient_user",
  password: "Webpassword123",
  onSuccess: onConnect,
  onFailure: (e) => {
    console.error("❌ Gagal konek:", e);
    updateMQTTStatus("Gagal konek", false);
  }
};

console.log("🔧 Memulai koneksi MQTT...");
client.connect(options);

client.onConnectionLost = function (response) {
  console.error("⚠️ Koneksi MQTT putus:", response.errorMessage);
  updateMQTTStatus("Putus", false);
};

client.onMessageArrived = function (message) {
  console.log("📥 Pesan masuk:", message.destinationName, message.payloadString);

  if (message.destinationName === "smartlamp/status/lampu_1") {
    document.getElementById("lamp-status").innerText = message.payloadString;
    document.getElementById("last-updated").innerText = new Date().toLocaleTimeString();
  }
};

function onConnect() {
  console.log("✅ MQTT Terhubung");
  updateMQTTStatus("Terhubung", true);
  client.subscribe("smartlamp/status/lampu_1");
}

function sendMessage(topic, msg) {
  console.log(`📤 Kirim ke ${topic}:`, msg);
  const message = new Paho.Message(msg);
  message.destinationName = topic;
  client.send(message);
}

function updateMQTTStatus(text, isConnected) {
  const el = document.getElementById("mqtt-status");
  el.innerText = `🔌 MQTT: ${text}`;
  el.className = "status-box " + (isConnected ? "connected" : "disconnected");
}

function updateClock() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const ss = now.getSeconds().toString().padStart(2, '0');
  document.getElementById("clock").innerText = `${hh}:${mm}:${ss}`;
}

setInterval(updateClock, 1000);
updateClock(); // inisialisasi awal

window.turnOn = function () {
  sendMessage("smartlamp/commands/lampu_1", "ON");
};

window.turnOff = function () {
  sendMessage("smartlamp/commands/lampu_1", "OFF");
};

window.setSchedule = function (event) {
  event.preventDefault();
  const jam = document.getElementById("jam").value.padStart(2, "0");
  const menit = document.getElementById("menit").value.padStart(2, "0");
  const action = document.getElementById("action").value;
  const scheduleString = `${jam}:${menit}=${action}`;
  sendMessage("smartlamp/schedule/lampu_1", scheduleString);
  alert("✅ Jadwal dikirim: " + scheduleString);
};

function clearSchedule() {
  if (confirm("Yakin ingin menghapus jadwal?")) {
    sendMessage("smartlamp/schedule/lampu_1", "CLEAR");
    alert("🗑️ Jadwal dihapus");
  }
}
