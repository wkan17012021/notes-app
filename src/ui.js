// DOM data for Materialize UI interactivity

document.addEventListener("DOMContentLoaded", function () {
  // nav menu  using 'M' materialize library, initialise the side navigation and have it appear on the right edge of the page
  const menus = document.querySelectorAll(".side-menu");
  M.Sidenav.init(menus, { edge: "right" });

  // add notes form, using 'M' materialize library, initialise the side form and have it appear on the left edge of the page
  const forms = document.querySelectorAll(".side-form");
  M.Sidenav.init(forms, {
    edge: "left",
    draggable: true,
    preventScrolling: true,
  });
  // update notes form, same as above
  const updateForm = document.querySelector(".side-form-update");
  //
  M.Sidenav.init(updateForm, {
    edge: "left",
    draggable: true,
    preventScrolling: true,
  });
  const lightBoxElms = document.querySelectorAll(".materialboxed");
  M.Materialbox.init(lightBoxElms, {
    inDuration: 300,
    outDuration: 200,
  });
});
