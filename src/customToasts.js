/* 
to initialize on page load
Toastify({
    text: "New Note added!",
    color: 'black',
    duration: 2000,
    newWindow: true,
    close: false,
    gravity: "top", 
    position: "right",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #000, var(--title))",
      borderRadius: "8px",
    },
    onClick: function(){} // Callback after click
  }).showToast();
*/

/* 
to initialize on button click
const noteAddBtn = document.getElementById("new-toast");

noteAddBtn.addEventListener("click", function () {
  Toastify({
    text: "New Note added!",
    color: "black",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #000, var(--title))",
      borderRadius: "8px",
    },
  }).showToast();
});

*/

export const successLoginToast = () => {
  Toastify({
    text: "Welcome to the Notes app!",
    color: "black",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #000, var(--title))",
      borderRadius: "8px",
    },
  }).showToast();
};

export const successSignUpToast = () => {
  Toastify({
    text: "Successfully Registered. Welcome!",
    color: "black",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #000, var(--title))",
      borderRadius: "8px",
    },
  }).showToast();
};

export const successToast = () => {
  Toastify({
    text: "New Note added!",
    color: "black",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #000, var(--title))",
      borderRadius: "8px",
    },
  }).showToast();
};

export const successUpdateToast = () => {
  Toastify({
    text: "Note updated!",
    color: "black",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #000, var(--title))",
      borderRadius: "8px",
    },
  }).showToast();
};

export const errorToast = () => {
  Toastify({
    text: "Please check note details and try again.",
    color: "black",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, var(--title), red)",
      borderRadius: "8px",
    },
  }).showToast();
};

// Displaying toast if the note was added successfully
export const errorLoginToast = () => {
  Toastify({
    text: "The email/password is incorrect. Please try again.",
    color: "black",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, var(--title), red)",
      borderRadius: "8px",
    },
  }).showToast();
};
