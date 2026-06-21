const cards = document.querySelectorAll(".module-card, .stat-card");

cards.forEach((card, index) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(14px)";

  setTimeout(() => {
    card.style.transition = "0.45s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }, 80 * index);
});

console.log("BeeGod Connect Dashboard iniciado.");