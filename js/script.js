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

const registrationForm = document.querySelector("#registration-form");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");

const registrationFields = Array.from(
  registrationForm.querySelectorAll("input, select")
);

const touchedFields = new Set();

const nameRegex = /^\p{L}[\p{L}\p{M} '’-]*$/u;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^(?:0[67]\d{8}|\+212[67]\d{8})$/;
const passwordRegex =
  /^(?=.*\p{Lu})(?=.*\p{Nd})(?=.*[^\p{L}\p{M}\p{N}\s]).{8,128}$/u;

const requiredMessages = {
  "parent-name": "Renseignez le nom complet du parent.",
  "parent-email": "Renseignez une adresse e-mail.",
  "parent-phone": "Renseignez un numéro de téléphone.",
  "student-name": "Renseignez le prénom de l’élève.",
  "student-level": "Choisissez un niveau scolaire.",
  "password": "Choisissez un mot de passe.",
  "confirm-password": "Confirmez le mot de passe."
};

const successMessages = {
  "parent-name": "Nom valide.",
  "parent-email": "Format de l’adresse e-mail valide.",
  "parent-phone": "Format du téléphone valide.",
  "student-name": "Prénom valide.",
  "student-level": "Niveau sélectionné.",
  "password": "Mot de passe conforme.",
  "confirm-password": "Les mots de passe correspondent.",
  "consent": "Consentement donné."
};

function getFieldError(field) {
  if (field.id === "consent") {
    return field.checked
      ? ""
      : "Votre accord est nécessaire pour cette inscription.";
  }

  const value = field.type === "password"
    ? field.value
    : field.value.trim();

  if (value.trim() === "") {
    return requiredMessages[field.id];
  }

  switch (field.id) {
    case "parent-name":
    case "student-name":
      if (
        value.length < 2 ||
        value.length > 80 ||
        !nameRegex.test(value)
      ) {
        return "Utilisez de 2 à 80 caractères : lettres, espaces, apostrophes ou tirets.";
      }
      break;

    case "parent-email": {
      const localPart = value.split("@")[0];

      if (
        !emailRegex.test(value) ||
        value.includes("..") ||
        localPart.startsWith(".") ||
        localPart.endsWith(".")
      ) {
        return "Entrez une adresse e-mail valide, comme parent@example.com.";
      }
      break;
    }

    case "parent-phone":
      if (!phoneRegex.test(value.replace(/\s+/g, ""))) {
        return "Utilisez 06 ou 07 suivi de 8 chiffres, ou +2126 ou +2127 suivi de 8 chiffres.";
      }
      break;

    case "student-level":
      if (!["Primaire", "Collège", "1re Bac", "2e Bac"].includes(value)) {
        return "Choisissez un niveau proposé dans la liste.";
      }
      break;

    case "password":
      if (!passwordRegex.test(value)) {
        return "Utilisez de 8 à 128 caractères, avec une majuscule, un chiffre et un caractère spécial.";
      }
      break;

    case "confirm-password":
      if (!passwordRegex.test(passwordInput.value)) {
        return "Choisissez d’abord un mot de passe conforme.";
      }

      if (value !== passwordInput.value) {
        return "Les deux mots de passe doivent être identiques.";
      }
      break;
  }

  return "";
}

function validateField(field) {
  touchedFields.add(field.id);

  const error = getFieldError(field);
  const isValid = error === "";
  const status = document.getElementById(`${field.id}-status`);

  field.classList.toggle("is-valid", isValid);
  field.classList.toggle("is-invalid", !isValid);
  field.setAttribute("aria-invalid", String(!isValid));

  status.classList.toggle("is-success", isValid);
  status.classList.toggle("is-error", !isValid);

  const message = isValid ? successMessages[field.id] : error;

  if (status.textContent !== message) {
    status.textContent = message;
  }

  return isValid;
}

function handleFieldValidation(event) {
  const field = event.target;

  if (!registrationFields.includes(field)) {
    return;
  }

  validateField(field);

  if (
    field === passwordInput &&
    (
      touchedFields.has("confirm-password") ||
      confirmPasswordInput.value !== ""
    )
  ) {
    validateField(confirmPasswordInput);
  }
}

function resetFormValidation() {
  touchedFields.clear();

  registrationFields.forEach(function (field) {
    field.classList.remove("is-valid", "is-invalid");
    field.removeAttribute("aria-invalid");

    const status = document.getElementById(`${field.id}-status`);

    status.textContent = "";
    status.classList.remove("is-success", "is-error");
  });
}

registrationForm.addEventListener("input", handleFieldValidation);
registrationForm.addEventListener("change", handleFieldValidation);
registrationForm.addEventListener("focusout", handleFieldValidation);
registrationForm.addEventListener("reset", resetFormValidation);