document.getElementById("on2").addEventListener("click", function () {
  const section = document.querySelector(".one");
  section.classList.remove("dark-bg");
  section.classList.add("light-bg");

  const elementsToShow = document.querySelectorAll(".fade-in:not(#on2)");
  elementsToShow.forEach((el, idx) => {
    el.style.display = "block";
    setTimeout(() => {
      el.classList.add("visible");
    }, idx * 200); // slight delay between each element
  });

  this.style.display = "none"; // fade-out trigger text
});

document.getElementById("off1").addEventListener("click", () => {
  const section = document.querySelector(".two");
  section.classList.remove("light-bg");
  section.classList.add("dark-bg");

  const hiddenText = document.getElementById("dark-content");
  hiddenText.classList.remove("hidden");
  hiddenText.classList.add("visible");
});

document.getElementById("scrollToThree").addEventListener("click", function () {
  document.querySelector(".three").scrollIntoView({ behavior: "smooth" });
});