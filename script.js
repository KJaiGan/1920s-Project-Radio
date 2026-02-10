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

actualaudio.loop = true;
staticaudio.loop = true;
staticaudio.volume = 1;
actualaudio.volume = 1;

dial.addEventListener("mousedown", () => {
  isDragging = true;
  dial.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  isAdjustingVolume = false; 
  dial.style.cursor = "grab";
  volumeKnob.style.cursor = "grab";
});

document.addEventListener("mousemove", (e) => {
  if (isAdjustingVolume) {
    volAngle += e.movementX * 0.8;
    volAngle = Math.max(-135, Math.min(135, volAngle));
    volumeKnob.style.transform = `rotate(${volAngle}deg)`;

    volume = (volAngle + 135) / 270;
    powerOn = volume > 0.03;

    if (!powerOn) {
      actualaudio.pause();
      staticaudio.pause();
      isPlaying = false;
    }
    return;
  }
  
  
  if (!isDragging) return;

  angle += e.movementX * 0.6;
  angle = Math.max(-135, Math.min(135, angle));
  dial.style.transform = `rotate(${angle}deg)`;

  const frequency = Math.round(
    540 + ((angle + 135) / 270) * (1500 - 540)
  );

  freqDisplay.textContent = frequency + " kHz";

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
    actualaudio.volume = 1 - distance / tolerance;

  } else {
    if (isPlaying) {
      actualaudio.pause();
      staticaudio.volume = 1;
      staticaudio.play().catch(() => {});
      isPlaying = false;
    }
  }
});

volumeKnob.addEventListener("mousedown", () => {
  isAdjustingVolume = true;
  volumeKnob.style.cursor = "grabbing";
});
