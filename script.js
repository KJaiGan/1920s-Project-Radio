const dial = document.getElementById("dial");
const freqDisplay = document.getElementById("frequency");
const audio = document.getElementById("broadcast");

let angle = 0;
let isDragging = false;
let isPlaying = false;

audio.loop = true;
audio.volume = 1; // we control play/pause instead

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

  // Map angle → frequency
  const frequency = Math.round(
    540 + ((angle + 135) / 270) * (1500 - 540)
  );

  freqDisplay.textContent = frequency + " kHz";

  // Tuning logic
  const target = 840;
  const tolerance = 15;
  const distance = Math.abs(frequency - target);

  if (distance <= tolerance) {
    if (!isPlaying) {
      audio.play().catch(() => {});
      isPlaying = true;
    }

    // Optional fade-in near center
    audio.volume = 1 - distance / tolerance;

  } else {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    }
  }
});
