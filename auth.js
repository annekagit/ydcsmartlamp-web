firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(user => {
  if (!user && location.pathname !== "/login.html") {
    location.href = "login.html";
  }
});

document.getElementById("login-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => location.href = "index.html")
    .catch(err => alert("Login gagal: " + err.message));
});