/* ShutterHunters V32 - fallback for BOTH existing onboarding overlays.
   No account, data, or membership records are modified. */
(()=>{'use strict';
const slides=[
 ['Great work starts<br><em>with great people.</em>','Show your photography and films. Find collaborators.'],
 ['Your work deserves<br><em>to be seen.</em>','Build your portfolio and discover projects.'],
 ['Create your profile.<br><em>Start creating.</em>','Set up your free creator profile.']];
let introStep=0,tourStep=0;
const $=id=>document.getElementById(id);
function dismiss(id){const modal=$(id);if(!modal)return;modal.hidden=true;modal.setAttribute('aria-hidden','true');modal.style.setProperty('display','none','important');document.documentElement.style.overflow='';document.body.style.overflow='';try{if(id==='sh72Welcome')localStorage.setItem('sh72_welcome_seen','1');if(id==='v12Tour')sessionStorage.setItem('sh_v12_tour_seen','1')}catch(e){}}
function openAccount(){try{if(typeof window.go==='function'){window.go('account');return}}catch(e){console.warn('Account route:',e)}const a=$('account');if(a){document.querySelectorAll('main').forEach(el=>el.classList.add('hidden'));a.classList.remove('hidden');a.hidden=false;try{a.scrollIntoView({block:'start'})}catch(e){}}}
function introNext(){const modal=$('sh72Welcome');if(!modal||modal.hidden)return;if(introStep>=2){dismiss('sh72Welcome');openAccount();return}introStep++;if($('sh72WelcomeTitle'))$('sh72WelcomeTitle').innerHTML=slides[introStep][0];if($('sh72WelcomeBody'))$('sh72WelcomeBody').textContent=slides[introStep][1];if($('sh72Step'))$('sh72Step').textContent=`0${introStep+1} / 03`;if($('sh72Next'))$('sh72Next').textContent=introStep===2?'Create free profile →':'Continue →'}
function tourNext(){const modal=$('v12Tour');if(!modal||modal.hidden)return;tourStep++;if(tourStep>=4){dismiss('v12Tour');return}const step=$('v12TourStep');if(step)step.textContent=`STEP 0${tourStep+1} / 04`;if($('v12TourNext'))$('v12TourNext').textContent=tourStep>=3?'Finish →':'Continue →'}
function handle(e){const target=e.target?.closest?.('#sh72Next,#sh72Skip,#v12TourNext,#v12TourSkip');if(!target)return;const id=target.id;const modal=id.startsWith('sh72')?$('sh72Welcome'):$('v12Tour');if(!modal||modal.hidden)return;e.preventDefault();e.stopImmediatePropagation();if(id==='sh72Skip')dismiss('sh72Welcome');else if(id==='sh72Next')introNext();else if(id==='v12TourSkip')dismiss('v12Tour');else tourNext()}
// Capture before legacy handlers, including when a tour is initialized later.
document.addEventListener('click',handle,true);
// Do not add a touchend handler: iOS synthesizes click, and processing both skips steps.
document.documentElement.dataset.shWelcomeFixVersion='32';
})();
