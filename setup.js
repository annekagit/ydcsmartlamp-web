document.getElementById("device-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("device-id").value.trim();
  const name = document.getElementById("device-name").value.trim();

  if (!id || !name) {
    alert("ID dan Nama harus diisi!");
    return;
  }

  db.ref("devices/" + id).set({ name })
    .then(() => {
      alert("✅ Perangkat berhasil ditambahkan!");
      document.getElementById("device-form").reset();
    })
    .catch((error) => {
      console.error("❌ Gagal menyimpan:", error);
      alert("Gagal menyimpan ke Firebase.");
    });
});
