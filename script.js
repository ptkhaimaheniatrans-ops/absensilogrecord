const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw6zx0pmuSOQAehTtQgQq8QH3kJ8yEbCn-hxCbuEqvQGdEwg_DhB9o4rKNvFPITQb7ehQ/exec";
let jobType = "";

/* AUDIO */
const click = new Audio("assets/sounds/clicktone.mp3");
const success = new Audio("assets/sounds/successtone.mp3");
const error = new Audio("assets/sounds/errortone.mp3");

/* LOADING */
setTimeout(() => {
  document.getElementById("loading").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
  typeText("wait a sec 🚬");
}, 3000);

function typeText(text) {
  let i = 0;
  const el = document.getElementById("typewriter");
  el.textContent = "";
  const timer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(timer);
  }, 100);
}

/* CLICK SOUND */
function playClick() {
  click.currentTime = 0;
  click.play();
}

/* TAB SWITCH */
function openTab(tab) {
  playClick();
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  document.getElementById(tab).classList.add("active");

  if (tab === "log") loadTodayLog();
}

/* JOB TOGGLE */
function setJob(j) {
  playClick();
  jobType = j;

  document.querySelectorAll(".toggle button").forEach(btn => {
    btn.style.background = "rgba(255,255,255,0.6)";
  });

  event.target.style.background = "white";
}

/* POPUP CENTER */
function popup(msg, ok = true) {
  const p = document.getElementById("popup");
  p.textContent = msg;
  p.style.display = "flex";

  ok ? success.play() : error.play();

  setTimeout(() => {
    p.style.display = "none";
  }, 1600);
}

/* SUBMIT DATA */
function submitData() {
  playClick();

  const data = {
    driver: driver.value,
    date: date.value,
    unit: unit.value,
    job: jobType,
    po: poInput.value,
    user: user.value,
    destination: destinationInput.value,
    duration: durationInput.value,
    notes: notes.value
  };

  if (Object.values(data).some(v => !v)) {
    popup("Please Try Again!❌", false);
    return;
  }

  fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      popup("Success!✅", true);

      /* RESET FORM */
      document.querySelectorAll("input, textarea").forEach(el => el.value = "");
      jobType = "";

      openTab("log");
    })

    .catch(() => {
      popup("Please Try Again!❌", false);
    });
}

/* LOAD TODAY LOG */
function loadTodayLog() {
  fetch(WEB_APP_URL)
    .then(res => res.json())
    .then(data => {
      const body = document.getElementById("logBody");
      body.innerHTML = "";

      if (!data || data.length === 0) {
        body.innerHTML = `<tr><td colspan="4">No Entry Today</td></tr>`;
        return;
      }

      data.forEach(r => {
        body.innerHTML += `
          <tr>
            <td>${r.driver}</td>
            <td>${r.date}</td>
            <td>${r.unit}</td>
            <td>${r.entry}</td>
          </tr>
        `;
      });
    });
}

function typeWriterEffect(text, speed = 120) {
  const el = document.getElementById("typewriter");
  el.textContent = "";
  let i = 0;

  const timer = setInterval(() => {
    el.textContent += text.charAt(i);
    i++;
    if (i === text.length) clearInterval(timer);
  }, speed);
}

window.addEventListener("load", () => {
  typeWriterEffect("wait a sec 🚬");

  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
  }, 3000);
});

