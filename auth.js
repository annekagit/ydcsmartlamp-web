// auth.js
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    // Redirect ke login jika belum login
    window.location.href = "login.html";
  }
});
