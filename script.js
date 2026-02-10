const dial = document.getElementById("dial");
const freqDisplay = document.getElementById("frequency");
const actualaudio = document.getElementById("broadcast");
const staticaudio = document.getElementById("static");
const volumeKnob = document.getElementById("volume-knob");

let angle = 0;
let volAngle = -135;
let isDraggingDial = false;
let isDraggingVol = false;
let volume = 0;
let isPlaying = false;

// setup audio
actualaudio.loop = true;
staticaudio.loop = true;
actualaudio.volume = 1;
staticaudio.volume = 1;

// -------------------------
// Dial Events
// -------------------------
dial.addEventListener("mousedown", (e) => { e.preventDefault(); isDraggingDial = true; dial.style.cursor = "grabbing"; });
document.addEventListener("mouseup", () => { isDraggingDial = false; isDraggingVol = false; dial.style.cursor = "grab"; volumeKnob.style.cursor = "grab"; });
document.addEventListener("mousemove", (e) => {
  // Volume first
  if (isDraggingVol) {
    volAngle += e.movementX * 0.8;
    volAngle = Math.max(-135, Math.min(135, volAngle));
    volumeKnob.style.transform = `rotate(${volAngle}deg)`;
    volume = (volAngle + 135) / 270;
    // scale current playing audio
    if (isPlaying) actualaudio.volume = volume; else staticaudio.volume = volume;
    return;
  }

  // Dial logic
  if (!isDraggingDial) return;

  angle += e.movementX * 0.6;
  angle = Math.max(-135, Math.min(135, angle));
  dial.style.transform = `rotate(${angle}deg)`;

  const frequency = Math.round(540 + ((angle + 135) / 270) * (1500 - 540));
  freqDisplay.textContent = frequency + " kHz";

  const target = 840;
  const tolerance = 15;
  const distance = Math.abs(frequency - target);

  if (distance <= tolerance && volume > 0) {
    if (!isPlaying) { staticaudio.pause(); actualaudio.play().catch(()=>{}); isPlaying = true; }
    actualaudio.volume = volume * (1 - distance / tolerance);
    staticaudio.volume = 0;
  } else {
    if (isPlaying) { actualaudio.pause(); isPlaying = false; }
    if (volume > 0 && !staticaudio.playing) staticaudio.play().catch(()=>{});
    staticaudio.volume = volume;
  }
});

// -------------------------
// Volume knob events
// -------------------------
volumeKnob.addEventListener("mousedown", (e) => { e.preventDefault(); isDraggingVol = true; volumeKnob.style.cursor = "grabbing"; });
