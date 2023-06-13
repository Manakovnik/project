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
      const studentDateEnd = (student.studyStart + 4).toString();
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
  createTable(allStudents);
  }
);



// const nameFiltration = filterFio.addEventListener("keyup", function () {
//   clearTimeout(timer);
//   timer = setTimeout(filtrationByName, 300);
//   function filtrationByName() {
//     const newList = allStudents.filter((student) => {
//       if (filterFio.value) {
//         const studentSurName = student.surname.toLowerCase();
//         const studentName = student.name.toLowerCase();
//         const studentLastName = student.lastname.toLowerCase();
//         const filterValue = filterFio.value.toLowerCase();

//         if (
//           (!studentSurName.includes(filterValue)) &&
//           (!studentName.includes(filterValue)) &&
//           (!studentLastName.includes(filterValue))
//         ) {
//           return false;
//         }
//       }
//       return true;
//     });
//     createTable(newList);
//   }
// });

// const facultyFiltration = filterFaculty.addEventListener("keyup", function () {
//   clearTimeout(timer);
//   timer = setTimeout(filtrationByFaculty, 300);
//   function filtrationByFaculty() {
//     const newList = getFromLS.filter((student) => {
//       if (filterFaculty.value) {
//         const studentFaculty = student.faculty.toLowerCase();
//         const filterValue = filterFaculty.value.toLowerCase();

//         if (!studentFaculty.includes(filterValue)) {
//           return false;
//         }
//       }
//       return true;
//     });
//     createTable(newList);
//   }
// });

// const dateStartFiltration = filterDateStart.addEventListener(
//   "keyup",
//   function () {
//     clearTimeout(timer);
//     timer = setTimeout(filtrationByStartDate, 300);
//     function filtrationByStartDate() {
//       const newList = getFromLS.filter((student) => {
//         if (filterDateStart.value) {
//           const studentDateStart = student.studyStart.toString();
//           const filterValue = filterDateStart.value.toString();

//           if (!studentDateStart.includes(filterValue)) {
//             return false;
//           }
//         }
//         return true;
//       });
//       createTable(newList);
//     }
//   }
// );

// const dateEndFiltration = filterDateEnd.addEventListener("keyup", function () {
//   clearTimeout(timer);
//   timer = setTimeout(filtrationByEndDate, 300);
//   function filtrationByEndDate() {
//     const newList = getFromLS.filter((student) => {
//       if (filterDateEnd.value) {
//         const studentDateEnd = (student.studyStart + 4).toString();
//         const filterValue = filterDateEnd.value.toString();

//         if (!studentDateEnd.includes(filterValue)) {
//           return false;
//         }
//       }
//       return true;
//     });
//     createTable(newList);
//   }
// });
