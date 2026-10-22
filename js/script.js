const coursesContainer = document.querySelector("#courses-container");
const resultsCount = document.querySelector("#results-count");

const levelFilter = document.querySelector("#level-filter");
const subjectFilter = document.querySelector("#subject-filter");
const resetFiltersButton = document.querySelector("#reset-filters");

function renderCourses(courseList) {
  coursesContainer.innerHTML = "";

  const count = courseList.length;

  resultsCount.textContent =
    count === 1 ? "1 cours affiché" : `${count} cours affichés`;

  if (count === 0) {
    const message = document.createElement("p");

    message.classList.add("empty-state");
    message.textContent = "Aucun cours ne correspond à vos filtres.";

    coursesContainer.appendChild(message);
    return;
  }

  courseList.forEach(function (course) {
    const isFull = course.places === 0;

    const card = document.createElement("article");
    card.classList.add("course-card");

    if (isFull) {
      card.classList.add("is-full");
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
        aria-label="${isFull ? "Complet" : "Ajouter"} : ${course.title}, ${course.level}"
        ${isFull ? "disabled" : ""}
      >
        ${isFull ? "Complet" : "Ajouter"}
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

levelFilter.addEventListener("change", filterCourses);
subjectFilter.addEventListener("change", filterCourses);

resetFiltersButton.addEventListener("click", function () {
  levelFilter.value = "";
  subjectFilter.value = "";

  filterCourses();
});

filterCourses();