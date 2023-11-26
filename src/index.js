// See docs and video tutorial
// https://www.youtube.com/watch?v=rQvOAnNvcNQ&t=463s&ab_channel=Firebase

/* 
to run webpack bundler: in terminal, $ node_modules/.bin/webpack --entry ./index.js -o dist
This command will use webpack with an entry point of index.js which is assumed to be located at the root of the proj, which should import everything you need for the application. If this entry point file moves, then the terminal command needs to be updated to reflect this change. We also assign an output with o flag, of directory called dist.
Now, when you add the main.js script into the app, you may find the code in a hashed style format which is difficult to read and debug. 
We can use a source map to make the code more legible. We setup webpack.config.js which includes utilities like copying files, minifying, start a dev server and JS bundling. This is useful as the bundler can remove unused JS code from the production environment which results in a performance boost by not loading unnecessary code, known as tree shaking.
See webpack.config.js for notes.
*/

const authFormWrapper = document.getElementById("loginFormWrapper");
const txtEmail = document.getElementById("txtEmail");
const txtPassword = document.getElementById("txtPassword");

const btnLogin = document.getElementById("btnLogin");
const btnSignup = document.getElementById("btnSignup");
const btnLogout = document.getElementById("btnLogout");

import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  getFirestore,
  getDocs,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { materialize } from "./materialize.min.js";
import { appUI } from "./ui.js";
import Toastify from "toastify-js";
import {
  errorToast,
  successLoginToast,
  successSignUpToast,
  successToast,
  successUpdateToast,
  errorLoginToast,
} from "./customToasts";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration - yes apparently this is safe to have db config on the client side!
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "notes-app-pwa.firebaseapp.com",
  projectId: "notes-app-pwa",
  storageBucket: "notes-app-pwa.appspot.com",
  messagingSenderId: "1082803489108",
  appId: "1:1082803489108:web:a53152a9177cf4601420c1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Authentication: Signing Up
const signUpEmailPassword = async () => {
  const signUptextEmailVal = txtEmail.value;
  const signUptextPasswordVal = txtPassword.value;

  createUserWithEmailAndPassword(
    auth,
    signUptextEmailVal,
    signUptextPasswordVal
  )
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      successSignUpToast();
    })
    .catch((err) => {
      alert("An error occurred: " + err.message);
    });
};

// Authentication: Logging In
const loggingInEmailPassword = async () => {
  let logIntextEmailVal = txtEmail.value;
  let logIntextPasswordVal = txtPassword.value;

  signInWithEmailAndPassword(auth, logIntextEmailVal, logIntextPasswordVal)
    .then((userCredential) => {
      const user = userCredential.user;
      successLoginToast();
      checkAuthState();
      txtEmail.value = "";
      txtPassword.value = "";
    })
    .catch((err) => {
      console.log("An error occurred when logging in: ".err);
      errorLoginToast();
    });
};

// Authentication: check auth state
const checkAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authFormWrapper.style.display = "none";
      btnLogout.style.display = "block";
      notesWrapper.style.display = "block";
      document.querySelector(".add-btn").style.display = "block";
      getNotes();
    } else {
      authFormWrapper.style.display = "block";
      btnLogout.style.display = "none";
      document.querySelector(".add-btn").style.display = "none";
    }
  });
};

// Authentication: user sign out
const userSignOut = async () => {
  await signOut(auth);
  notesWrapper.style.display = "none";
};
checkAuthState();

document.querySelector(".add-btn").style.display = "none";
btnLogin.addEventListener("click", loggingInEmailPassword);
btnSignup.addEventListener("click", signUpEmailPassword);
btnLogout.addEventListener("click", userSignOut);

// Use Firebase services - database
const db = getFirestore(app);
// Select the document collection. In our case, we created a collection called notes which will store our notes app data.
const toDoNotes = collection(db, "notes");

/* 
Dom selection variables 
*/
// grab the container that wraps all note cards
const notesWrapper = document.querySelector(".notes-wrapper");
// get sideform elements for adding notes
const formWrapper = document.getElementById("side-form");
const noteForm = document.querySelector("#side-form .add-note");
// get sideform elements for updating notes
const formUpdateWrapper = document.getElementById("side-form-update");
const updateForm = formUpdateWrapper.querySelector(".add-note");

/* 
manually Read the db and output markup
*/
let tempNotesArr = [];
let updateIdVar;
const getNotes = async () => {
  try {
    const querySnapshot = await getDocs(toDoNotes);
    // console.log( querySnapshot);
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      let tempNoteObj = {};
      let noteId = doc.id;
      let noteTitle = doc._document.data.value.mapValue.fields.title;
      let noteDesc = doc._document.data.value.mapValue.fields.description;

      tempNoteObj = {
        title: noteTitle,
        desc: noteDesc,
        id: noteId,
      };

      tempNotesArr.push(tempNoteObj);
      tempNoteObj = {};
    });
    // console.log(tempNotesArr);
    // noteMarkupGenerator(tempNoteObj.title, tempNoteObj.desc, tempNoteObj.id);
    tempNotesArr.forEach((note) => {
      noteMarkupGenerator(
        note.title.stringValue,
        note.desc.stringValue,
        note.id
      );
    });
  } catch (error) {
    console.log("errors: ", error);
  }
};

/* 
Function to generate markup
*/
function noteMarkupGenerator(noteTitle, noteDesc, id) {
  // console.log(id);

  const cardPanel = notesWrapper.appendChild(document.createElement("div"));
  cardPanel.className = "card-panel note yellow lighten-4 row hoverable";
  cardPanel.innerHTML += `
  <img
          src="./assets/notepad, pen and plant.jpg"
          alt="A school, office notebook with a white pen and green branches lies on a gray table, desk, background."
        />
        <div class="note-details">
          <img
            src="./assets/notes-note-svgrepo-com.svg"
            alt="notes icon thumbnail"
          />
          <h2 class="note-title"></h2>
          <p class="note-description"></p>
        </div>
        <div class="note-delete">
        <a
        class="sidenav-trigger"
        data-target="side-form-update"
        > 
        <img
            src="./assets/icons/write-svgrepo-com.svg"
            alt="update icon"
            data-target="side-form-update"
          />
        </a>
       
          <img
            src="./assets/icons/trash-can-svgrepo-com.svg"
            alt="trash icon delete"
          />
        </div>
        `;
  const markupNotesDetails = cardPanel.querySelector(".note-details").children;
  cardPanel.id = id;
  markupNotesDetails[1].textContent = noteTitle;
  markupNotesDetails[2].textContent = noteDesc;

  // update functionality
  const updateBtn = cardPanel.children[2].children[0];
  updateBtn.addEventListener("click", (e) => {
    let selectednoteTitle =
      e.target.parentElement.parentElement.previousElementSibling.children[1]
        .textContent;
    let selectednoteDesc =
      e.target.parentElement.parentElement.previousElementSibling.children[2]
        .textContent;
    let updateId =
      e.target.parentElement.parentElement.parentElement.id.toString();
    updateIdVar = updateId;
    // inject current note title and desc values as placeholder text into update form
    // tried to change input.value but couldn't work out how to send updated values to db and UI as well as reset to empty string
    updateForm.updateTitle.placeholder = selectednoteTitle;
    updateForm.updateDescription.placeholder = selectednoteDesc;
  });

  // delete functionality
  const deleteBtn = cardPanel.children[2].children[1];
  deleteBtn.addEventListener("click", (e) => {
    let deleteId = e.target.parentElement.parentElement.id.toString();
    e.target.parentElement.parentElement.remove();
    deleteDoc(doc(db, "notes", deleteId));
  });
}

/* 
Create data and perform basic check, then add to the db 
*/

const checkNoteIsValid = async (noteTitle, noteDesc) => {
  if (noteTitle && noteDesc) {
    try {
      if (!updateIdVar) {
        let docRef = await addDoc(toDoNotes, {
          title: noteTitle,
          description: noteDesc,
        });
        // console.log("Doc written with ID: ", docRef.id);
        noteMarkupGenerator(noteTitle, noteDesc, docRef.id);
        successToast();
      } else {
        await updateDoc(doc(db, "notes", updateIdVar), {
          title: noteTitle,
          description: noteDesc,
        });
        successUpdateToast();
        let updateNoteElm = document.getElementById(updateIdVar);
        console.log(updateNoteElm);
        updateNoteElm.querySelector(".note-title").textContent = noteTitle;
        updateNoteElm.querySelector(".note-description").textContent = noteDesc;
        updateIdVar = "";
      }
    } catch (error) {
      console.log("errors: ", error);
    }
  } else {
    errorToast();
  }
};

function onFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(formData);
  const inputTitle = formData.get("title").trim();
  const inputDesc = formData.get("description").trim();
  console.log(`Title: ${inputTitle}, Description: ${inputDesc}`);
  // add to DB, gen id then add to UI
  checkNoteIsValid(inputTitle, inputDesc);

  formWrapper.style.transform = "translateX(-100%)";
  noteForm.querySelectorAll(".validate").forEach((eachInput) => {
    eachInput.value = "";
  });
}

function onFormUpdate(e) {
  e.preventDefault();
  const updatedformData = new FormData(e.target);
  console.log(updatedformData);
  const inputUpdateTitle = updatedformData.get("updateTitle");
  let inputUpdateDesc = updatedformData.get("updateDescription");
  console.log(`Title: ${inputUpdateTitle}, Description: ${inputUpdateDesc}`);
  // add to DB, gen id then add to UI
  checkNoteIsValid(inputUpdateTitle, inputUpdateDesc);

  formUpdateWrapper.style.transform = "translateX(-100%)";
  updateForm.querySelectorAll(".validate").forEach((eachInput) => {
    eachInput.value = "";
  });
}

noteForm.addEventListener("submit", onFormSubmit);
updateForm.addEventListener("submit", onFormUpdate);
