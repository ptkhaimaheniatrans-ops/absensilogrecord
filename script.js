const API_URL = "https://script.google.com/macros/s/AKfycbwO22zG6agVIwHREN7MHNCD9GIs35NVMXVT78EuAxBGKAVkk2cn09zDUe4-oQJWzq7FkA/exec";

const clickSound = new Audio("assets/sounds/clicktone.mp3");
const successSound = new Audio("assets/sounds/successtone.mp3");
const errorSound = new Audio("assets/sounds/errortone.mp3");

let job = "Office";

document.querySelectorAll(".toggle button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".toggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    job = btn.dataset.job;
  };
});

document.getElementById("absensiForm").onsubmit = async e => {
  e.preventDefault();
  clickSound.play();

  const data = {
    name: name.value,
    date: date.value,
    unit: unit.value,
    job,
    po: po.value,
    user: user.value,
    destination: destination.value,
    duration: duration.value,
    notes: notes.value
  };

  if (Object.values(data).some(v => !v)) {
    showPopup("Input Failed! Please Try Again 🚫", false);
    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  if (res.ok) showPopup("All set! Your data is saved. ✔️", true);
};

function showPopup(msg, success) {
  const pop = document.getElementById("popup");
  pop.innerText = msg;
  pop.style.display = "block";
  pop.style.background = success ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)";
  (success ? successSound : errorSound).play();
  setTimeout(() => pop.style.display = "none", 2000);
}
