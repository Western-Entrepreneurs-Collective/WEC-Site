// Floating option switcher. Lives only under /options/, never on the public site.
// Collapses to a small pill, and remembers that across pages via localStorage.
(function () {
  var OPTS = [
    ['launch/',    'Kinetic'],
    ['restraint/', 'Restraint'],
    ['cohort/',    'Cohort'],
    ['bold/',      'Bold'],
    ['editorial/', 'Editorial']
  ];
  // Every option page sits one level under /options/, so ../ reaches the menu.
  var here = location.pathname.replace(/\/+$/, '/').split('/').filter(Boolean).pop() + '/';
  var KEY = 'wec-switcher-collapsed';
  var collapsed = false;
  try { collapsed = localStorage.getItem(KEY) === '1'; } catch (e) {}

  var bar = document.createElement('div');
  bar.className = 'wec-sw' + (collapsed ? ' is-min' : '');
  var inner = '<button class="wec-sw-t" aria-label="Hide the switcher">&#8722;</button>' +
              '<span class="wec-sw-list">';
  OPTS.forEach(function (o) {
    var on = o[0] === here;
    inner += '<a href="../' + o[0] + '"' + (on ? ' class="on" aria-current="page"' : '') + '>' + o[1] + '</a>';
  });
  inner += '<a class="wec-sw-all" href="../">All</a></span>' +
           '<button class="wec-sw-o" aria-label="Show the switcher">Options</button>';
  bar.innerHTML = inner;
  document.body.appendChild(bar);

  function set(v) {
    collapsed = v;
    bar.classList.toggle('is-min', v);
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {}
  }
  bar.querySelector('.wec-sw-t').addEventListener('click', function () { set(true); });
  bar.querySelector('.wec-sw-o').addEventListener('click', function () { set(false); });
})();
