const API_URL = "https://jsonplaceholder.typicode.com/users";

const contactList = document.getElementById("contactList");
const saveBtn = document.getElementById("saveBtn");
const searchInput = document.getElementById("search");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const contactIdInput = document.getElementById("contactId");

const message = document.getElementById("message");

let contacts = [];

// Fetch Contacts
async function fetchContacts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }

    contacts = await response.json();
    displayContacts(contacts);

  } catch (error) {
    showMessage(error.message, "red");
  }
}

// Display Contacts
function displayContacts(data) {
  contactList.innerHTML = "";

  data.forEach(contact => {
    const card = document.createElement("div");
    card.classList.add("contact-card");

    card.innerHTML = `
      <h3>${contact.name}</h3>
      <p><strong>Phone:</strong> ${contact.phone}</p>
      <p><strong>Email:</strong> ${contact.email}</p>

      <div class="actions">
        <button class="edit-btn" onclick="editContact(${contact.id})">
          Edit
        </button>

        <button class="delete-btn" onclick="deleteContact(${contact.id})">
          Delete
        </button>
      </div>
    `;

    contactList.appendChild(card);
  });
}

// Save Contact
saveBtn.addEventListener("click", async () => {

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const id = contactIdInput.value;

  // Validation
  if (!name || !phone || !email) {
    showMessage("All fields are required", "red");
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    showMessage("Phone number must be 10 digits", "red");
    return;
  }

  const contactData = {
    name,
    phone,
    email
  };

  try {

    // Update Contact
    if (id) {

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        throw new Error("Failed to update contact");
      }

      contacts = contacts.map(contact =>
        contact.id == id ? { ...contact, ...contactData } : contact
      );

      showMessage("Contact updated successfully", "green");

    } else {

      // Add Contact
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        throw new Error("Failed to add contact");
      }

      const newContact = await response.json();

      contacts.unshift({
        ...newContact,
        id: Date.now()
      });

      showMessage("Contact added successfully", "green");
    }

    displayContacts(contacts);
    clearForm();

  } catch (error) {
    showMessage(error.message, "red");
  }
});

// Edit Contact
function editContact(id) {

  const contact = contacts.find(c => c.id === id);

  nameInput.value = contact.name;
  phoneInput.value = contact.phone;
  emailInput.value = contact.email;
  contactIdInput.value = contact.id;
}

// Delete Contact
async function deleteContact(id) {

  const confirmDelete = confirm("Are you sure to delete this contact?");

  if (!confirmDelete) return;

  try {

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }

    contacts = contacts.filter(contact => contact.id !== id);

    displayContacts(contacts);

    showMessage("Contact deleted successfully", "green");

  } catch (error) {
    showMessage(error.message, "red");
  }
}

// Search Contacts
searchInput.addEventListener("input", () => {

  const value = searchInput.value.toLowerCase();

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(value)
  );

  displayContacts(filteredContacts);
});

// Show Message
function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;

  setTimeout(() => {
    message.textContent = "";
  }, 3000);
}

// Clear Form
function clearForm() {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  contactIdInput.value = "";
}

// Initial Load
fetchContacts();