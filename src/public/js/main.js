/**
 * Shared admin UI: logout confirmation (replaces browser confirm()).
 */
(function () {
  var MODAL_ID = "adminLogoutConfirm";
  var pendingUrl = "";

  function ensureModal() {
    if (document.getElementById(MODAL_ID)) return;

    var root = document.createElement("div");
    root.id = MODAL_ID;
    root.className = "admin-logout-modal";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "adminLogoutConfirmTitle");

    root.innerHTML =
      '<div class="admin-logout-modal__backdrop" data-admin-logout-dismiss tabindex="-1"></div>' +
      '<div class="admin-logout-modal__panel" role="document">' +
      '<div class="admin-logout-modal__icon" aria-hidden="true">' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>' +
      '<polyline points="16 17 21 12 16 7"/>' +
      '<line x1="21" y1="12" x2="9" y2="12"/>' +
      "</svg></div>" +
      '<h2 id="adminLogoutConfirmTitle" class="admin-logout-modal__title">Sign out?</h2>' +
      '<p class="admin-logout-modal__text">You will need to sign in again to manage jerseys and users.</p>' +
      '<div class="admin-logout-modal__actions">' +
      '<button type="button" class="admin-logout-modal__btn admin-logout-modal__btn--secondary" data-admin-logout-dismiss>Stay signed in</button>' +
      '<button type="button" class="admin-logout-modal__btn admin-logout-modal__btn--primary" id="adminLogoutConfirmGo">Sign out</button>' +
      "</div></div>";

    document.body.appendChild(root);

    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-admin-logout-dismiss]")) {
        e.preventDefault();
        closeModal();
      }
    });

    document.getElementById("adminLogoutConfirmGo").addEventListener("click", function () {
      if (pendingUrl) window.location.href = pendingUrl;
    });
  }

  function openModal(url) {
    ensureModal();
    pendingUrl = url;
    var root = document.getElementById(MODAL_ID);
    root.hidden = false;
    document.body.classList.add("admin-logout-modal--open");
    window.setTimeout(function () {
      var go = document.getElementById("adminLogoutConfirmGo");
      if (go) go.focus();
    }, 10);
  }

  function closeModal() {
    var root = document.getElementById(MODAL_ID);
    if (!root) return;
    root.hidden = true;
    document.body.classList.remove("admin-logout-modal--open");
    pendingUrl = "";
  }

  function onKeydown(e) {
    if (e.key !== "Escape") return;
    var root = document.getElementById(MODAL_ID);
    if (root && !root.hidden) {
      e.preventDefault();
      closeModal();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    ensureModal();
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a.js-admin-logout");
    if (!a) return;
    var href = a.getAttribute("href");
    if (!href) return;
    e.preventDefault();
    openModal(href);
  });

  document.addEventListener("keydown", onKeydown);
})();
