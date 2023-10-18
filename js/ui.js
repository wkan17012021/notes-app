document.addEventListener("DOMContentLoaded", function () {
  // nav menu  using 'M' materialize library, initialise the side navigation and have it appear on the right edge of the page
  const menus = document.querySelectorAll(".side-menu");
  M.Sidenav.init(menus, { edge: "right" });
  // add notes form
  const forms = document.querySelectorAll(".side-form");
  M.Sidenav.init(forms, {
    edge: "left",
    draggable: true,
    preventScrolling: true,
  });
  const elems = document.querySelectorAll(".parallax");
  M.Parallax.init(elems, { responsiveThreshold: 600, height: "100svh" });
});
