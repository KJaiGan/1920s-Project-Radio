const dial = document.getElementById("dial");
const freqDisplay = document.getElementById("frequency");
const actualaudio = document.getElementById("broadcast");
const staticaudio = document.getElementById("static");
const volumeKnob = document.getElementById("volume-knob");

let angle = 0;
let isDragging = false;
let isPlaying = false;

let volAngle = -135;
let isAdjustingVolume = false;
let volume = 0;
let powerOn = false;

// Initialize looping
actualaudio.loop = true;
staticaudio.loop = true;
staticaudio.volume = 1;
actualaudio.volume = 1;

dial.addEventListener("mousedown", (e) => {
  e.preventDefault();        // prevent text selection
  isDragging = true;
  dial.style.cursor = "grabbing";
});

// Volume knob drag
volumeKnob.addEventListener("mousedown", (e) => {
  e.preventDefault();        // prevent text selection
  isAdjustingVolume = true;
  volumeKnob.style.cursor = "grabbing";

  if (!powerOn) {
    powerOn = true;
    staticaudio.play().catch(() => {});
  }
});

// Global mouse up — stop all dragging
document.addEventListener("mouseup", () => {
  isDragging = false;
  isAdjustingVolume = false;
  dial.style.cursor = "grab";
  volumeKnob.style.cursor = "grab";

  if (volume <= 0.03) {
    staticaudio.pause();
    actualaudio.pause();
    powerOn = false;
    isPlaying = false;
  }
});

// ----------------------
// Mouse move handler
// ----------------------
document.addEventListener("mousemove", (e) => {

  // ---- Volume knob handling ----
  if (isAdjustingVolume) {
    volAngle += e.movementX * 0.8;
    volAngle = Math.max(-135, Math.min(135, volAngle));
    volumeKnob.style.transform = `rotate(${volAngle}deg)`;

    volume = (volAngle + 135) / 270;

    if (!powerOn) return;

    if (isPlaying) {
      // Broadcast active: scale volume, pause static
      actualaudio.volume = volume;
      staticaudio.pause();
    } else {
      // Broadcast inactive: scale static volume
      staticaudio.volume = volume;
      if (staticaudio.paused) staticaudio.play().catch(() => {});
    }
    return; // skip dial logic while adjusting volume
  }

  // ---- Dial (tuning) handling ----
  if (!isDragging) return;

  angle += e.movementX * 0.6;
  angle = Math.max(-135, Math.min(135, angle));
  dial.style.transform = `rotate(${angle}deg)`;

  const frequency = Math.round(
    540 + ((angle + 135) / 270) * (1500 - 540)
  );
  freqDisplay.textContent = frequency + " kHz";

  if (!powerOn) return;

  const target = 840;
  const tolerance = 15;
  const distance = Math.abs(frequency - target);

  if (distance <= tolerance) {
    // Broadcast frequency reached
    if (!isPlaying) {
      staticaudio.pause();
      actualaudio.play().catch(() => {});
      isPlaying = true;
    }
    staticaudio.volume = 0;
    // Optional: fade in broadcast near center
    actualaudio.volume = volume * (1 - distance / tolerance);

  } else {
    // Outside target frequency
    if (isPlaying) {
      actualaudio.pause();
      isPlaying = false;
    }

    // Only play static if power is on and volume > 0
    if (powerOn && volume > 0) {
      staticaudio.volume = volume;
      if (staticaudio.paused) staticaudio.play().catch(() => {});
    } else {
      staticaudio.pause();
    }
  }
});
