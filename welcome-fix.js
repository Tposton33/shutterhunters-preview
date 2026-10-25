/* ShutterHunters V30 welcome screen fix — add to index.html immediately before </body>.
   This is independent of top-five-matches.js and does not change membership status. */
(function () {
  'use strict';
  function setup() {
    const modal = document.getElementById('sh72Welcome');
    if (!modal || modal.dataset.sh30Bound === 'true') return;
    modal.dataset.sh30Bound = 'true';
    const next = document.getElementById('sh72Next');
    const skip = document.getElementById('sh72Skip');
    if (!next || !skip) return;
    const pages = [
      ['Great work starts<br><em>with great people.</em>', 'Show your photography and films. Find collaborators. Get discovered for your next project.'],
      ['Your work deserves<br><em>to be seen.</em>', 'Build your creative portfolio and find real opportunities.'],
      ['Create your free profile.<br><em>Start creating.</em>', 'Set up your profile to get discovered. The 7-day Pro trial is not active yet.']
    ];
    let current = 0;
    function dismiss() {
      modal.hidden = true;
      modal.style.setProperty('display', 'none', 'important');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      try {
        localStorage.setItem('sh72_welcome_seen', '1');
        sessionStorage.setItem('sh72_preview_seen', '1');
      } catch (_) {}
    }
    function draw() {
      const title = document.getElementById('sh72WelcomeTitle');
      const body = document.getElementById('sh72WelcomeBody');
      const step = document.getElementById('sh72Step');
      if (title) title.innerHTML = pages[current][0];
      if (body) body.textContent = pages[current][1];
      if (step) step.textContent = '0' + (current + 1) + ' / 03';
      next.textContent = current === 2 ? 'Create free profile →' : 'Continue →';
    }
    function handle(event) {
      const button = event.target.closest && event.target.closest('#sh72Next, #sh72Skip');
      if (!button || !modal.contains(button) || modal.hidden) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (button.id === 'sh72Skip') { dismiss(); return; }
      if (current < 2) { current++; draw(); return; }
      dismiss();
      if (typeof window.go === 'function') window.go('account');
      else {
        const account = document.getElementById('account');
        if (account) { document.querySelectorAll('main').forEach(m => m.classList.add('hidden')); account.classList.remove('hidden'); }
      }
    }
    window.addEventListener('click', handle, true);
    // The original intro may have marked this browser complete already.
    try { if (localStorage.getItem('sh72_welcome_seen') === '1') dismiss(); } catch (_) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
})();
