const coursesContainer = document.querySelector("#courses-container");
const resultsCount = document.querySelector("#results-count");

function renderCourses(courseList) {

    coursesContainer.innerHTML = "";

  resultsCount.textContent = `${courseList.length} cours affichés`;

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

renderCourses(courses);