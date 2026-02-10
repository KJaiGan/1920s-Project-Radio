const dial = document.getElementById("dial");
const freqDisplay = document.getElementById("frequency");
const audio = document.getElementById("broadcast");
const playBtn = document.getElementById("playBtn");

let angle = 0;
let isDragging = false;

// Start audio (browser requires user interaction)
audio.volume = 0;
audio.play().catch(() => {
  // Autoplay blocked until interaction
});

function unlockAudio() {
  audio.volume = 0.08;
  document.removeEventListener("mousedown", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}

document.addEventListener("mousedown", unlockAudio);
document.addEventListener("keydown", unlockAudio);

// Mouse interaction
dial.addEventListener("mousedown", () => {
  isDragging = true;
  dial.style.cursor = "grabbing";
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

  // Map angle → frequency (540–1500 kHz)
  const frequency = Math.round(
    540 + ((angle + 135) / 270) * (1500 - 540)
  );

  freqDisplay.textContent = frequency + " kHz";

  // Audio clarity logic
  if (frequency === 840) {
    audio.volume = 1;
  } else {
    audio.volume = 0.08;
  }
});
