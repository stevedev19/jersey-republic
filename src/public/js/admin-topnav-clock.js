/* Shared live clock for admin top nav (Home, Jerseys, Users) */
(function () {
  function formatTime(d) {
    var h = String(d.getHours()).padStart(2, '0');
    var m = String(d.getMinutes()).padStart(2, '0');
    var s = String(d.getSeconds()).padStart(2, '0');
    return h + ':' + m + ':' + s;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('adminTopnavClock');
    if (!el) return;
    function tick() {
      el.textContent = formatTime(new Date());
    }
    tick();
    setInterval(tick, 1000);
  });
})();
