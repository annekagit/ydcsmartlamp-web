const host = "a559f98d6d7a4f4ebfb441aada2b1175.s1.eu.hivemq.cloud";
const port = 8884;
const path = "/mqtt";
const user = "webclient_user";
const pass = "Webpassword123";
const clientID = "web_" + Math.floor(Math.random() * 100000);

let selectedDevice = null;
const client = new Paho.Client(host, port, path, clientID);

client.connect({
  useSSL: true,
  userName: user,
  password: pass,
  onSuccess: () => {
    console.log("✅ Terhubung ke MQTT");
    loadDevices();
  },
  onFailure: e => console.error("❌ Gagal konek", e)
});

client.onMessageArrived = message => {
  if (!selectedDevice) return;
  const expectedTopic = `smartlamp/status/${selectedDevice}`;
  if (message.destinationName === expectedTopic) {
    document.getElementById("lamp-status").innerText = message.payloadString;
  }
};

function loadDevices() {
  firebase.database().ref("devices").once("value", snap => {
    const select = document.getElementById("device-select");
    select.innerHTML = '<option value="">-- Pilih --</option>';
    snap.forEach(child => {
      const id = child.key;
      const name = child.val().name;
      const opt = document.createElement("option");
      opt.value = id;
      opt.text = name;
      select.appendChild(opt);
    });
  });
}

function onDeviceChange() {
  selectedDevice = document.getElementById("device-select").value;
  document.getElementById("control-section").style.display = selectedDevice ? "block" : "none";
  if (selectedDevice) {
    client.subscribe(`smartlamp/status/${selectedDevice}`);
  }
}

function sendMessage(topic, msg) {
  if (!selectedDevice) return;
  const message = new Paho.Message(msg);
  message.destinationName = `smartlamp/${topic}/${selectedDevice}`;
  client.send(message);
  console.log("Kirim:", message.destinationName, msg);
}

function turnOn() { sendMessage("commands", "ON"); }
function turnOff() { sendMessage("commands", "OFF"); }

function setSchedule(e) {
  e.preventDefault();
  const jam = document.getElementById("jam").value.padStart(2, "0");
  const menit = document.getElementById("menit").value.padStart(2, "0");
  const action = document.getElementById("action").value;
  const msg = `${jam}:${menit}=${action}`;
  sendMessage("schedule", msg);
  alert("Jadwal dikirim: " + msg);
}

function removeDevice() {
  const id = document.getElementById("device-select").value;
  if (!id) return;
  if (confirm("Yakin hapus?")) {
    firebase.database().ref("devices/" + id).remove();
    loadDevices();
    selectedDevice = null;
    document.getElementById("control-section").style.display = "none";
  }
}

function editDeviceName() {
  const id = document.getElementById("device-select").value;
  if (!id) return;
  const newName = prompt("Nama baru:");
  if (newName) {
    firebase.database().ref("devices/" + id).update({ name: newName });
    loadDevices();
    document.getElementById("device-select").value = id;
  }
}
