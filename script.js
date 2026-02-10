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
@@ -41,16 +44,19 @@ document.addEventListener("mousemove", (e) => {

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
