window.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit");
  const statusDiv = document.getElementById("status");

  submitBtn.addEventListener("click", async () => {
    const id = document.getElementById("device-id").value.trim();
    const name = document.getElementById("device-name").value.trim();

    if (!id || !name) {
      statusDiv.innerText = "❗ Device ID dan Nama wajib diisi.";
      return;
    }

    try {
      await firebase.database().ref("devices/" + id).set({
        name: name,
        addedAt: new Date().toISOString()
      });
      statusDiv.innerText = "✅ Perangkat berhasil disimpan!";
    } catch (e) {
      console.error(e);
      statusDiv.innerText = "❌ Gagal menyimpan perangkat.";
    }
  });
});
