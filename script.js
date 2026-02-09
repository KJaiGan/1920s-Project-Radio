const dial = document.getElementById("dial");
const freq = document.getElementById("frequency");
const audio = document.getElementById("broadcast");
const btn = document.getElementById("playBtn");

dial.addEventListener("input", () => {
  freq.textContent = dial.value + " kHz";

  if (dial.value == 840) {
    audio.volume = 1;
  } else {
    audio.volume = 0.05; // static / weak signal effect
  }
});

btn.addEventListener("click", () => {
  audio.play();
});
