# Contacts Management App
This app allows adding, editing, and storing (localStorage) of contacts: first name, last name, phone number, date of birth, email address, and, optionally, living address.

## Usage
Use the app on a live server

## shortcomings
    * When adding a new record, all records are re-rendered, which isn't optimal.
    * Contact properties wouldn't scale easily, as every new property woudld require index.html manipulation, a new input selector, editing Contact class, new Contact function, and checkValidation function.
    * Editing state relies on global let variable manipulation
    * When editing a contact, an already existing phone number and email can be passed without ID validation issues. This happens as create a new contact function is re-used when editing a contact, therefore it has to ignore temporarily matching IDs as ID matching occurs before localStorage is updated (to prevent from adding dublicate contacts). To resolve the issue, getContactById would need to count matched contacts instead of returing the first instance.

## Dependencies
*fontawesome for icons
