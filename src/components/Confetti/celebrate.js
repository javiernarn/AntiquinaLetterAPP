import confetti from "canvas-confetti";

/** A warm, wine-and-gold confetti burst — fired the moment she says yes. */
export function celebrate() {
  const colors = ["#7a2331", "#c9a227", "#d98a94", "#f6eedd"];
  const duration = 2200;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 38,
    origin: { y: 0.6 },
    colors,
  });
}
