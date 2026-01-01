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

function profilePicInit(name) {
  let init = "";
  name.split(" ").forEach((letter) => {
    init += letter[0];
  });

  return init;
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

  const contactBtns = document.querySelectorAll(".contact");

  contactBtns.forEach((contactBtn) => {
    contactBtn.addEventListener("click", () => {
      previewCard(contactBtn);
    });
  });
}

function previewCard(c) {
  emptyPreview.classList.add("hide");

  contactPreview.innerHTML = "";

  let nameKey = c.querySelector("p").textContent;
  let phoneKey;
  let initKey;

  console.log(nameKey);

  contactsArray.forEach((contact) => {
    if (contact.name === nameKey) {
      phoneKey = contact.no;
      initKey = contact.pfp;
      return;
    }
  });

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
  edit.textContent = "Edit";
  const del = document.createElement("button");
  del.textContent = "Delete";
  btnsWrapper.appendChild(edit);
  btnsWrapper.appendChild(del);

  contactPreview.appendChild(profilePic);
  contactPreview.appendChild(name);
  contactPreview.appendChild(phone);
  contactPreview.appendChild(iconWrapper);
  contactPreview.appendChild(btnsWrapper);
}

async function fetchContacts() {
  try {
    const res = await fetch("http://localhost:3000/contacts");

    if (!res.ok) throw new Error();

    const data = await res.json();

    contactsArray = data;
    console.log(contactsArray);
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

formSubmit.addEventListener("submit", (e) => {
  e.preventDefault();

  const contact = {
    id: Date.now(),
    pfp: profilePicInit(enterNameInput.value),
    name: enterNameInput.value,
    no: enterNumberInput.value,
  };

  contactsArray.push(contact);

  syncContact(contact);

  close();
  alert("Contact has been saved!");
});

fetchContacts();
