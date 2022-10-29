const addContact = document.querySelector(".add-btn");
const deleteBtn = document.querySelector(".delete-btn");
const popup = document.querySelector(".pop-up");
const exitIcon = document.querySelector(".exit-icon");
const cancelBtn = document.querySelectorAll(".cancel-btn");
const selectAll = document.querySelector("#selectAll");
const tableBody = document.querySelector("tbody");
const form = document.querySelector("form");
const firstName = document.querySelector("#validationDefault01");
const lastName = document.querySelector("#validationDefault02");
const email = document.querySelector("#validationDefault03");
const filterField = document.querySelector(".search-contact");
const phoneInputField = document.querySelector("#phone");
const dataField = document.querySelector(".data-field");
const editButton = document.querySelector(".edit-btn");
const submitBtn = document.querySelector(".submit-btn");
const deleteButton = document.querySelector(".delete-contact");

// save contacts to the local storage
const contacts = JSON.parse(localStorage.getItem("contact")) || [];

// intell
const phoneInput = window.intlTelInput(phoneInputField, {
  separateDialCode: true,
  preferredCountries: ["ng", "us", "co", "in", "de"],
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

// load all event listeners
const loadAllEventListeners = () => {
  addContact.addEventListener("click", showPopup);

  deleteBtn.addEventListener("click", deleteAll);
  exitIcon.addEventListener("click", hidePopup);
  submitBtn.addEventListener("mouseenter", mouseEnter);
  submitBtn.addEventListener("mouseleave", mouseLeave);
  cancelBtn.forEach((e) => {
    e.addEventListener("click", hidePopup);
  });

  form.addEventListener("submit", saveContact);
  filterField.addEventListener("keyup", filterContact);
  tableBody.addEventListener("click", deleteContact);
  tableBody.addEventListener("click", showDataField);
  selectAll.addEventListener("click", checkALL);
};

// hover for add contact {65-73}
const mouseEnter = (e) => {
  e.target.textContent = "SAVE";
};

const mouseLeave = (e) => {
  e.target.textContent = "ADD CONTACT";
};

// show datafield
const showDataField = (e) => {
  let tableColumn = e.target.parentElement;
  

  if (tableColumn.classList.contains("table-recorded")) {
    let fullNameColumn = e.target.parentElement.querySelectorAll("td")[1];
    let emailColumn = e.target.parentElement.querySelectorAll("td")[2];
    let tellColumn = e.target.parentElement.querySelectorAll("td")[3];
    let fullNameText = fullNameColumn.textContent;
    let emailText = emailColumn.textContent;
    let tellText = tellColumn.textContent;
    let dataResult = document.querySelectorAll(".data-result");
    let fullNamePop = dataResult[0];
    let emailPop = dataResult[1];
    let tellPop = dataResult[2];
    fullNamePop.innerText = `${fullNameText}`;
    emailPop.innerText = `${emailText}`;
    tellPop.innerText = `${tellText}`;

    const tableRecorded = document.querySelectorAll(".table-recorded");
    tableRecorded.forEach((e) => {
      e.classList.remove("table-active");
      dataField.classList.remove("d-none");
    });

    dataField.classList.add("d-flex");
    tableColumn.classList.add("table-active");

    // edit contact
    const editContact = (e) => {
      e.preventDefault();
      let target = e.target;
      if (target.classList.contains("edit-btn")) {
        popup.style.display = "flex";
        const dataResult = document.querySelectorAll(".data-result");
        // get full name
        const fullName = dataResult[0].textContent;
        const fullNameArray = fullName.split(" ");
        firstName.value = fullNameArray[0];
        lastName.value = fullNameArray[1];

        // get email address
        const emailAddress = dataResult[1].textContent;
        email.value = emailAddress;

        // get phone number
        const phoneNumber = dataResult[2].textContent;
        let newPhoneNumber = phoneNumber.replace("+234", "");

        phoneInputField.value = newPhoneNumber;
        tableColumn.remove();

        dataField.classList.replace("d-flex", "d-none");
        contacts.splice(
          contacts.findIndex((a) => {
            return a.fullName === fullNameText;
          }),
          1
        );
        localStorage.setItem("contact", JSON.stringify(contacts));
      }
    };

    editButton.addEventListener("click", editContact);
  }

  dataField.style.cursor = "default";
};

// delete all contacts
function deleteAll(e) {
  contacts.splice(0, contacts.length);

  tableRecorded = document.querySelectorAll(".table-recorded");
  tableRecorded.forEach((e) => {
    e.remove();
    selectAll.checked = false;
  });

  deleteBtn.style.display = "none";
    dataField.classList.add("d-none");
    addContact.disabled = false;
  localStorage.setItem("contact", JSON.stringify(contacts));

  e.preventDefault();
}

// check all contacts
const checkALL = (e) => {
  const checkBoxes = document.querySelectorAll("input[type=checkbox]");

  if (selectAll.checked === true && tableBody.children.length > 0) {
    checkBoxes.forEach((each) => {
      each.checked = true;
    });
    deleteBtn.style.display = "flex";
    addContact.disabled = true;
  } else {
    checkBoxes.forEach((each) => {
        each.checked = false;
        
    });
    deleteBtn.style.display = "none";
    addContact.disabled = false;
    
  }
};

// show popup
const showPopup = (e) => {
  popup.style.display = "flex";
  const tableRow = document.querySelectorAll(".table-recorded");
  tableRow.forEach((e) => e.classList.remove("table-active"));
  dataField.classList.replace("d-flex", "d-none");
  form.reset();
  e.preventDefault();
};

// hide popup
const hidePopup = (e) => {
  popup.style.display = "none";
  dataField.classList.replace("d-flex", "d-none");
  const tableRow = document.querySelectorAll(".table-recorded");
  tableRow.forEach((e) => e.classList.remove("table-active"));

  e.preventDefault();
};

// delete contact
const deleteContact = (e) => {
  let deleteIcon = e.target.parentElement;

  let contactCheck =
    deleteIcon.parentElement.parentElement.children[0].children[0].checked;

  if (deleteIcon.classList.contains("delete-item") && contactCheck === true) {
    deleteIcon.parentElement.parentElement.remove();

    dataField.classList.add("d-none");

    removeLocalStorage(deleteIcon);
  }
};

// remove from local storage
const removeLocalStorage = (contact) => {
  let selectedContact =
    contact.parentElement.parentElement.children[1].innerText;

  contacts.splice(
    contacts.findIndex((a) => {
      return a.fullName === selectedContact;
    }),
    1
  );
  localStorage.setItem("contact", JSON.stringify(contacts));
};

// create contact object
const addINputContact = (fullName, tellPhone, email) => {
  contacts.push({
    fullName,
    email,
    tellPhone,
  });
  localStorage.setItem("contact", JSON.stringify(contacts));

  return { fullName, email, tellPhone };
};

// extract values from the contact object
const contactElement = ({ fullName, tellPhone, email }) => {
  // create table row
  const tableRow = document.createElement("tr");
  tableRow.className = "table-recorded";

  // create table data input checkbox
  const tableDataInput = document.createElement("td");
  // create input checkbox
  const input = document.createElement("input");
  // attribute to the input checkbox
  input.setAttribute("type", "checkbox");
  tableDataInput.appendChild(input);

  // create table data for full name
  const tableDataFullName = document.createElement("td");
  tableDataFullName.innerText = `${fullName}`;
  tableDataFullName.className = "fullname";

  // create table data for phone number
  const tableDataphoneNumber = document.createElement("td");
  tableDataphoneNumber.innerText = `${tellPhone}`;

  // create table data for email
  const tableDataEmail = document.createElement("td");
  tableDataEmail.innerText = `${email}`;

  // create table data for delete icon
  const tableDataDelete = document.createElement("td");
  // create "a" tag
  const deleteLink = document.createElement("a");
  tableDataDelete.appendChild(deleteLink);
  // ADD class to the delete link
  deleteLink.className = "delete-item";
  // add href attribute
  deleteLink.setAttribute("href", "#");
  // add delete icon to delete link
  deleteLink.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  tableRow.append(
    tableDataInput,
    tableDataFullName,
    tableDataEmail,
    tableDataphoneNumber,
    tableDataDelete
  );

  // append the table row to the table body
  tableBody.appendChild(tableRow);

  popup.style.display = "none";
};

// persistence to the dom
contacts.forEach(contactElement);

// change first letter to upper case
const changeToUpperCase = (tra) => {
  let theLetters = tra.value;
  const capFirstLetter = theLetters.charAt(0).toUpperCase();
  theLetters = `${capFirstLetter}${theLetters.slice(1).toLowerCase()}`;
  return theLetters;
};

// save contact
const saveContact = (e) => {
  // first name
  let firstNameText = changeToUpperCase(firstName);

  // last name
  let lastNameText = changeToUpperCase(lastName);

  // EMAIL TEXT
  let emailText = changeToUpperCase(email);

  const fullName = `${firstNameText} ${lastNameText}`;
  const newContact = addINputContact(
    fullName,
    phoneInput.getNumber(),
    emailText
  );
  contactElement(newContact);
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  phoneInputField.value = "";
  e.preventDefault();
};

// filter the contact
const filterContact = (e) => {
  const searchTerms = e.target.value.toLowerCase();

  const dataTable = document.querySelectorAll(".table-recorded");

  dataTable.forEach((tableRow) => {
    let nameColumn = tableRow.querySelectorAll("td")[1];
    let emailColumn = tableRow.querySelectorAll("td")[2];
    let tellColumn = tableRow.querySelectorAll("td")[3];

    let nameText = nameColumn.textContent.toLowerCase();
    let emailText = emailColumn.textContent.toLowerCase();
    let tellText = tellColumn.textContent.toLowerCase();
    if (
      nameText.indexOf(searchTerms) > -1 ||
      emailText.indexOf(searchTerms) > -1 ||
      tellText.indexOf(searchTerms) > -1
    ) {
      nameColumn.parentElement.style.display = "";
      emailColumn.parentElement.style.display = "";
      tellColumn.parentElement.style.display = "";
    } else {
      nameColumn.parentElement.style.display = "none";
      emailColumn.parentElement.style.display = "none";
      tellColumn.parentElement.style.display = "none";
    }
  });
  e.preventDefault();
};

loadAllEventListeners();
