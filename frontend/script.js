window.onload = () => {
  document.getElementById("sendBtn").onclick = sendHowler;
};

function sendHowler() {
  const text = document.getElementById("howlerText").value.trim();
  const box = document.getElementById("howlerBox");
  const openSound = document.getElementById("howlerOpen");
  const closeSound1 = document.getElementById("howlerClose1");
  const closeSound2 = document.getElementById("howlerClose2");
  const gif = document.getElementById("howlerGif");
  const png = document.getElementById("howlerImage");

  if (!text) return alert("Write a message first!");

  // Reset everything
  gif.classList.add("hidden");
  png.classList.remove("hidden");
  box.classList.remove("hidden");

  // Play the howler opening sound
  openSound.currentTime = 0;
  openSound.play();

  openSound.onended = async () => {
    try {
      const response = await fetch('http://localhost:3001/howler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) throw new Error("TTS request failed.");

      const blob = await response.blob();
      const audioURL = URL.createObjectURL(blob);
      const voice = new Audio(audioURL);
      voice.play();

      voice.onended = () => {
        // Hide PNG when speaking ends
        png.classList.add("hidden");

        // Show GIF after speech
        gif.classList.remove("hidden");

        // Play closing sounds
        closeSound1.currentTime = 0;
        closeSound2.currentTime = 0;
        closeSound1.play();
        closeSound2.play();

        // Clean up after 2.5 seconds
        setTimeout(() => {
          gif.classList.add("hidden");
          box.classList.add("hidden");
          png.classList.remove("hidden"); // reset for next time
        }, 2500);
      };
    } catch (err) {
      alert("Failed to send Howler: " + err.message);
      console.error(err);
    }
  };
}
