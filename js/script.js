const coursesContainer = document.querySelector("#courses-container");
const resultsCount = document.querySelector("#results-count");
const levelFilter = document.querySelector("#level-filter");
const subjectFilter = document.querySelector("#subject-filter");
const resetFiltersButton = document.querySelector("#reset-filters");

const selectedCoursesList = document.querySelector("#selected-courses");
const selectionEmpty = document.querySelector("#selection-empty");
const selectionCount = document.querySelector("#selection-count");
const selectionTotal = document.querySelector("#selection-total");
const selectionTitle = document.querySelector("#selection-title");

const selectedCourseIds = new Set();

selectionTitle.tabIndex = -1;

function renderCourses(courseList) {
  coursesContainer.innerHTML = "";

  const count = courseList.length;
  const countText = count === 1
    ? "1 cours affiché"
    : `${count} cours affichés`;

  if (resultsCount.textContent !== countText) {
    resultsCount.textContent = countText;
  }

  if (count === 0) {
    const message = document.createElement("p");
    message.classList.add("empty-state");
    message.textContent = "Aucun cours ne correspond à vos filtres.";
    coursesContainer.appendChild(message);
    return;
  }

  courseList.forEach(function (course) {
    const isFull = course.places === 0;
    const isSelected = selectedCourseIds.has(course.id);
    const card = document.createElement("article");

    card.classList.add("course-card");

    if (isFull) {
      card.classList.add("is-full");
    }

    if (isSelected) {
      card.classList.add("is-selected");
    }

    let buttonLabel = "Ajouter";

    if (isFull) {
      buttonLabel = "Complet";
    } else if (isSelected) {
      buttonLabel = "Retirer";
    }

    card.innerHTML = `
      <span class="course-level">${course.level}</span>
      <h3>${course.title}</h3>
      <p class="course-subject">Matière : ${course.subject}</p>
      <p>${course.center}</p>
      <p>${course.schedule}</p>
      <p class="course-places">
        ${isFull ? "Complet" : `${course.places} places restantes`}
      </p>
      <p class="course-price">
        ${course.price} MAD <span>/ mois</span>
      </p>
      <button
        type="button"
        class="course-button"
        data-course-id="${course.id}"
        aria-label="${buttonLabel} : ${course.title}, ${course.level}"
        ${isFull ? "disabled" : ""}
      >
        ${buttonLabel}
      </button>
    `;

    coursesContainer.appendChild(card);
  });
}

function filterCourses() {
  const selectedLevel = levelFilter.value;
  const selectedSubject = subjectFilter.value;

  const filteredCourses = courses.filter(function (course) {
    const matchesLevel =
      selectedLevel === "" || course.level === selectedLevel;

    const matchesSubject =
      selectedSubject === "" || course.subject === selectedSubject;

    return matchesLevel && matchesSubject;
  });

  renderCourses(filteredCourses);
}

function renderSelection() {
  selectedCoursesList.innerHTML = "";

  const selectedCourses = courses.filter(function (course) {
    return selectedCourseIds.has(course.id);
  });

  const count = selectedCourses.length;

  selectionEmpty.hidden = count > 0;

  selectionCount.textContent = count === 1
    ? "1 cours sélectionné"
    : `${count} cours sélectionnés`;

  let total = 0;

  selectedCourses.forEach(function (course) {
    total += course.price;

    const item = document.createElement("li");
    item.classList.add("selected-course");

    item.innerHTML = `
      <div class="selected-course-info">
        <h3>${course.title}</h3>
        <p>${course.level} · ${course.center}</p>
        <p class="selected-course-price">${course.price} MAD / mois</p>
      </div>
      <button
        type="button"
        class="remove-course"
        data-course-id="${course.id}"
        aria-label="Retirer ${course.title}, ${course.level} de ma sélection"
      >
        Retirer
      </button>
    `;

    selectedCoursesList.appendChild(item);
  });

  selectionTotal.textContent = `${total} MAD`;
}

function updateSelection() {
  renderSelection();
  filterCourses();
}

coursesContainer.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-course-id]");

  if (!button || !coursesContainer.contains(button) || button.disabled) {
    return;
  }

  const courseId = Number(button.dataset.courseId);

  const course = courses.find(function (item) {
    return item.id === courseId;
  });

  if (!course || course.places === 0) {
    return;
  }

  if (selectedCourseIds.has(courseId)) {
    selectedCourseIds.delete(courseId);
  } else {
    selectedCourseIds.add(courseId);
  }

  updateSelection();

  const updatedButton = coursesContainer.querySelector(
    `button[data-course-id="${courseId}"]`
  );

  if (updatedButton) {
    updatedButton.focus();
  }
});

selectedCoursesList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-course-id]");

  if (!button || !selectedCoursesList.contains(button)) {
    return;
  }

  const courseId = Number(button.dataset.courseId);

  selectedCourseIds.delete(courseId);
  updateSelection();

  const nextButton = selectedCoursesList.querySelector("button");

  if (nextButton) {
    nextButton.focus();
  } else {
    selectionTitle.focus();
  }
});

levelFilter.addEventListener("change", filterCourses);
subjectFilter.addEventListener("change", filterCourses);

resetFiltersButton.addEventListener("click", function () {
  levelFilter.value = "";
  subjectFilter.value = "";
  filterCourses();
});

updateSelection();