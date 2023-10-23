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
const noteAddBtn = document.getElementById("new-toast");

// Displaying toast if the note was added successfully
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
