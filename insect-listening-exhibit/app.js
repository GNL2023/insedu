(() => {
  const stations = {
    cricket: { frequencies: [2600, 3100], wave: "square", duration: 1.1, label: "Cricket-inspired synthetic chirps" },
    bee: { frequencies: [180, 205, 230], wave: "sawtooth", duration: 1.8, label: "Bee-inspired synthetic buzz" },
    beetle: { frequencies: [900, 1350, 780], wave: "triangle", duration: 0.13, label: "Beetle-inspired synthetic clicks" },
    leaf: { frequencies: [430, 610, 520], wave: "sine", duration: 0.3, label: "Leaf-level synthetic tones" }
  };
  let audioContext;
  let micStream;
  let micSource;
  let analyser;
  let animation;
  const status = document.getElementById("status");
  const dot = document.getElementById("dot");
  const start = document.getElementById("start");
  const stop = document.getElementById("stop");
  const canvas = document.getElementById("scope");
  const ctx = canvas.getContext("2d");
  const fileInput = document.getElementById("audioFile");
  const player = document.getElementById("player");
  const fileName = document.getElementById("fileName");
  let objectUrl;

  async function getContext() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") await audioContext.resume();
    return audioContext;
  }

  function tone(frequency, duration, type, offset = 0) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startAt = audioContext.currentTime + offset;
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.12, startAt + 0.012);
    gain.gain.setValueAtTime(0.12, startAt + Math.max(0.02, duration - 0.035));
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.02);
  }

  document.querySelectorAll(".demo").forEach(button => {
    button.addEventListener("click", async () => {
      const station = stations[button.dataset.kind];
      const original = button.textContent;
      button.disabled = true;
      button.textContent = "Playing demo…";
      try {
        await getContext();
        if (button.dataset.kind === "cricket") {
          for (let i = 0; i < 6; i++) tone(station.frequencies[i % 2], 0.055, station.wave, i * 0.14);
        } else if (button.dataset.kind === "beetle") {
          station.frequencies.forEach((f, i) => tone(f, station.duration, station.wave, i * 0.22));
        } else if (button.dataset.kind === "leaf") {
          station.frequencies.forEach((f, i) => tone(f, station.duration, station.wave, i * 0.38));
        } else {
          station.frequencies.forEach((f, i) => tone(f, 0.6, station.wave, i * 0.48));
        }
        window.setTimeout(() => { button.disabled = false; button.textContent = original; }, 1700);
      } catch (error) {
        button.disabled = false;
        button.textContent = original;
        document.getElementById("help").textContent = "Audio could not start. Check browser audio permissions and try again.";
      }
    });
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    if (!file) {
      player.hidden = true;
      fileName.textContent = "No recording selected.";
      return;
    }
    objectUrl = URL.createObjectURL(file);
    player.src = objectUrl;
    player.hidden = false;
    fileName.textContent = file.name + " · " + (file.size / 1024 / 1024).toFixed(2) + " MB";
  });

  function drawWave() {
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    const width = canvas.width, height = canvas.height;
    analyser.getByteTimeDomainData(data);
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#53795b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = i / (data.length - 1) * width;
      const y = data[i] / 255 * height;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    animation = requestAnimationFrame(drawWave);
  }

  start.addEventListener("click", async () => {
    start.disabled = true;
    status.textContent = "Requesting microphone permission…";
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone access is unavailable in this browser or context.");
      }
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      await getContext();
      micSource = audioContext.createMediaStreamSource(micStream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      micSource.connect(analyser);
      dot.classList.add("on");
      status.textContent = "Microphone is live";
      stop.disabled = false;
      drawWave();
    } catch (error) {
      status.textContent = error.name === "NotAllowedError" ? "Microphone permission was denied" : "Could not start microphone";
      document.getElementById("help").textContent = error.message + " Use localhost or HTTPS and check site permissions.";
      if (micStream) micStream.getTracks().forEach(track => track.stop());
      micStream = null;
      start.disabled = false;
    }
  });

  function stopMicrophone() {
    if (animation) cancelAnimationFrame(animation);
    animation = null;
    if (micSource) micSource.disconnect();
    if (micStream) micStream.getTracks().forEach(track => track.stop());
    micSource = null;
    micStream = null;
    analyser = null;
    dot.classList.remove("on");
    status.textContent = "Microphone is off";
    start.disabled = false;
    stop.disabled = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  stop.addEventListener("click", stopMicrophone);
  window.addEventListener("pagehide", () => {
    stopMicrophone();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  });
})();