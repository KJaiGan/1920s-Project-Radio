const dial = document.getElementById("dial");
const freqDisplay = document.getElementById("frequency");
const actualaudio = document.getElementById("broadcast");
const staticaudio = document.getElementById("static");
const volumeKnob = document.getElementById("volume-knob");

// Tuning and volume state
let angle = 0;
let isDraggingDial = false;
let volAngle = -135;
let isAdjustingVolume = false;
let volume = 0;
let powerOn = false;
let isPlaying = false;

// Audio setup
actualaudio.loop = true;
staticaudio.loop = true;
staticaudio.volume = 1;
actualaudio.volume = 1;

// -----------------------
// Volume knob handling
// -----------------------
volumeKnob.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isAdjustingVolume = true;
  volumeKnob.style.cursor = "grabbing";

  // Power on if turning knob
  if (!powerOn) {
    powerOn = true;
    staticaudio.play().catch(() => {});
  }
});

document.addEventListener("mouseup", () => {
  // Stop dragging knobs/dials
  isDraggingDial = false;
  isAdjustingVolume = false;
  dial.style.cursor = "grab";
  volumeKnob.style.cursor = "grab";

  // Turn off if volume is very low
  if (volume <= 0.03) {
    powerOn = false;
    isPlaying = false;
    actualaudio.pause();
    staticaudio.pause();
  }
});

document.addEventListener("mousemove", (e) => {

  // ---- Volume knob logic ----
  if (isAdjustingVolume) {
    volAngle += e.movementX * 0.8;
    volAngle = Math.max(-135, Math.min(135, volAngle));
    volumeKnob.style.transform = `rotate(${volAngle}deg)`;

    volume = (volAngle + 135) / 270;

    if (!powerOn) return;

    if (isPlaying) {
      actualaudio.volume = volume;
      staticaudio.pause();
    } else {
      staticaudio.volume = volume;
      if (staticaudio.paused && volume > 0) staticaudio.play().catch(() => {});
    }
    return; // skip dial logic while adjusting volume
  }

  // ---- Dial logic ----
  if (!isDraggingDial) return;

  angle += e.movementX * 0.6;
  angle = Math.max(-135, Math.min(135, angle));
  dial.style.transform = `rotate(${angle}deg)`;

  const frequency = Math.round(540 + ((angle + 135) / 270) * (1500 - 540));
  freqDisplay.textContent = frequency + " kHz";

  if (!powerOn) return;

  const target = 840;
  const tolerance = 15;
  const distance = Math.abs(frequency - target);

  if (distance <= tolerance) {
    // Broadcast is in tune
    if (!isPlaying) {
      staticaudio.pause();
      actualaudio.play().catch(() => {});
      isPlaying = true;
    }
    staticaudio.volume = 0;
    actualaudio.volume = volume * (1 - distance / tolerance);
  } else {
    // Outside broadcast frequency
    if (isPlaying) {
      actualaudio.pause();
      isPlaying = false;
    }

    if (powerOn && volume > 0) {
      staticaudio.volume = volume;
      if (staticaudio.paused) staticaudio.play().catch(() => {});
    } else {
      staticaudio.pause();
    }
  }
});

// -----------------------
// Dial mousedown
// -----------------------
dial.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDraggingDial = true;
  dial.style.cursor = "grabbing";

  // Start static if power is on and nothing playing
  if (powerOn && !isPlaying && staticaudio.paused) {
    staticaudio.play().catch(() => {});
  }
});
