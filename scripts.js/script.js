const addBtn = document.getElementById("add");
const input = document.getElementById("input");
const addEditModal = document.getElementById("add-edit-modal");
const closeBtn = document.querySelector(".close-btn");
const pfp = document.querySelector(".pfp");
const enterNameInput = document.getElementById("enter-name");
const enterNumberInput = document.getElementById("enter-number");
const cancelBtn = document.getElementById("cancel");
const formSubmit = document.querySelector("form");
const contactsList = document.querySelector(".contact-list");
const emptyList = document.querySelector(".empty-list");
const addBtn2 = document.getElementById("add-2");
const contactPreview = document.querySelector(".contact-preview");
const emptyPreview = document.querySelector(".empty-preview");
const searchBtn = document.getElementById("search");

let contactsArray = [];
let editId = null;

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

function edit(e) {
  addEditModal.classList.remove("hide");

  contactsArray.forEach((contact) => {
    if (`edit-${contact.id}` === e.target.id) {
      editId = contact.id;
      enterNameInput.value = contact.name;
      enterNumberInput.value = contact.no;
    }
  });
}

function del(e) {
  contactsArray.forEach((contact, index) => {
    if (`delete-${contact.id}` === e.target.id) {
      contactsArray.splice(index, 1);
      syncDelete(contact.id);
    }
  });
  alert("Contact has been deleted");
  displayContacts();
  contactPreview.querySelectorAll(".preview").forEach((el) => el.remove());
  emptyPreview.classList.remove("hide");
}

function profilePicInit(name) {
  let init = "";
  name.split(" ").forEach((letter) => {
    init += letter[0];
  });

  return init;
}

function displayContacts(list = contactsArray, isSearch = false) {
  contactsList.querySelectorAll(".contact").forEach((el) => el.remove());

  if (!list.length) {
    emptyList.innerHTML = isSearch
      ? `No Results Found`
      : `No contacts added yet.
        <button id="add-2">Add your first Contact!</button>`;

    emptyList.classList.remove("hide");
    return;
  }

  emptyList.classList.add("hide");

  list.forEach((c) => {
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

  const contactBtns = document.querySelectorAll(".contact");

  contactBtns.forEach((contactBtn) => {
    contactBtn.addEventListener("click", () => {
      previewCard(contactBtn);
    });
  });
}

function previewCard(c) {
  emptyPreview.classList.add("hide");

  contactPreview.querySelectorAll(".preview").forEach((el) => el.remove());

  let nameKey = c.querySelector("p").textContent;
  let phoneKey;
  let initKey;

  contactsArray.forEach((contact) => {
    if (contact.name === nameKey) {
      phoneKey = contact.no;
      initKey = contact.pfp;
      idKey = contact.id;
      return;
    }
  });

  const preview = document.createElement("div");
  preview.classList.add("preview");

  const profilePic = document.createElement("div");
  const initials = document.createElement("span");
  profilePic.appendChild(initials);
  initials.textContent = initKey;
  profilePic.classList.add("pfp");
  profilePic.classList.add("pfp-small");

  const name = document.createElement("p");
  name.classList.add("justify");
  const nameLabel = document.createElement("span");
  nameLabel.textContent = "Name:";
  const nameValue = document.createElement("span");
  nameValue.textContent = `${nameKey}`;
  name.appendChild(nameLabel);
  name.appendChild(nameValue);

  const phone = document.createElement("p");
  phone.classList.add("justify");
  const phoneLabel = document.createElement("span");
  phoneLabel.textContent = "Phone no:";
  const phoneValue = document.createElement("span");
  phoneValue.textContent = `${phoneKey}`;
  phone.appendChild(phoneLabel);
  phone.appendChild(phoneValue);

  const iconWrapper = document.createElement("div");
  iconWrapper.classList.add("preview-icons-wrapper");
  const call = document.createElement("button");
  const videoCall = document.createElement("button");
  iconWrapper.appendChild(call);
  iconWrapper.appendChild(videoCall);

  const btnsWrapper = document.createElement("div");
  btnsWrapper.classList.add("preview-btns-wrapper");
  const edit = document.createElement("button");
  edit.id = `edit-${idKey}`;
  edit.classList.add("edit-btn");
  edit.textContent = "Edit";
  const del = document.createElement("button");
  del.textContent = "Delete";
  del.id = `delete-${idKey}`;
  del.classList.add("delete-btn");
  btnsWrapper.appendChild(edit);
  btnsWrapper.appendChild(del);

  preview.appendChild(profilePic);
  preview.appendChild(name);
  preview.appendChild(phone);
  preview.appendChild(iconWrapper);
  preview.appendChild(btnsWrapper);

  contactPreview.appendChild(preview);
}

async function fetchContacts() {
  try {
    const res = await fetch("http://localhost:3000/contacts");

    if (!res.ok) throw new Error();

    const data = await res.json();

    contactsArray = data;
    displayContacts();
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

async function syncUpdate(contact) {
  console.log(contact);
  try {
    console.log("PUT URL:", `http://localhost:3000/contacts/${contact.id}`);
    const res = await fetch(`http://localhost:3000/contacts/${contact.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });

    if (!res.ok) throw new Error();
  } catch (err) {
    console.error(err);
  }
}

async function syncDelete(contact) {
  try {
    const res = await fetch(`http://localhost:3000/contacts/${contact}`, {
      method: "DELETE",
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

searchBtn.addEventListener("click", () => {
  if (!input.value.trim()) {
    return;
  }

  const inputValue = input.value.trim().toLowerCase();

  const filtered = contactsArray.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(inputValue) ||
      contact.no.toLowerCase().includes(inputValue)
    );
  });

  displayContacts(filtered, true);
});

contactPreview.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    edit(e);
  }

  if (e.target.classList.contains("delete-btn")) {
    del(e);
  }
});

closeBtn.addEventListener("click", () => {
  close();
});

cancelBtn.addEventListener("click", () => {
  close();
});

formSubmit.addEventListener("submit", (e) => {
  e.preventDefault();

  if (editId) {
    const index = contactsArray.findIndex((c) => {
      return c.id === editId;
    });

    contactsArray[index] = {
      ...contactsArray[index],
      name: enterNameInput.value,
      no: enterNumberInput.value,
      pfp: profilePicInit(enterNameInput.value),
    };

    displayContacts();
    contactPreview.querySelectorAll(".preview").forEach((el) => el.remove());
    emptyPreview.classList.remove("hide");

    syncUpdate(contactsArray[index]);
    editId = null;

    alert("Contact has been updated!");
  } else {
    const contact = {
      id: Date.now(),
      pfp: profilePicInit(enterNameInput.value),
      name: enterNameInput.value,
      no: enterNumberInput.value,
    };

    contactsArray.push(contact);
    displayContacts();
    console.log(contactsArray);

    syncContact(contact);
    alert("Contact has been saved!");
  }

  close();
});

fetchContacts();
