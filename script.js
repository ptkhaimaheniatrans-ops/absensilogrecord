/* ================= CONFIG ================= */
const API_URL = "https://script.google.com/macros/s/AKfycbwXupewVVvX4kMiu8bSJM5k9DdTObRRbcUNu-NNC6FaLaagCxaZo4bbm30nY6ODUS8T/exec";

const form = document.getElementById("absensiForm");
const popup = document.getElementById("popup");
const todayBtn = document.getElementById("todayLog");
const todayModal = document.getElementById("todayModal");
const todayList = document.getElementById("todayList");

/* ================= POPUP UTILITY ================= */
function showPopup(message, type) {
  popup.innerText = message;
  popup.classList.remove("show-success", "show-error");

  if (type === "success") {
    popup.classList.add("show-success");
    document.getElementById("successSound").play();
  } else if (type === "error") {
    popup.classList.add("show-error");
    document.getElementById("errorSound").play();
  }

  popup.style.display = "block";

  // Auto hide setelah animasi
  setTimeout(() => {
    popup.style.display = "none";
    popup.classList.remove("show-success", "show-error");
  }, 2500);
}

/* ================= FORM SUBMIT ================= */
form.addEventListener("submit", async e => {
  e.preventDefault();
  document.getElementById("clickSound").play();

  // Ambil data dari form
  const data = {
    driver: form[0].value.trim(),
    date: form[1].value.trim(),
    unit: form[2].value.trim(),
    job: document.querySelector('input[name="job"]:checked').value,
    po: form[4].value.trim(),
    user: form[5].value.trim(),
    destination: form[6].value.trim(),
    duration: form[7].value.trim(),
    notes: form[8].value.trim()
  };

  // Validasi semua field
  for (let key in data) {
    if (!data[key]) {
      showPopup("Input Failed! Please Fill All Fields 🚫", "error");
      return; // hentikan submit jika ada field kosong
    }
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.status === "success") {
      showPopup("All set! Your data is saved. ✔️", "success");
      form.reset(); // reset form tetap di sini
    } else {
      throw new Error("Submit failed");
    }

  } catch {
    showPopup("Input Failed! Please Try Again 🚫", "error");
  }
});

/* ================= TODAY LOG ================= */
todayBtn.addEventListener("click", async () => {
  todayModal.style.display = "block";

  // Tampilkan shimmer saat load data
  todayList.innerHTML = `
    <li class="shimmer" style="height:40px"></li>
    <li class="shimmer" style="height:40px"></li>
    <li class="shimmer" style="height:40px"></li>
  `;

  try {
    const res = await fetch(`${API_URL}?action=today`);
    const data = await res.json();

    todayList.innerHTML = ""; // hilangkan shimmer

    if (!data || data.length === 0) {
      todayList.innerHTML = "<li>No log today</li>";
      return;
    }

    // Render list
    data.forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.driver} • ${d.unit} • ${d.destination}`;
      todayList.appendChild(li);
    });

  } catch {
    todayList.innerHTML = "<li>Failed load data</li>";
  }
});

/* ================= CLOSE TODAY MODAL ================= */
function closeToday() {
  todayModal.style.display = "none";
}
