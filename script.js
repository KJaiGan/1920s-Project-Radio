const dial = document.getElementById("dial");
const freqDisplay = document.getElementById("frequency");
const actualaudio = document.getElementById("broadcast");
const staticaudio = document.getElementById("static");

let angle = 0;
let isDragging = false;
let isPlaying = false;


actualaudio.loop = true;
staticaudio.loop = true;
staticaudio.volume = 1;
actualaudio.volume = 1; // we control play/pause instead

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
      staticaudio.pause();
      actualaudio.play().catch(() => {});
      isPlaying = true;
    }

    staticaudio.volume = 0;
    // Optional fade-in near center
    actualaudio.volume = 1 - distance / tolerance;

  } else {
    if (isPlaying) {
      actualaudio.pause();
      staticaudio.volume = 1;
      staticaudio.play().catch(() => {});
      isPlaying = false;
    }
  }
