const dial = document.getElementById("dial");
const freqDisplay = document.getElementById("frequency");
const audio = document.getElementById("broadcast");

let angle = 0;
let isDragging = false;

audio.loop = true;
audio.volume = 0;
audio.muted = true;
audio.play().catch(() => {});

function unlockAudio() {
  audio.muted = false;
  document.removeEventListener("mousedown", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}

document.addEventListener("mousedown", unlockAudio);
document.addEventListener("keydown", unlockAudio);

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

  const frequency = Math.round(
    540 + ((angle + 135) / 270) * (1500 - 540)
  );

  freqDisplay.textContent = frequency + " kHz";

  const target = 840;
  const tolerance = 15; // kHz window
  const distance = Math.abs(frequency - target);

  if (distance <= tolerance) {
    audio.volume = 1 - distance / tolerance;
  } else {
    audio.volume = 0;
  }
});
