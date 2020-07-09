// ---- Globals ----
class Contact {
    constructor(id, firstName, lastName, birth, phone, email, address) {
        this.ID = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birth = birth;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }
}

let isEditing = false;
let editedContactID = null;

// ---- Selectors ----
const createContactForm = document.querySelector('#create-contact-form');

const firstNameInput = document.querySelector("#first-name-input");
const lastNameInput = document.querySelector("#last-name-input");
const birthInput = document.querySelector("#birth-input");
const phoneInput = document.querySelector("#phone-input");
const emailInput = document.querySelector("#email-input");
const addressInput = document.querySelector("#address-input");

const createButton = document.querySelector('#create-contact');
createButton.textContent = "Create Contact";

const viewAllButton = document.querySelector('#view-all-button');

const recordsList = document.querySelector("#records-list");

// ---- Event Listeners ----
createButton.addEventListener('click', addContact);
recordsList.addEventListener('click', interactRecords);
viewAllButton.addEventListener('click', () => initialContactsRender(getStoredContacts()));

// ---- Event Handlers ----

// Handles validating, and then adding a new contact to local storage and displayed contacts list
function addContact (e) {
    // Prevent form from submitting
    e.preventDefault();
    if(!checkValidation()){
        return;
    };

    let currentStoredContacts = getStoredContacts();

    // Create a contact object;
    const contact = new Contact(
        `${phoneInput.value}${emailInput.value}`,
        firstNameInput.value,
        lastNameInput.value, 
        birthInput.value,
        phoneInput.value,
        emailInput.value,
        addressInput.value
    );

    // Check if phone number already exists
    const isDublicate = getContactById(contact.ID, currentStoredContacts);
    if(isDublicate !=-1 && !isEditing){
        window.alert("Contact With This Phone Number and Email Already Exists");
        return;
    }
    // Add Contact to Local Storage
    currentStorecContacts = updateLocalStorage(contact, currentStoredContacts);
    
    // Update Contacts View
    initialContactsRender(currentStorecContacts);

    // Clear the Form
    createContactForm.reset();

    // Update Button Test if Editing Was True
    createButton.textContent = "Create Contact";
}

// Handles interactions with contact records list
function interactRecords (e){
    if(e.target.classList[0] === 'edit-button'){
        const selectedContactID = e.target.parentElement.previousSibling.getAttribute('id');
        editContact(selectedContactID);
    }
    if(e.target.classList[0] === 'delete-button'){
        const selectedContactID = e.target.parentElement.previousSibling.getAttribute('id');
        deleteContact(selectedContactID);
    }
}

// ---- Helper Functions ----

// updates localStorage with the new contact and returns updated contacts list
function updateLocalStorage(contact, storedContacts){
    // If editing, find the contact by received ID, and replace it by the new contact details
    if(isEditing){
        const repeatContactIndex = storedContacts.findIndex(x => x.ID === editedContactID);
        storedContacts.splice(repeatContactIndex, 1, contact);
        localStorage.setItem("storedContacts", JSON.stringify(storedContacts));
        isEditing = false;
        editedContactID = null;
        return storedContacts;
    }
    storedContacts.push(contact);
    localStorage.setItem("storedContacts", JSON.stringify(storedContacts));

    console.log("Added a New Contact");
    return storedContacts;
    //updateRecords(storedContacts);
}

// returns a contact with a matching ID, or -1 (to pre-check for dublicate contacts before adding a new contact)
function getContactById(questionedContactID, currentStoredContacts){
    for (const contact of currentStoredContacts){
        if (questionedContactID === contact.ID){
            return contact;
            }
        }
    return -1;
}

// returns stored contacts from localStorage
function getStoredContacts(){
    let storedContacts;
    if (localStorage.getItem('storedContacts') === null){
        storedContacts = [];
    } else {
        storedContacts = JSON.parse(localStorage.getItem("storedContacts"));
    }
    return storedContacts;
}

// renders all of the contact records upon "View All Contacts" and when editing/ deleting existing contacts
function initialContactsRender(storedContacts){
    recordsList.innerHTML = '';
    storedContacts.forEach(contact => {
        addRecord(contact);
    }) 
}

// a helper function for initialConcactsRender. Future ideas to use it without rerendering the whole list if only adding, and not editing, a new contact
function addRecord(contact){
    // Create a record and buttons holder
    const recordDiv = document.createElement('div');
    recordDiv.classList.add("record-div");

    // Create a record list item
    const newRecord = document.createElement("li");
    newRecord.innerText = `${contact.firstName} ${contact.lastName} ${contact.birth} ${contact.phone} ${contact.email}, ${contact.address}`;
    newRecord.classList.add("record");
    newRecord.setAttribute("id", contact.ID);
    recordDiv.appendChild(newRecord);
    
    // Add buttons
    const buttonWrapper = document.createElement('div');
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="icon fas fa-user-edit"></i>';
    editButton.classList.add('edit-button');
    buttonWrapper.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="icon fas fa-user-times"></i>';
    deleteButton.classList.add('delete-button');
    buttonWrapper.appendChild(deleteButton);
    buttonWrapper.classList.add('record-button-wrapper');

    // Add to DOM
    recordDiv.appendChild(buttonWrapper);
    recordsList.appendChild(recordDiv);
    recordsList.appendChild(document.createElement('hr'));
    
}

// updates the contact values of an edited contact to the forms so they can be re-used when editing existing contacts 
function editContact(selectedContactID){
    // Set Global Variables
    isEditing = true;
    editedContactID = selectedContactID;
    createButton.textContent = "Edit Contact";

    console.log(`Editing Contact with ID ${selectedContactID}`);

    // Fetch Contact Object by ID
    contact = getContactById(selectedContactID, getStoredContacts());

    // Set Form Input Values to Contact's Values
    firstNameInput.value = contact.firstName;
    lastNameInput.value = contact.lastName;
    birthInput.value = contact.birth;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email;
    addressInput.value = contact.address;

    return;
}

// deletes a contact by ID, and repaints contacts list
function deleteContact(contactID){
    console.log(`Deleting Contact with ID ${contactID}`);
    const storedContacts = getStoredContacts();

    const repeatContactIndex = storedContacts.findIndex(x => x.ID === contactID);
    storedContacts.splice(repeatContactIndex, 1);
    localStorage.setItem("storedContacts", JSON.stringify(storedContacts));

    initialContactsRender(storedContacts);
}

// used for form validation before a new contact is created
function checkValidation(){
    if(!firstNameInput.checkValidity()){
        window.alert("Only Letters Allowe in First Name");
        return false;
    }
    else if(!lastNameInput.checkValidity()){
        window.alert("Only Letters Allowed in Last Name");
        return false;
    }
    else if(!birthInput.checkValidity()){
        window.alert("Please Input Date of Birth");
        return false;
    }
    else if(!phoneInput.checkValidity()){
        window.alert("Only Numbers, No Symbols or Spaces Allowed In Phone Number");
        return false;
    }
    else if(!emailInput.checkValidity()){
        window.alert("Invalid email format");
        return false;
    }
    return true;
}



