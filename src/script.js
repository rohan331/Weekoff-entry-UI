const gridContainer = document.getElementById("calendarGrid");
const toggle = document.getElementById("halfDayToggle");

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekLabels = ["All", "1st", "2nd", "3rd", "4th", "5th"];

document.getElementById("workDate").addEventListener("change", (e) => {
  const selected = new Date(e.target.value); // "YYYY-MM-DD"
  const day = selected.getDay(); // 0–6 (Sun–Sat)
  const date = selected.getDate(); // 1–31
  const month = selected.getMonth() + 1; // 1–12
  const year = selected.getFullYear();

  console.log({ day, date, month, year });
});


function toggleDropdown(checkbox) {
  const container = checkbox.parentElement;
  const dropdown = container.querySelector(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("hidden", !checkbox.checked);
  }
}

function setupAllCheckboxLogic() {
  const checkboxes = document.querySelectorAll("input[type='checkbox'][data-day][data-week]");

  checkboxes.forEach(checkbox => {
    const day = checkbox.dataset.day;
    const week = checkbox.dataset.week;

    if (week === "0") {
      checkbox.addEventListener("change", () => {
        const isChecked = checkbox.checked;
        const rowCheckboxes = document.querySelectorAll(`input[data-day="${day}"]:not([data-week="0"])`);
        rowCheckboxes.forEach(cb => {
          cb.checked = isChecked;
          toggleDropdown(cb);
        });
      });
    } else {
      checkbox.addEventListener("change", () => {
        const rowCheckboxes = document.querySelectorAll(`input[data-day="${day}"]:not([data-week="0"])`);
        const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
        const allCheckbox = document.querySelector(`input[data-day="${day}"][data-week="0"]`);
        allCheckbox.checked = allChecked;
        toggleDropdown(checkbox);
      });
    }
  });
}

function renderCheckboxGrid() {
  let html = `<div class="grid grid-cols-7 text-sm text-gray-800">`;
  html += `<div class="bg-gray-100 font-semibold border p-2 text-center"></div>`;
  weekLabels.forEach(label => {
    html += `<div class="bg-gray-100 font-semibold border p-2 text-center">${label}</div>`;
  });
  html += `</div>`;

  weekdays.forEach((day, dayIndex) => {
    html += `<div class="grid grid-cols-7 text-sm text-gray-800 border-t">`;
    html += `<div class="bg-gray-50 font-medium border p-2 text-center">${day}</div>`;
    weekLabels.forEach((_, weekIndex) => {
      html += `
        <div class="border p-2 flex justify-center items-center">
          <input type="checkbox"
            class="form-checkbox w-5 h-5 text-blue-600 transition"
            data-day="${dayIndex}"
            data-week="${weekIndex}">
        </div>
      `;
    });
    html += `</div>`;
  });

  gridContainer.innerHTML = html;
  setupAllCheckboxLogic();
}

function renderDropdownGrid() {
  let html = `<div class="grid grid-cols-7 text-sm text-gray-800">`;
  html += `<div class="bg-gray-100 font-semibold border p-2 text-center"></div>`;
  weekLabels.forEach(label => {
    html += `<div class="bg-gray-100 font-semibold border p-2 text-center">${label}</div>`;
  });
  html += `</div>`;

  weekdays.forEach((day, dayIndex) => {
    html += `<div class="grid grid-cols-7 text-sm text-gray-800 border-t">`;
    html += `<div class="bg-gray-50 font-medium border p-2 text-center">${day}</div>`;
    weekLabels.forEach((_, weekIndex) => {
      html += `
        <div class="border p-2 flex flex-col items-center">
          <input type="checkbox"
            class="form-checkbox w-5 h-5 text-blue-600 mb-1 transition"
            data-day="${dayIndex}"
            data-week="${weekIndex}"
            onchange="toggleDropdown(this)">
          <select class="dropdown hidden mt-1 px-2 py-1 text-sm rounded-md border border-gray-300 shadow-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500">
            <option value="full">Full Day</option>
            <option value="first">1st Half</option>
            <option value="second">2nd Half</option>
          </select>
        </div>
      `;
    });
    html += `</div>`;
  });

  gridContainer.innerHTML = html;
  setupAllCheckboxLogic();
}

// Initial render
toggle.checked ? renderDropdownGrid() : renderCheckboxGrid();

toggle.addEventListener("change", () => {
  toggle.checked ? renderDropdownGrid() : renderCheckboxGrid();
});

// Reset logic on Cancel
const cancelBtn = document.getElementById("cancelBtn");
const dateInput = document.getElementById("workDate");

cancelBtn.addEventListener("click", () => {
  // Reset date picker
  if (dateInput) {
    dateInput.value = "";
  }

  // Reset calendar layout based on current toggle state
  toggle.checked ? renderDropdownGrid() : renderCheckboxGrid();
});

