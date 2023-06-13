
// поля ввода методов фильтрации
const filterFio = document.getElementById("inputFIO");
const filterFaculty = document.getElementById("inputFaculty");
const filterDateStart = document.getElementById("inputDateStart");
const filterDateEnd = document.getElementById("inputDateEnd");

// кнопки
const deleteBtn = document.getElementById("filter-btn");
const addStudentBtn = document.getElementById("add-btn");
let addBtnIsActive = true;

const changeBtn = document.getElementById("change-btn");
const changeStudent = document.getElementById("change-student");
let studentId;
// Таблица
const table = document.getElementById("table__body");

// заголовки таблицы
const tableFIO = document.getElementById("table-fio");
const tableFaculty = document.getElementById("table-faculty");
const tableBirthDate = document.getElementById("table-birthDate");
const tableStartDate = document.getElementById("table-startDate");

// поля ввода нового студента
const inputName = document.getElementById("student__name");
const inputSurname = document.getElementById("student__surname");
const inputLastname = document.getElementById("student__lastname");
const inputBirthDate = document.getElementById("student__birthdate");
const inputStartDate = document.getElementById("student__startEducation");
const inputFaculty = document.getElementById("student__faculty");

const validationError = document.getElementById("add__btn--wrapper");
const deleteError = document.getElementById("deleteError");

// валидация формы добавления нового студента
let isValid = false;

const minBirthDate = new Date(1990, 0, 1);
const minStartDate = 2000;

let allStudents = [];

// проверяем сервер на наличие данных
async function loadStudents() {
  const response = await fetch("http://localhost:3000/api/students");
  const data = await response.json();

  if (data && data.length > 0) {
    console.log("server checked");
    //если сервер дал ответ и массив не пустой - обьединяем массивы
    allStudents = [...data];
    createTable(allStudents);
    console.log(allStudents);
  } else {

    // если сервер пуст - проверяем local storage
    checkLocalStorage();
    console.log('students loaded from local storage')
  }
}
loadStudents(allStudents);

function isFormValid() {
  if (Date.parse(inputBirthDate.value) < Date.parse(minBirthDate)) {
    validationError.textContent =
      "Дата рождения должна быть после 1 января 1990г.";
    return false;
  }

  if (+inputStartDate.value < minStartDate) {
    validationError.textContent = "Год начала обучения выбран не верно!";
    return false;
  }

  return true;
}

const validator = new JustValidate("#add__form");

validator
  .addField("#student__name", [
    {
      rule: "required",
      errorMessage: "Введите имя",
    },
  ])
  .addField("#student__surname", [
    {
      rule: "required",
      errorMessage: "Введите фамилию",
    },
  ])
  .addField("#student__lastname", [
    {
      rule: "required",
      errorMessage: "Введите отчество",
    },
  ])
  .addField("#student__birthdate", [
    {
      rule: "required",
      errorMessage: "Ведите дату рождения",
    },
  ])
  .addField("#student__startEducation", [
    {
      rule: "required",
      errorMessage: "Введите год начала обучения",
    },
    {
      rule: "minLength",
      value: 4,
      errorMessage: "год указан не корректно",
    },
    {
      rule: "maxLength",
      value: 4,
      errorMessage: "год указан не корректно",
    },
    {
      rule: "minNumber",
      value: 2000,
      errorMessage: "год начала обучения должен быть после 2000",
    },
  ])
  .addField("#student__faculty", [
    {
      rule: "required",
      errorMessage: "Введите факультет",
    },
  ])
  .onSuccess(async (event) => {
    //добавление нового студента
    event.preventDefault();

    if (!isFormValid()) return;
    if (!addBtnIsActive) return;
    await createStudent();
    loadStudents()


    validationError.textContent = "";
    deleteError.textContent = "";
    document.querySelector("#add__form").reset();
  });

//добаление нового студента на сервер
async function createStudent() {
  const response = await fetch("http://localhost:3000/api/students", {
    method: "POST",
    body: JSON.stringify({
      name: inputName.value.trim(),
      surname: inputSurname.value.trim(),
      lastname: inputLastname.value.trim(),
      birthday: inputBirthDate.value.trim(),
      studyStart: inputStartDate.value.trim(),
      faculty: inputFaculty.value.trim(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  localStorage.setItem("students-list", JSON.stringify(allStudents));
}

//проверка localStorage
function checkLocalStorage() {
  const studentsFromLS = localStorage.getItem("students-list");

  if (studentsFromLS) {
    createTable(JSON.parse(studentsFromLS));
  } else {
    createTable(allStudents);
  }
}




//отрисовка таблицы
function createTable(arr) {
  table.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    let fio = arr[i].surname + " " + arr[i].name + " " + arr[i].lastname;
    let faculty = arr[i].faculty;
    let studentAgeCount = studentAge(arr[i].birthday);
    let start = education(arr[i].studyStart);

    const row = document.createElement("tr");

    row.addEventListener("click", function () {
      deleteBtn.classList.toggle("active");
      deleteBtn.setAttribute("data-rowId", arr[i].id);

      changeStudent.classList.toggle("active");
      changeStudent.setAttribute("data-rowId", arr[i].id);

      studentId = arr[i].id
    });
    row.innerHTML = `
          <td>${fio}</td>
          <td>${faculty}</td>
          <td>${arr[i].birthday}, (${studentAgeCount} лет)</td>
          <td>${start}</td>
          `;

    table.appendChild(row);
  }
}

function education(str) {
  let endYear = +str + 4;
  let now = new Date();
  let grade = now.getFullYear() - str;
  let output;
  if (grade > 4) {
    output = `${str} - ${endYear} (закончил)`;
  } else {
    output = `${str} - ${endYear} (${grade} курс)`;
  }
  return output;
}

function studentAge(date) {
  const now = new Date();
  const birthday = new Date(date);
  return now.getFullYear() - birthday.getFullYear();
}

//удаление студента
async function deleteStudent(id) {
  const response = await fetch(`http://localhost:3000/api/students/${id}`, {
    method: "DELETE",
  });
  if (response.status === 404) console.log("студент не найден");
  data = await response.json();
}

deleteBtn.addEventListener("click", async function () {
  const rowId = deleteBtn.getAttribute("data-rowId");
  if (rowId != "undefined") {
    await deleteStudent(rowId);
    loadStudents();
  }
  deleteBtn.classList.remove("active");
  console.log(allStudents)
});

//добавление данных выбранного студента в поля ввода
changeStudent.addEventListener('click', () => {
  studentSelected(allStudents)
  addBtnIsActive = false;
});

function studentSelected(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == studentId) {
      inputName.value = arr[i].name,
      inputSurname.value = arr[i].surname,
      inputLastname.value = arr[i].lastname,
      inputBirthDate.value = arr[i].birthday,
      inputStartDate.value = arr[i].studyStart,
      inputFaculty.value = arr[i].faculty
      addStudentBtn.classList.add('disabled');
      changeBtn.classList.add('active');
    }
  }
};

  //отправка изменений на сервер
    changeBtn.addEventListener('click', async () => {
      await changeStudentData(studentId)
      addStudentBtn.classList.remove('disabled');
      changeBtn.classList.remove('active');
      window.location.reload();
    });

async function changeStudentData(id) {
    const response = await fetch(`http://localhost:3000/api/students/${id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: inputName.value.trim(),
        surname: inputSurname.value.trim(),
        lastname: inputLastname.value.trim(),
        birthday: inputBirthDate.value.trim(),
        studyStart: inputStartDate.value.trim(),
        faculty: inputFaculty.value.trim(),
    })
  })
  data = await response.json();
  console.log(data)

}





// фильтрация списка студентов
let timer;

const getFromLS = JSON.parse(localStorage.getItem("students-list"));

function filteredRows() {
  let filteredArrey = allStudents.filter((student) => {
    if (filterFio.value) {
      const studentSurName = student.surname.toLowerCase();
      const studentName = student.name.toLowerCase();
      const studentLastName = student.lastname.toLowerCase();
      const filterValue = filterFio.value.toLowerCase();

      return (studentSurName.includes(filterValue) || studentName.includes(filterValue) || studentLastName.includes(filterValue))
    }

    if (filterFaculty.value) {
      const studentFaculty = student.faculty.toLowerCase();
      const filterValue = filterFaculty.value.toLowerCase();

      if (!studentFaculty.includes(filterValue)) {
        return false;
      }
    }

    if (filterDateStart.value) {
      const studentDateStart = student.studyStart.toString();
      const filterValue = filterDateStart.value.toString();

       if (!studentDateStart.includes(filterValue)) {
        return false;
      }
    }

    if (filterDateEnd.value) {
      const studentDateEnd = (Number(student.studyStart) + 4).toString();
      const filterValue = filterDateEnd.value.toString();

      if (!studentDateEnd.includes(filterValue)) {
        return false;
      }
    }
    return true;

  })
  createTable(filteredArrey);
}

const nameFiltration = filterFio.addEventListener("keyup", function () {
  clearTimeout(timer);
  timer = setTimeout(nameFiltration, 300);

  filteredRows()
  }
);

const facultyFiltration = filterFaculty.addEventListener("keyup", function () {
  clearTimeout(timer);
  timer = setTimeout(facultyFiltration, 300);

  filteredRows()
  }
);

const dateStartFiltration = filterDateStart.addEventListener(
  "keyup",
  function () {
    clearTimeout(timer);
    timer = setTimeout(dateStartFiltration, 300);

    filteredRows()
  }
);

const dateEndFiltration = filterDateEnd.addEventListener("keyup", function () {
  clearTimeout(timer);
  timer = setTimeout(dateEndFiltration, 300);

  filteredRows()
}
);


// сортировка при нажатии на ячейку таблицы
function sortedRows(method) {
  const copyStudent = [...allStudents];

  copyStudent.sort((a, b) => {
    if (a[method] < b[method]) {
      return -1;
    }

    if (a[method] > b[method]) {
      return 1;
    }

    return 0;
  });

  return copyStudent;
}

tableFIO.addEventListener("click", function () {
  const rows = sortedRows("surname");
  createTable(rows);
});

tableFaculty.addEventListener("click", function () {
  const rows = sortedRows("faculty");
  createTable(rows);
});

tableBirthDate.addEventListener("click", function () {
  const rows = sortedRows("birthday");
  createTable(rows);
});

tableStartDate.addEventListener("click", function () {
  const rows = sortedRows("studyStart");
  createTable(rows);
});

