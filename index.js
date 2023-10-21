// See docs and video tutorial
// https://www.youtube.com/watch?v=rQvOAnNvcNQ&t=463s&ab_channel=Firebase

/* 
to run webpack bundler: in terminal, $ node_modules/.bin/webpack --entry ./index.js -o dist
This command will use webpack with an entry point of index.js which is assumed to be located at the root of the proj, which should import everything you need for the application. If this entry point file moves, then the terminal command needs to be updated to reflect this change. We also assign an output with o flag, of directory called dist.
Now, when you add the main.js script into the app, you may find the code in a hashed style format which is difficult to read and debug. 
We can use a source map to make the code more legible. We setup webpack.config.js which includes utilities like copying files, minifying, start a dev server and JS bundling. This is useful as the bundler can remove unused JS code from the production environment which results in a performance boost by not loading unnecessary code, known as tree shaking.
See webpack.config.js for notes.
*/
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration - yes apparently this is safe to have db config on the client side!
const firebaseConfig = {
  apiKey: "AIzaSyDIeXz_82F-_p1SaLzBe2vNAXltdRwoOYM",
  authDomain: "notes-app-pwa.firebaseapp.com",
  projectId: "notes-app-pwa",
  storageBucket: "notes-app-pwa.appspot.com",
  messagingSenderId: "1082803489108",
  appId: "1:1082803489108:web:a53152a9177cf4601420c1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use Firebase services - database
const db = getFirestore(app);
// Select the document collection. In our case, we created a collection called notes which will store our notes app data.
const toDoNotes = collection(db, "notes");

/* 
manually Read the db and output markup
*/

const querySnapshot = await getDocs(toDoNotes);

const tempNotesArr = [];
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

console.log(tempNotesArr);

// inject markup
const notesWrapper = document.querySelector(".notes-wrapper");
tempNotesArr.forEach((note) => {
  // console.log(note.title);

  const cardPanel = notesWrapper.appendChild(document.createElement("div"));
  cardPanel.className = "card-panel note yellow lighten-4 row";

  cardPanel.innerHTML += `
  
        <img
          src="/assets/notepad, pen and plant.jpg"
          alt="A school, office notebook with a white pen and green branches lies on a gray table, desk, background. Place for an inscription. Office. Job. School. Personal diary. View from above. Eucalyptus."
        />
        <div class="note-details">
          <img
            src="/assets/notes-note-svgrepo-com.svg"
            alt="notes icon thumbnail"
          />
          <h2 class="note-title"></h2>
          <p class="note-description"></p>
        </div>
        <div class="note-delete">
          <img
            src="/assets/icons/trash-can-svgrepo-com.svg"
            alt="trash icon delete"
          />
        </div>
  `;

  const markupNotesDetails = cardPanel.querySelector(".note-details").children;
  markupNotesDetails[1].textContent = note.title.stringValue;
  markupNotesDetails[2].textContent = note.desc.stringValue;
  cardPanel.id = note.id;
});

/* 
manually Create data and add to the db 
*/

// try {
//   const docRef = await addDoc(toDoNotes, {
//     title: "test-title",
//     description: "test-description",
//   });
//   console.log("Doc written with ID: ", docRef.id);
// } catch (error) {
//   console.log("errors: ", error);
// }

/* 
 Delete a note from db and update UI
*/
const noteCard = document.querySelectorAll(".card-panel");

noteCard.forEach((panel) => {
  panel.lastElementChild.addEventListener("click", (e) => {
    let deleteId = e.target.parentElement.parentElement.id.toString();
    console.log(deleteId);
    e.target.parentElement.parentElement.remove();
    deleteDoc(doc(db, "notes", deleteId));
  });
});
