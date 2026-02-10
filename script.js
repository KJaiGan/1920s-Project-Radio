const dial = document.getElementById("dial");
const freqDisplay = document.getElementById("frequency");
const audio = document.getElementById("broadcast");

let angle = 0;
let isDragging = false;
let currentFrequency = 1020; // default on load
// Start audio (browser requires user interaction)
audio.volume = 0;
audio.play().catch(() => {
  // Autoplay blocked until interaction
});
function updateTuning() {
  if (Math.abs(currentFrequency - 840) <= 3) {
    audio.volume = 1;
  } else {
    audio.volume = 0.05;
  }
}
function unlockAudio() {
  audio.play().catch(() => {});
  updateTuning();
  document.removeEventListener("mousedown", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
  document.removeEventListener("touchstart", unlockAudio);
}

document.addEventListener("mousedown", unlockAudio);
document.addEventListener("keydown", unlockAudio);
document.addEventListener("touchstart", unlockAudio);

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

  angle += e.movementX * 0.6;
  angle = Math.max(-135, Math.min(135, angle));
  dial.style.transform = `rotate(${angle}deg)`;

  currentFrequency = Math.round(
    540 + ((angle + 135) / 270) * (1500 - 540)
  );

  freqDisplay.textContent = currentFrequency + " kHz";

  updateTuning();
});
