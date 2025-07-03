firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    // Jika belum login, arahkan ke halaman login
    window.location.href = "login.html";
  }
});

