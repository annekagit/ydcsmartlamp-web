fetch('ads.json')
  .then(response => response.json())
  .then(data => document.getElementById("ad-banner").innerHTML = `Iklan: ${data.banner} <a href="${data.link}">Upgrade sekarang</a>`);
