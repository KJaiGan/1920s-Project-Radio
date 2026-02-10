const dial = document.getElementById("dial");
const freqDisplay = document.getElementById("frequency");
const actualaudio = document.getElementById("broadcast");
const staticaudio = document.getElementById("static");

let angle = 0;
let isDragging = false;
let isPlaying = false;

// Set up audio loops
actualaudio.loop = true;
staticaudio.loop = true;
actualaudio.volume = 1;
staticaudio.volume = 1;

// ---- Dial events ----
dial.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDragging = true;
  dial.style.cursor = "grabbing";

  // Start static if not playing
  if (!isPlaying && staticaudio.paused) {
    staticaudio.play().catch(() => {});
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  dial.style.cursor = "grab";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  // Rotate dial
  angle += e.movementX * 0.6;
  angle = Math.max(-135, Math.min(135, angle));
  dial.style.transform = `rotate(${angle}deg)`;

  // Map angle to frequency (540–1500 kHz)
  const frequency = Math.round(540 + ((angle + 135) / 270) * (1500 - 540));
  freqDisplay.textContent = frequency + " kHz";

  const target = 840;         // Broadcast frequency
  const tolerance = 15;       // kHz window
  const distance = Math.abs(frequency - target);

  if (distance <= tolerance) {
    // Tuned to broadcast
    if (!isPlaying) {
      staticaudio.pause();
      actualaudio.play().catch(() => {});
      isPlaying = true;
    }
    staticaudio.volume = 0;
    actualaudio.volume = 1 - distance / tolerance; // optional fade near center
  } else {
    // Off-tune: static
    if (isPlaying) {
      actualaudio.pause();
      isPlaying = false;
    }
    staticaudio.volume = 1;
    if (staticaudio.paused) staticaudio.play().catch(() => {});
  }
});
