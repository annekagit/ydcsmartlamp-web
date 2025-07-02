const clientID = "web_" + parseInt(Math.random() * 100000, 10);
const host = "a559f98d6d7a4f4ebfb441aada2b1175.s1.eu.hivemq.cloud";
const port = 8884;
const path = "/mqtt"; // WAJIB untuk HiveMQ WebSocket

const client = new Paho.Client(host, port, path, clientID);

const options = {
  useSSL: true,
  userName: "webclient_user",       // Ganti sesuai akun HiveMQ kamu
  password: "Webpassword123",       // Ganti sesuai akun HiveMQ kamu
  onSuccess: onConnect,
  onFailure: function (e) {
    console.error("❌ Gagal konek:", e);
  }
};

console.log("🔧 Starting Paho MQTT client...");
console.log("Broker:", host, "Port:", port, "Path:", path);

client.connect(options);

// Event: koneksi hilang
client.onConnectionLost = function (response) {
  console.error("⚠️ Koneksi putus:", response.errorMessage);
};

// Event: pesan masuk
client.onMessageArrived = function (message) {
  console.log("📥 Pesan masuk:", message.destinationName, message.payloadString);
  if (message.destinationName === "lampu/status") {
    document.getElementById("lamp-status").innerText = message.payloadString;
  }
};

// Callback saat konek berhasil
function onConnect() {
  console.log("✅ Terhubung ke MQTT Broker");
  client.subscribe("lampu/status");
}

// Kirim pesan ke topik
function sendMessage(topic, msg) {
  console.log(`📤 Mengirim pesan ke "${topic}":`, msg);
  const message = new Paho.Message(msg);
  message.destinationName = topic;
  client.send(message);
}

// Fungsi global agar bisa dipanggil dari HTML
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
