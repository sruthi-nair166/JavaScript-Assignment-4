const addBtn = document.getElementById("add");
const input = document.getElementById("input");
const addEditModal = document.getElementById("add-edit-modal");
const closeBtn = document.querySelector(".close-btn");
const enterNameInput = document.getElementById("enter-name");
const enterNumberInput = document.getElementById("enter-number");
const cancelBtn = document.getElementById("cancel");
const saveBtn = document.getElementById("save");
const contactsList = document.querySelector(".contact-list");
const emptyList = document.querySelector(".empty-list");
const addBtn2 = document.getElementById("add-2");

let contactsArray = [];

function add(value) {
  addEditModal.classList.remove("hide");

  if (!value) {
    enterNameInput.value = "";
    enterNumberInput.value = "";
    return;
  }

  if (/^\d+$/.test(value)) {
    enterNumberInput.value = value;
  } else {
    enterNameInput.value = value;
  }
}

function displayContacts() {
  if (!contactsArray) {
    return;
  }

  emptyList.classList.add("hide");

  contactsArray.forEach((c) => {
    const contact = document.createElement("button");
    contact.classList.add("contact");

    const name = document.createElement("p");
    name.textContent = c.name;
    contact.appendChild(name);

    const iconWrapper = document.createElement("div");

    const call = document.createElement("button");
    iconWrapper.appendChild(call);

    const videoCall = document.createElement("button");
    iconWrapper.appendChild(videoCall);

    contact.appendChild(iconWrapper);
    contactsList.appendChild(contact);
  });
}

async function fetchContacts() {
  try {
    const res = await fetch("http://localhost:3000/contacts");

    console.log("STATUS:", res.status);

    if (!res.ok) throw new Error();

    const data = await res.json();
    console.log("DATA:", data);

    contactsArray = data;
    console.log(contactsArray);
    displayContacts();
    console.log("DISPLAY SUCCESS");
  } catch (err) {
    console.error("No Data");
  }
}

async function syncContact(contact) {
  try {
    const res = await fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });

    if (!res.ok) throw new Error();
  } catch (err) {
    console.error(err);
  }
}

function close() {
  addEditModal.classList.add("hide");
  input.value = "";
  enterNameInput.value = "";
  enterNumberInput.value = "";
}

addBtn.addEventListener("click", () => {
  add(input.value.trim());
});

addBtn2.addEventListener("click", () => {
  add();
});

closeBtn.addEventListener("click", () => {
  close();
});

cancelBtn.addEventListener("click", () => {
  close();
});

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const contact = {
    id: Date.now(),
    name: enterNameInput.value,
    no: enterNumberInput.value,
  };

  contactsArray.push(contact);

  syncContact(contact);

  close();
});

fetchContacts();
