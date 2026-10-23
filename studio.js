/* ShutterHunters Creator Studio · Public browser client. No secret keys in this file. */
(()=>{
'use strict';
const cfg=window.SHUTTERHUNTERS_CONFIG||{};
const ready=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase);
const $=id=>document.getElementById(id);
const notice=$('connectionNotice'),guest=$('accountGuest'),member=$('accountMember'),msg=$('accountMessage');
const choices=['Weddings','Commercial','Real Estate','Events','Portraits','Sports','Music Videos','Automotive','Drone','Fashion','Product','Documentary','Travel','Food','Wildlife','Other'];
let v5Media=[],v5Filter='video';
let client=null,user=null,profile=null,viewed=null,mode='received',publicList=[],creatorCache=new Map();
const say=(s)=>{msg.textContent=s};
const billingStatus=()=>document.getElementById('stripeBillingStatus');
function billingMessage(message){const el=billingStatus();if(el)el.textContent=message;}
const billingConfigured=()=>Boolean(cfg.stripeSandboxEnabled===true);
async function billingRequest(functionName,body={}){
  if(!billingConfigured())throw new Error('Sandbox checkout is not configured. Complete V11 setup first.');
  const {data:{session},error:authErr}=await client.auth.getSession();
  if(authErr||!session?.access_token)throw new Error('Sign in to your ShutterHunters account first.');
  const base=cfg.supabaseUrl.replace(/\/$/,'');
  const result=await fetch(`${base}/functions/v1/${functionName}`,{
    method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`,'apikey':cfg.supabaseAnonKey},
    body:JSON.stringify(body)
  });
  let json={};try{json=await result.json()}catch{}
  if(!result.ok||!json.url)throw new Error(json.error||`Billing service returned HTTP ${result.status}`);
  const next=new URL(json.url);
  if(next.protocol!=='https:'||!['checkout.stripe.com','billing.stripe.com'].includes(next.hostname))throw new Error('Unexpected billing destination');
  window.location.assign(next.href);
}
function initSandboxBilling(){
  const pro=document.getElementById('stripeProCheckout'),studio=document.getElementById('stripeStudioCheckout'),portal=document.getElementById('stripeBillingPortal');
  if(!pro||!studio||!portal)return;
  if(!billingConfigured()){
    for(const b of [pro,studio,portal])b.disabled=true;
    billingMessage('V11 sandbox integration preview. Complete secure server deployment and set stripeSandboxEnabled in config.js before testing checkout.');
    return;
  }
  billingMessage('SANDBOX ONLY · Stripe test cards · No real charges. Paid visibility and messaging are not enabled.');
  for(const [button,plan] of [[pro,'pro'],[studio,'studio']])button.addEventListener('click',async()=>{
    button.disabled=true;billingMessage('Opening secure Stripe test checkout…');
    try{await billingRequest('stripe-checkout',{plan})}catch(e){billingMessage(e.message);button.disabled=false}
  });
  portal.addEventListener('click',async()=>{portal.disabled=true;billingMessage('Opening subscription management…');try{await billingRequest('stripe-portal')}catch(e){billingMessage(e.message);portal.disabled=false}});
  const q=new URLSearchParams(location.search),state=q.get('stripe_status');
  if(state==='success'||state==='cancel'){
    billingMessage(state==='success'?'Checkout returned. Membership changes can take a moment to sync; refresh My Account.':'Test checkout was cancelled. No membership change was made.');
    q.delete('stripe_status');history.replaceState({},'',location.pathname+(q.size?'?'+q.toString():'')+location.hash);
  }
}
initSandboxBilling();

const text=(tag,value,cls)=>{const n=document.createElement(tag);if(cls)n.className=cls;n.textContent=value??'';return n};
const validLink=s=>{try{const u=new URL(s);return /^https?:$/.test(u.protocol)?u.href:null}catch{return null}};
async function loadMembership(){
 const level=$('membershipLevel'),detail=$('membershipDetail');if(!level||!detail)return;
 if(!user){level.textContent='Free membership';detail.textContent='Sign in to view your membership.';return}
 const {data,error}=await client.from('creator_memberships').select('tier,status,current_period_end').eq('user_id',user.id).maybeSingle();
 if(error){level.textContent='Membership unavailable';detail.textContent='Run V10_MEMBERSHIPS.sql in Supabase to enable account status. No payment is active.';return}
 const active=data?.status==='active'&&['pro','studio'].includes(data?.tier);
 level.textContent=active?(data.tier==='studio'?'Studio membership':'Pro membership'):'Free membership';
 detail.textContent=active?'Status: active · Stripe sandbox subscription (test only).':'Free plan · Stripe sandbox upgrade testing available on the Membership page.';
}
function updateMenu(){ $('studioGuest').classList.toggle('hidden',!!user);$('studioMember').classList.toggle('hidden',!user);$('inquiryGuest').classList.toggle('hidden',!!user);$('inquiryMember').classList.toggle('hidden',!user);}
function buildChoices(){const container=$('specialtyChoices');for(const c of choices){const lbl=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';cb.value=c;cb.name='extraSpecialty';lbl.append(cb,document.createTextNode(c));container.append(lbl)}}
buildChoices();
function studioTab(tab){for(const t of ['posts','details','reviews']){const el=$(t==='posts'?'studioPostsTab':t==='details'?'studioDetailsTab':'studioReviewsTab');el.classList.toggle('hidden',t!==tab)}document.querySelectorAll('[data-studio-tab]').forEach(b=>b.classList.toggle('on',b.dataset.studioTab===tab))}
document.querySelectorAll('[data-studio-tab]').forEach(b=>b.addEventListener('click',()=>studioTab(b.dataset.studioTab)));
$('postMediaForm').querySelectorAll('input[name="postType"]').forEach(r=>r.addEventListener('change',()=>{$('postMediaFile').accept=r.value==='video'?'video/mp4,video/webm,video/quicktime,.mov,.mp4,.webm':'image/jpeg,image/png,image/webp';$('postMediaFile').value='';$('postVideoCoverRow').hidden=r.value!=='video';$('postVideoCover').value=''}));

function specialtiesOf(p){const values=[p?.specialty,...(Array.isArray(p?.specialties)?p.specialties:typeof p?.specialties==='string'?p.specialties.replace(/[{}]/g,'').split(','):[])];return [...new Set(values.map(x=>String(x||'').trim()).filter(Boolean))]}
function primaryAndSelected(f){const primary=String(f.get('specialty')||'Weddings');return [primary,...[...$('specialtyChoices').querySelectorAll('input:checked')].map(x=>x.value).filter(x=>x!==primary)]}
function fillForm(p){const f=$('onlineProfileForm');for(const [key,val] of Object.entries(p)){const el=f.elements.namedItem(key);if(!el||key==='specialties')continue;if(el.type==='checkbox')el.checked=!!val;else el.value=val??''}const set=new Set(p.specialties||[]);$('specialtyChoices').querySelectorAll('input').forEach(x=>x.checked=set.has(x.value));}
function showStudio(){if(!user)return;$('studioProfileSummary').replaceChildren();const p=profile;const summary=$('studioProfileSummary');if(!p){summary.append(text('p','First, add your name, location, main specialty and rate in My Account. Then upload your creative work below.'));return}summary.append(text('h3',p.display_name),text('p',p.role+' · '+p.city+', '+p.state),text('p',specialtiesOf(p).join('  ·  ')));if(!p.is_public)summary.append(text('p','Private profile — turn on Publish in My Account when ready.'))}
async function updateAuth(){const {data,error}=await client.auth.getUser();const before=user?.id;user=error?null:data.user;if(before!==user?.id){shActiveInquiry=null;const thread=$('shThread');if(thread)thread.hidden=true;}guest.classList.toggle('hidden',!!user);member.classList.toggle('hidden',!user);updateMenu();shSyncAccountMenu();if(!user){profile=null;v12ThemeLoadedFor=null;$('v12ThemePanel').hidden=true;loadMembership();v111LoadPlan();v111LoadSaved();return}$('signedInAs').textContent=user.email||'Signed in';await loadMembership();await v111LoadPlan();await v111LoadSaved();if(before!==user.id||!v12ThemeLoadedFor||v12ThemeLoadedFor!==user.id){v12ThemeLoadedFor=user.id;await v12LoadMyExperience()}if(before!==user.id||!profile){const q=await client.from('profiles').select('*').eq('id',user.id).maybeSingle();if(q.error){say('Could not load your profile: '+q.error.message);return}profile=q.data; if(profile)fillForm(profile);showStudio();await loadMyMedia();await updateInquiryBadge()}else{await loadMyMedia()}}
async function refreshProfile(){if(!user)return;const {data,error}=await client.from('profiles').select('*').eq('id',user.id).maybeSingle();if(!error){profile=data;if(profile)fillForm(profile);showStudio();await updateInquiryBadge()}}
const forms=[$('signupForm'),$('loginForm')];
if(!ready){forms.forEach(f=>f.querySelectorAll('input,button').forEach(x=>x.disabled=true));notice.textContent='Account configuration is missing. Upload config.js containing only your public Supabase project URL and publishable key.';return}
// Capture the incoming recovery callback BEFORE supabase-js consumes/removes URL tokens.
const incomingRecoveryParams=new URLSearchParams(window.location.search);
const recoveryReturnRequested=incomingRecoveryParams.get('sh_reset')==='1';
const incomingRecoveryHash=new URLSearchParams(window.location.hash.replace(/^#/,''));
const incomingRecoveryToken=incomingRecoveryHash.get('type')==='recovery'?incomingRecoveryHash.get('access_token'):null;
let pendingRecoverySession=null;
let recoveryUiReady=false;
client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
// Register immediately: Supabase may emit PASSWORD_RECOVERY during client initialization.
client.auth.onAuthStateChange((event,session)=>{
  if(event==='PASSWORD_RECOVERY'&&session?.user){
    pendingRecoverySession=session;
    if(recoveryUiReady)showRecovery(session.user.email||'');
  }
  setTimeout(updateAuth,0);
});
notice.textContent='Connected to ShutterHunters accounts. Create your studio, upload work, and manage inquiries.';
forms[0].addEventListener('submit',async e=>{e.preventDefault();say('Creating your account…');const f=new FormData(e.target);const {error}=await client.auth.signUp({email:String(f.get('email')),password:String(f.get('password')),options:{emailRedirectTo:location.origin+location.pathname}});say(error?error.message:'Account requested. Check your inbox for a confirmation email if required.');if(!error)await updateAuth()});
forms[1].addEventListener('submit',async e=>{e.preventDefault();say('Signing in…');const f=new FormData(e.target);const {error}=await client.auth.signInWithPassword({email:String(f.get('email')),password:String(f.get('password'))});say(error?error.message:'Signed in! Your creator studio is ready.');if(!error){await updateAuth();go('studio')}});

// Password recovery: request via Supabase and show a dedicated password reset form
// only when a verified PASSWORD_RECOVERY event arrives from supabase-js.
const forgotButton=document.createElement('button');
forgotButton.type='button';forgotButton.textContent='Forgot password?';
forgotButton.className='filter';forgotButton.style.marginTop='12px';
forms[1].insertAdjacentElement('afterend',forgotButton);
const recoveryBox=document.createElement('div');
recoveryBox.id='shPasswordRecovery';
recoveryBox.setAttribute('role','dialog');
recoveryBox.setAttribute('aria-modal','true');
recoveryBox.setAttribute('aria-labelledby','shRecoveryTitle');
recoveryBox.style.cssText='position:fixed;inset:0;z-index:99999;background:#081416eb;display:none;align-items:center;justify-content:center;padding:16px;overflow-y:auto';
recoveryBox.innerHTML=`<section style="background:#fffaf1;color:#1b2929;padding:clamp(20px,4vw,38px);border-radius:14px;max-width:460px;width:100%;box-shadow:0 18px 60px #0008"><div style="font-size:12px;letter-spacing:2px;color:#916329;font-weight:700">SHUTTERHUNTERS ACCOUNT SECURITY</div><h2 id="shRecoveryTitle" style="margin:14px 0 8px">Create a new password.</h2><p id="shRecoveryFor" style="overflow-wrap:anywhere"></p><form id="shRecoveryForm"><label style="display:block;margin:14px 0 5px" for="shNewPassword">New password</label><input id="shNewPassword" type="password" autocomplete="new-password" minlength="8" required style="width:100%;padding:13px;border:1px solid #b3a591;border-radius:5px"><label style="display:block;margin:14px 0 5px" for="shConfirmPassword">Confirm new password</label><input id="shConfirmPassword" type="password" autocomplete="new-password" minlength="8" required style="width:100%;padding:13px;border:1px solid #b3a591;border-radius:5px"><button id="shRecoverySave" type="submit" style="background:#daa766;color:#152323;border:0;border-radius:5px;padding:13px 17px;font-weight:750;margin-top:18px;cursor:pointer">Save new password</button></form><p id="shRecoveryMessage" role="status" aria-live="polite" style="font-size:14px;margin:14px 0 0"></p></section>`;
document.body.append(recoveryBox);
let recoveryAuthorized=false;
let recoveryUserId=null;
function showRecovery(email){
  recoveryAuthorized=true;recoveryUserId=pendingRecoverySession?.user?.id||null;recoveryBox.style.display='flex';
  $('shRecoveryFor').textContent=email?'Resetting password for '+email:'Securely update your account password.';
  $('shRecoveryMessage').textContent='Your recovery link is verified. Choose a new password.';
  $('shNewPassword').focus();
}
forgotButton.addEventListener('click',async()=>{
  const email=String(forms[1].elements.namedItem('email').value||'').trim();
  if(!email){say('Enter your email address in the Sign In form, then click Forgot password?');forms[1].elements.namedItem('email').focus();return}
  forgotButton.disabled=true;say('Requesting password recovery email…');
  const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname+'?sh_reset=1'});
  say(error?'Could not send recovery email: '+error.message:'If that address belongs to an account, a password recovery email will arrive shortly. Open the latest link in an Incognito window.');
  forgotButton.disabled=false;
});
$('shRecoveryForm').addEventListener('submit',async event=>{
  event.preventDefault();
  if(!recoveryAuthorized)return;
  const password=$('shNewPassword').value, confirmation=$('shConfirmPassword').value;
  const message=$('shRecoveryMessage');
  if(password.length<8){message.textContent='Use a password with at least 8 characters.';return}
  if(password!==confirmation){message.textContent='Your passwords do not match.';return}
  const button=$('shRecoverySave');button.disabled=true;message.textContent='Checking recovery authorization…';
  const current=await client.auth.getUser();
  if(current.error||!recoveryUserId||current.data?.user?.id!==recoveryUserId){
    recoveryAuthorized=false;message.textContent='Recovery account mismatch. No password was changed. Request a new recovery link in a private browser window.';button.disabled=false;return;
  }
  message.textContent='Saving your new password…';
  const {error}=await client.auth.updateUser({password});
  if(error){message.textContent='Could not reset password: '+error.message;button.disabled=false;return}
  recoveryAuthorized=false;recoveryUserId=null;
  message.textContent='Password changed successfully! You can now sign in using your new password.';
   if(recoveryReturnRequested){const u=new URL(location.href);u.searchParams.delete('sh_reset');u.searchParams.delete('code');history.replaceState({},'',u.pathname+u.search+u.hash);}
  $('shRecoveryForm').style.display='none';
  const signInBtn=document.createElement('button');signInBtn.type='button';signInBtn.textContent='Return to sign in';
  signInBtn.style.cssText='background:#daa766;color:#152323;border:0;border-radius:5px;padding:13px 17px;font-weight:750;margin-top:18px;cursor:pointer';
  signInBtn.addEventListener('click',async()=>{
    await client.auth.signOut();recoveryBox.style.display='none';
    go('account');await updateAuth();
  });
  message.insertAdjacentElement('afterend',signInBtn);
});

$('signoutBtn').addEventListener('click',async()=>{const {error}=await client.auth.signOut();say(error?error.message:'Signed out.');await updateAuth();go('discover')});
// Accessible global account menu: avoid hiding logout in the edit-profile form.
const shAccountActions=$('shAccountActions'),shAccountMenu=$('shAccountMenu'),shAccountToggle=$('shAccountToggle');
function shCloseAccountMenu(){shAccountMenu.classList.add('hidden');shAccountToggle.setAttribute('aria-expanded','false')}
function shSyncAccountMenu(){shAccountActions.classList.toggle('hidden',!user);$('shAccountEmail').textContent=user?.email||'';if(!user)shCloseAccountMenu()}
shAccountToggle.addEventListener('click',()=>{const next=shAccountMenu.classList.toggle('hidden');shAccountToggle.setAttribute('aria-expanded',String(!next))});
$('shAccountDetails').addEventListener('click',()=>{shCloseAccountMenu();go('account')});
$('shAccountMembership').addEventListener('click',()=>{shCloseAccountMenu();go('membership')});
$('shAccountSignout').addEventListener('click',async()=>{
 const button=$('shAccountSignout');button.disabled=true;$('shAccountMenuStatus').textContent='Signing out…';
 try{const {error}=await client.auth.signOut();if(error)throw error;shCloseAccountMenu();await updateAuth();go('discover');}
 catch(error){$('shAccountMenuStatus').textContent='Could not sign out: '+error.message;}
 finally{button.disabled=false;}
});
document.addEventListener('click',event=>{if(!shAccountActions.contains(event.target))shCloseAccountMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')shCloseAccountMenu()});

$('onlineProfileForm').addEventListener('submit',async e=>{e.preventDefault();if(!user)return say('Sign in first.');const f=new FormData(e.target);const additional=primaryAndSelected(f);const data={id:user.id,display_name:String(f.get('display_name')||'').trim(),city:String(f.get('city')||'').trim(),state:String(f.get('state')||'').trim().toUpperCase(),role:String(f.get('role')),specialty:String(f.get('specialty')),specialties:additional,bio:String(f.get('bio')||''),hourly_rate:f.get('hourly_rate')?Number(f.get('hourly_rate')):null,portfolio_url:validLink(String(f.get('portfolio_url')||'')),instagram_url:validLink(String(f.get('instagram_url')||'')),avatar_url:validLink(String(f.get('avatar_url')||'')),is_public:f.has('is_public'),available_for_second_shooting:f.has('available_for_second_shooting')};if(profile?.cover_url)data.cover_url=profile.cover_url;
 say('Saving your studio…');const {error}=await client.from('profiles').upsert(data,{onConflict:'id'});if(error)return say('Could not save profile: '+error.message+' — did you run the v2 SQL migration?');say('Profile saved! '+(data.is_public?'Anyone can discover your work.':'It remains private.'));await refreshProfile();await loadCreators();});
// Storage uploads must use per-user folders and Supabase Storage RLS. Never put private files in a public bucket.
const fileName=(f)=>{const ext=(f.name.split('.').pop()||'bin').toLowerCase();const clean=ext.replace(/[^a-z0-9]/g,'');return crypto.randomUUID()+'.'+clean};
// Supabase Free has a fixed 50 MiB per-object limit. Leave headroom for metadata.
const MAX_VIDEO_BYTES=48*1024*1024;
async function prepareVideoForUpload(file){
  if(file.size<=MAX_VIDEO_BYTES)return file;
  const status=$('postMediaStatus');
  const report=message=>{if(status)status.textContent=message};
  if(typeof MediaRecorder==='undefined'||!HTMLCanvasElement.prototype.captureStream){
    throw Error('This browser cannot compress video locally. Please export an H.264 MP4 under 48 MB or try a browser that supports video recording.');
  }
  const candidates=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  const mime=candidates.find(x=>MediaRecorder.isTypeSupported(x));
  if(!mime)throw Error('Automatic video compression is not supported on this device. Export an MP4 smaller than 48 MB.');
  const url=URL.createObjectURL(file),video=document.createElement('video'),canvas=document.createElement('canvas');
  video.playsInline=true;video.preload='auto';video.crossOrigin='anonymous';
  let audioCtx=null,paintId=0,stream=null,recorder=null;
  try{
    video.src=url;
    await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Could not read this video. Try MP4 format.')),25000);video.onloadedmetadata=()=>{clearTimeout(timer);resolve()};video.onerror=()=>{clearTimeout(timer);reject(Error('This video format is not supported for compression on this device.'))};video.load()});
    const duration=video.duration;
    if(!Number.isFinite(duration)||duration<=0||duration>600)throw Error('Automatic compression supports clips up to 10 minutes.');
    const scale=Math.min(1,1280/Math.max(1,video.videoWidth),720/Math.max(1,video.videoHeight));
    canvas.width=Math.max(2,Math.round(video.videoWidth*scale/2)*2);canvas.height=Math.max(2,Math.round(video.videoHeight*scale/2)*2);
    const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw Error('Video compression needs canvas support.');
    const fps=24;
    stream=canvas.captureStream(fps);
    // Route audio into the recording, not the speakers. Never silently strip soundtrack.
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx)throw Error('This browser cannot preserve audio during local compression. Export MP4 under 48 MB instead.');
    audioCtx=new AudioCtx();
    const source=audioCtx.createMediaElementSource(video),destination=audioCtx.createMediaStreamDestination(),silent=audioCtx.createGain();
    silent.gain.value=0;source.connect(destination);source.connect(silent);silent.connect(audioCtx.destination);
    const audioTracks=destination.stream.getAudioTracks();
    if(!audioTracks.length)throw Error('This browser cannot capture the video audio.');
    audioTracks.forEach(track=>stream.addTrack(track));
    if(audioCtx.state==='suspended')await audioCtx.resume();
    // Aim for substantially less than 48 MiB to accommodate variable encoder rates.
    const targetBits=Math.min(2_400_000,Math.max(340_000,Math.floor((42*1024*1024*8)/duration)-128_000));
    const chunks=[];
    recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:targetBits,audioBitsPerSecond:96_000});
    const recording=new Promise((resolve,reject)=>{recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};recorder.onerror=e=>reject(Error(e.error?.message||'Video compression failed.'));recorder.onstop=()=>resolve()});
    let ended=false;
    video.onended=()=>{ended=true;if(recorder.state!=='inactive')recorder.stop()};
    video.onerror=()=>{if(recorder.state!=='inactive')recorder.stop()};
    const paint=()=>{if(!ended){try{ctx.drawImage(video,0,0,canvas.width,canvas.height)}catch{}paintId=requestAnimationFrame(paint)}};
    report('Preparing a smaller video. This takes about as long as the clip; keep ShutterHunters open…');
    recorder.start(1000);paint();
    try{await video.play()}catch{throw Error('Your browser blocked local video processing. Try exporting an MP4 under 48 MB.')}
    const progress=setInterval(()=>report('Compressing video: '+Math.min(99,Math.floor(video.currentTime/duration*100))+'% — keep this page open.'),1200);
    try{await Promise.race([recording,new Promise((_,reject)=>setTimeout(()=>reject(Error('Video compression timed out.')),Math.max(90000,duration*3000)))])}finally{clearInterval(progress)}
    const outputType=recorder.mimeType||mime;const ext=outputType.includes('mp4')?'mp4':'webm';
    const blob=new Blob(chunks,{type:outputType.split(';')[0]});
    if(!blob.size)throw Error('Video compression produced an empty file.');
    if(blob.size>MAX_VIDEO_BYTES)throw Error('Video is still larger than 48 MB after compression. Trim the clip or export a smaller MP4.');
    report('Video compressed to '+(blob.size/1048576).toFixed(1)+' MB. Uploading…');
    return new File([blob],(file.name.replace(/\.[^.]+$/,'')||'video')+'-optimized.'+ext,{type:blob.type});
  }finally{
    cancelAnimationFrame(paintId);video.pause();video.removeAttribute('src');video.load();
    if(recorder?.state==='recording')recorder.stop();stream?.getTracks().forEach(track=>track.stop());
    if(audioCtx)audioCtx.close().catch(()=>{});URL.revokeObjectURL(url);canvas.width=canvas.height=0;
  }
}
async function optimizePhoto(file){
  if(file.size>150*1024*1024)throw Error('This image is unusually large (over 150 MB). Choose a smaller source file.');
  const objectUrl=URL.createObjectURL(file);
  let image;
  try{
    image=await new Promise((resolve,reject)=>{
      const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('This image format could not be opened by your browser. Try JPG, PNG or WebP.'));img.src=objectUrl;
    });
    let edge=2600,quality=.88;
    for(let attempt=0;attempt<9;attempt++){
      const scale=Math.min(1,edge/Math.max(image.naturalWidth,image.naturalHeight));
      const width=Math.max(1,Math.round(image.naturalWidth*scale));
      const height=Math.max(1,Math.round(image.naturalHeight*scale));
      const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
      const ctx=canvas.getContext('2d');if(!ctx)throw Error('Photo processing is not supported in this browser.');
      ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);
      ctx.drawImage(image,0,0,width,height);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
      canvas.width=0;canvas.height=0;
      if(!blob)throw Error('Could not prepare this photo for upload.');
      if(blob.size<=4.5*1024*1024)return new File([blob],(file.name.replace(/\.[^.]+$/,'')||'photo')+'.jpg',{type:'image/jpeg'});
      if(quality>.60)quality-=.12;else edge=Math.round(edge*.75);
    }
    throw Error('Could not reduce the photo sufficiently. Try a smaller source image.');
  } finally {URL.revokeObjectURL(objectUrl)}
}
async function uploadToStorage(file,kind){
  if(!user||!profile)throw Error('Save your creator profile first.');
  const isVideo=kind==='video';
  let prepared=isVideo?await prepareVideoForUpload(file):file;
  if(!isVideo){
    if(!file.type.startsWith('image/'))throw Error('Choose an image file.');
    prepared=await optimizePhoto(file);
  }
  const mime=(prepared.type||'').toLowerCase();
  if(isVideo&&!['video/mp4','video/webm','video/quicktime'].includes(mime)&&!(/\.(mov|mp4|webm)$/i.test(prepared.name)))throw Error('Use MP4, MOV or WebM video.');
  if(isVideo&&prepared.size>MAX_VIDEO_BYTES)throw Error('Video exceeds the current 48 MB upload limit.');
  const path=user.id+'/'+kind+'/'+fileName(prepared);
  if(isVideo){
    if(!window.tus?.Upload)throw Error('Resumable upload library could not load. Check your internet connection and refresh.');
    const {data:session,error:authError}=await client.auth.getSession();
    if(authError||!session?.session?.access_token)throw Error('Your login expired. Sign in again.');
    const endpoint=cfg.supabaseUrl.replace(/\/$/,'')+'/storage/v1/upload/resumable';
    const contentType=mime||(/\.mov$/i.test(file.name)?'video/quicktime':'video/mp4');
    await new Promise((resolve,reject)=>{
      const upload=new window.tus.Upload(prepared,{
        endpoint,chunkSize:6*1024*1024,retryDelays:[0,1000,3000,5000,10000],
        uploadDataDuringCreation:true,removeFingerprintOnSuccess:true,
        headers:{authorization:'Bearer '+session.session.access_token,apikey:cfg.supabaseAnonKey,'x-upsert':'false'},
        metadata:{bucketName:'creator-media',objectName:path,contentType,cacheControl:'3600'},
        onError:error=>reject(Error(error.message||String(error))),
        onProgress:(sent,total)=>{const status=$('postMediaStatus');if(status)status.textContent='Uploading video: '+Math.floor(sent/total*100)+'% — keep this page open.'},
        onSuccess:()=>resolve()
      });
      upload.findPreviousUploads().then(previous=>{if(previous.length)upload.resumeFromPreviousUpload(previous[0]);upload.start()}).catch(reject);
    });
  }else{
    const {error}=await client.storage.from('creator-media').upload(path,prepared,{contentType:mime,cacheControl:'3600',upsert:false});
    if(error)throw Error(error.message);
  }
  const {data}=client.storage.from('creator-media').getPublicUrl(path);
  return {path,url:data.publicUrl};
}
async function uploadPortrait(input,field,kind,statusId){const f=input.files?.[0];if(!f)return;const status=$(statusId);status.textContent='Preparing photo and uploading…';try{const res=await uploadToStorage(f,kind);const {error}=await client.from('profiles').update({[field]:res.url}).eq('id',user.id);if(error)throw Error(error.message);status.textContent='Saved!';if(field==='avatar_url')$('onlineProfileForm').elements.avatar_url.value=res.url;await refreshProfile();await loadCreators()}catch(err){status.textContent='Upload failed: '+err.message}finally{input.value=''}}
$('avatarUpload').addEventListener('change',e=>uploadPortrait(e.target,'avatar_url','avatar','avatarStatus'));
$('coverUpload').addEventListener('change',e=>uploadPortrait(e.target,'cover_url','cover','coverStatus'));
// V7: capture a frame when the browser can decode the source; MOV codecs may need a custom cover.
async function captureVideoCover(file){
  const url=URL.createObjectURL(file),video=document.createElement('video');
  video.muted=true;video.playsInline=true;video.preload='auto';
  try{return await new Promise(resolve=>{
    let settled=false;const finish=blob=>{if(!settled){settled=true;resolve(blob)}};
    const timeout=setTimeout(()=>finish(null),9000);
    video.onerror=()=>{clearTimeout(timeout);finish(null)};
    video.onloadedmetadata=()=>{try{video.currentTime=Math.min(1,Math.max(0,(video.duration||1)*.15))}catch{clearTimeout(timeout);finish(null)}};
    video.onseeked=()=>{try{const w=video.videoWidth,h=video.videoHeight;if(!w||!h)throw Error('No video frame');const c=document.createElement('canvas');const scale=Math.min(1,1000/Math.max(w,h));c.width=Math.round(w*scale);c.height=Math.round(h*scale);c.getContext('2d').drawImage(video,0,0,c.width,c.height);c.toBlob(blob=>{clearTimeout(timeout);finish(blob)},'image/jpeg',.83)}catch{clearTimeout(timeout);finish(null)}};
    video.src=url;video.load();
  })}finally{video.removeAttribute('src');video.load();URL.revokeObjectURL(url)}
}
async function saveVideoCover(mediaId,source){
 if(!source)throw Error('Choose a JPG, PNG or WebP cover.');
 if(!source.type.startsWith('image/'))throw Error('Choose an image for the video cover.');
 const prepared=await optimizePhoto(source);
 const path=user.id+'/covers/'+fileName(prepared);
 const {error:uploadError}=await client.storage.from('creator-media').upload(path,prepared,{contentType:'image/jpeg',cacheControl:'3600',upsert:false});
 if(uploadError)throw Error('Cover upload failed: '+uploadError.message);
 const {data}=client.storage.from('creator-media').getPublicUrl(path);
 const {error}=await client.from('portfolio_media').update({thumbnail_url:data.publicUrl}).eq('id',mediaId).eq('user_id',user.id);
 if(error){await client.storage.from('creator-media').remove([path]);throw Error('Could not save cover. Run V7_COVERS.sql first: '+error.message)}
 return data.publicUrl;
}
async function uploadOnePortfolio(file,kind,caption='',coverFile=null){
 if(!user||!profile)throw Error('Save your creator profile before publishing.');
 const {data,error}=await client.from('portfolio_media').select('media_type').eq('user_id',user.id);
 if(error)throw Error('Could not read portfolio: '+error.message);
 const count=(data||[]).filter(m=>m.media_type===kind).length, max=kind==='video'?3:12;
 if(count>=max)throw Error('Your '+(kind==='video'?'3-video':'12-photo')+' limit is reached. Remove an old item to post a new one.');
 const res=await uploadToStorage(file,kind);
 const {data:inserted,error:dbErr}=await client.from('portfolio_media').insert({user_id:user.id,media_type:kind,storage_path:res.path,media_url:res.url,title:String(caption||'').trim().slice(0,100),caption:String(caption||'').trim().slice(0,500),sort_order:count}).select('id').single();
 if(dbErr){await client.storage.from('creator-media').remove([res.path]);throw Error(dbErr.message+' — check that PROFILE_HUB_v4.sql has run.');}
 if(kind==='video'){try{let cover=coverFile;if(!cover){const frame=await captureVideoCover(file);if(frame)cover=new File([frame],'video-cover.jpg',{type:'image/jpeg'})}if(cover)await saveVideoCover(inserted.id,cover)}catch(e){console.warn('Video published, but cover could not be set:',e);$('postMediaStatus').textContent='Video published, but cover failed: '+e.message+' — add it from My Posts.'}}
 return true;
}
$('postMediaForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget,file=$('postMediaFile').files?.[0],kind=String(new FormData(f).get('postType')||'image'),caption=String(new FormData(f).get('caption')||'').trim(),status=$('postMediaStatus'),btn=$('publishPostBtn');if(!file||!caption){status.textContent='Choose a file and add its description.';return}if(kind==='video'&&!file.type.startsWith('video/')&&!/\.(mov|mp4|webm)$/i.test(file.name)){status.textContent='Choose a video for a video post.';return}if(kind==='image'&&!file.type.startsWith('image/')){status.textContent='Choose a photo for a photo post.';return}btn.disabled=true;status.textContent=kind==='video'?'Preparing video for upload…':'Uploading your photo…';try{await uploadOnePortfolio(file,kind,caption,kind==='video'?$('postVideoCover').files?.[0]:null);status.textContent='Published! View it below or on your public profile.';f.reset();$('postMediaFile').accept='image/jpeg,image/png,image/webp';$('postVideoCoverRow').hidden=true;await loadMyMedia()}catch(err){status.textContent='Could not publish: '+err.message}finally{btn.disabled=false}});
// V11.2: render each underlying media asset only once. Never modify portfolio_media rows.
let myMediaLoadSequence=0;
function uniqueMyMediaPosts(rows){
 const seen=new Set();
 return (rows||[]).filter(m=>{
  // Keep genuinely different uploads even if they share a caption or filename.
  const identity=String(m.storage_path||m.media_url||m.id||'').trim();
  const key=String(m.media_type||'')+'|'+identity;
  if(seen.has(key))return false;
  seen.add(key);
  return true;
 });
}
function v133EditStory(post){
 let modal=document.getElementById('v133EditDialog');
 if(!modal){
  modal=document.createElement('div');modal.className='v133-editor';modal.id='v133EditDialog';modal.hidden=true;
  const panel=document.createElement('section');panel.className='v133-editor-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','v133EditHeading');
  const title=text('h2','Edit your story');title.id='v133EditHeading';
  const helper=text('p','Your full description will be saved to this post. 500 characters maximum.');
  const form=document.createElement('form');const label=text('label','Photo or film description');label.htmlFor='v133StoryInput';
  const textarea=document.createElement('textarea');textarea.id='v133StoryInput';textarea.maxLength=500;textarea.required=true;
  const status=text('p','','subtle');status.id='v133EditStatus';status.setAttribute('role','status');
  const actions=document.createElement('div');actions.className='v133-editor-actions';
  const cancel=text('button','Cancel');cancel.type='button';cancel.id='v133EditCancel';
  const save=text('button','Save changes');save.type='submit';save.id='v133EditSave';
  actions.append(cancel,save);form.append(label,textarea,status,actions);panel.append(title,helper,form);modal.append(panel);document.body.append(modal);
  cancel.onclick=()=>{modal.hidden=true;document.body.style.overflow=''};
  modal.addEventListener('click',e=>{if(e.target===modal)cancel.click()});
  modal.addEventListener('keydown',e=>{if(e.key==='Escape')cancel.click()});
 }
 const input=document.getElementById('v133StoryInput'),status=document.getElementById('v133EditStatus'),save=document.getElementById('v133EditSave');
 input.value=post.caption||'';status.textContent='';save.disabled=false;modal.hidden=false;document.body.style.overflow='hidden';input.focus();
 modal.querySelector('form').onsubmit=async event=>{
  event.preventDefault();if(!user)return;
  save.disabled=true;status.textContent='Saving…';
  const value=input.value.trim();
  const {error}=await client.from('portfolio_media').update({caption:value}).eq('id',post.id).eq('user_id',user.id);
  if(error){status.textContent='Could not save: '+error.message;save.disabled=false;return}
  modal.hidden=true;document.body.style.overflow='';await loadMyMedia();
 };
}
async function loadMyMedia(){
 if(!user||!profile)return;
 const sequence=++myMediaLoadSequence,out=$('manageMedia');
 const {data,error}=await client.from('portfolio_media').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(25);
 if(sequence!==myMediaLoadSequence)return;
 out.replaceChildren();
 if(error){out.append(text('p','Portfolio unavailable: '+error.message));return}
 const posts=uniqueMyMediaPosts(data);
 if(!posts.length){out.append(text('p','No posts yet — add your first photo or film above.'));return}
 await v111LoadFeaturedSelection();if(sequence!==myMediaLoadSequence)return;
 v101PhotoItems=posts.filter(m=>m.media_type==='image');
 for(const m of posts){
  const item=document.createElement('article');item.className='gallery-item';
  const thumb=document.createElement('button');thumb.type='button';thumb.className='v133-thumb';thumb.setAttribute('aria-label','Preview '+(m.caption||m.title||'portfolio work').slice(0,70));
  const image=document.createElement('img');image.loading='lazy';image.alt=m.media_type==='video'?'Video preview':(m.caption||'Portfolio photo');
  if(m.media_type==='video'){
   image.src=m.thumbnail_url||'';
   if(!m.thumbnail_url){image.style.display='none';thumb.style.background='linear-gradient(135deg,#18292a,#415350)';}
   const play=text('span','▶','v133-play');thumb.append(image,play);
  }else{image.src=m.media_url;thumb.append(image)}
  thumb.onclick=()=>expandV5(m);
  const info=document.createElement('div');info.className='v133-info';
  const kind=text('div',m.media_type==='video'?'Film':'Photo','v133-kind');
  const caption=text('p',shMediaDisplayTitle(m),'v133-caption');caption.hidden=!caption.textContent;
  caption.title=shMediaDisplayTitle(m);info.append(kind,caption);
  const tools=document.createElement('div');tools.className='gallery-tools';
  const edit=text('button','Edit story','v133-primary');edit.type='button';edit.onclick=()=>v133EditStory(m);
  const preview=text('button','Preview');preview.type='button';preview.onclick=()=>expandV5(m);
  tools.append(edit,preview);
  if(m.media_type==='video'){
    const coverLabel=document.createElement('label');coverLabel.className='v7-cover-editor v104-cover-control';
    coverLabel.textContent=m.thumbnail_url?'Change video cover':'Add video cover';
    const coverInput=document.createElement('input');coverInput.type='file';coverInput.accept='image/jpeg,image/png,image/webp';coverInput.setAttribute('aria-label','Select video cover image');
    coverInput.onchange=async()=>{if(!coverInput.files?.[0])return;coverInput.disabled=true;coverLabel.firstChild.textContent='Uploading cover…';try{await saveVideoCover(m.id,coverInput.files[0]);await loadMyMedia()}catch(e){alert(e.message);coverInput.disabled=false;coverLabel.firstChild.textContent='Retry video cover'}};
    coverLabel.append(coverInput);tools.append(coverLabel);
    const featured=text('button',v111FeaturedId===m.id?'★ Featured film':'☆ Feature film','feature-film-btn');featured.type='button';featured.classList.toggle('is-featured',v111FeaturedId===m.id);featured.onclick=()=>v111SetFeatured(m.id);tools.append(featured);
  }
  const del=text('button','Delete','v133-delete');del.type='button';del.onclick=async()=>{
   if(!confirm('Permanently remove this portfolio item? This cannot be undone.'))return;
   const {error:dbErr}=await client.from('portfolio_media').delete().eq('id',m.id).eq('user_id',user.id);
   if(dbErr){alert('Could not delete: '+dbErr.message);return}
   if(m.storage_path)await client.storage.from('creator-media').remove([m.storage_path]);
   await loadMyMedia();
  };
  tools.append(del);item.append(thumb,info,tools);out.append(item);
 }
}
$('viewMine').onclick=()=>openProfile(user?.id);$('hubViewProfile').onclick=()=>openProfile(user?.id);$('hubRefreshPosts').onclick=()=>loadMyMedia();
const shDirectoryTiers=new Map();
let shDirectoryLoadPromise=null;
function shDirectoryRank(tier){return tier==='studio'?2:tier==='pro'?1:0;}
function shDirectoryRender(){
 const root=$('shDirCards'),status=$('shDirStatus');if(!root||!status)return;
 const q=($('shDirSearch')?.value||'').trim().toLowerCase(),city=($('shDirCity')?.value||'').trim().toLowerCase(),skill=$('shDirSpecialty')?.value||'';
 const shootDay=$('shDirDate')?.value||'', availableOnly=!!$('shDirAvailableOnly')?.checked;
 const list=publicList.filter(p=>(!q||[p.display_name,p.role,p.bio,...specialtiesOf(p)].join(' ').toLowerCase().includes(q))&&(!city||[p.city,p.state].join(' ').toLowerCase().includes(city))&&(!skill||specialtiesOf(p).includes(skill))).sort((a,b)=>shDirectoryRank(shDirectoryTiers.get(b.id))-shDirectoryRank(shDirectoryTiers.get(a.id))||String(a.display_name||'').localeCompare(String(b.display_name||'')));
 root.replaceChildren();status.textContent=list.length+' public creator'+(list.length===1?'':'s')+' found';
 if(!list.length){root.append(text('div','No creators match these filters. Try a different city or specialty.','sh-dir-loading'));return}
 if(availableOnly&&!shootDay)status.textContent='Choose a shoot date to filter by availability.';
 for(const p of list){
  const tier=shDirectoryTiers.get(p.id),card=document.createElement('article');card.className='sh-dir-card'+(shDirectoryRank(tier)?' is-featured':'');
  const cover=document.createElement('div');cover.className='sh-dir-cover';if(validLink(p.cover_url)){const img=document.createElement('img');img.src=p.cover_url;img.loading='lazy';img.alt='Portfolio cover for '+(p.display_name||'creator');cover.append(img)}
  if(shDirectoryRank(tier)){const badge=text('span',tier==='studio'?'✦ STUDIO':'✦ PRO','sh-dir-tag');cover.append(badge)}
  const avatar=document.createElement('img');avatar.className='sh-dir-avatar';avatar.src=validLink(p.avatar_url)||IMAGES.creator1;avatar.alt=(p.display_name||'Creator')+' portrait';avatar.loading='lazy';
  const body=document.createElement('div');body.className='sh-dir-cardbody';body.append(text('h3',p.display_name||'Unnamed creator'),text('p',[p.role,p.city,p.state].filter(Boolean).join(' · ')));
  if(p.bio)body.append(text('p',p.bio.length>105?p.bio.slice(0,102)+'…':p.bio));
  const tags=document.createElement('div');tags.className='sh-dir-skills';for(const t of specialtiesOf(p).slice(0,3))tags.append(text('span',t));body.append(tags);
  if(p.hourly_rate!==null&&p.hourly_rate!==undefined)body.append(text('p','Starting at $'+p.hourly_rate+'/hr'));
  const btn=text('button','View profile →','action');btn.type='button';btn.addEventListener('click',()=>openProfile(p.id));if(shootDay){
   const availability=text('div','📷 Checking date…','sh-dir-date-status is-checking');body.append(availability);
   const renderToken=shootDay+':'+p.id;availability.dataset.token=renderToken;
   client.rpc('sh_creator_availability',{p_creator:p.id,p_day:shootDay}).then(({data,error})=>{
    if(availability.dataset.token!==renderToken||!availability.isConnected)return;
    if(error){availability.textContent='📷 Availability unavailable';availability.className='sh-dir-date-status is-error';if(availableOnly)card.hidden=true;return}
    const busy=data==='booked';availability.textContent=busy?'📷 Booked for this date':'📷 Available for this date';availability.className='sh-dir-date-status'+(busy?' is-busy':'');
    if(availableOnly&&busy)card.hidden=true;
   }).catch(()=>{availability.textContent='📷 Could not check availability';availability.className='sh-dir-date-status is-error';if(availableOnly)card.hidden=true});
  }
  body.append(btn);card.append(cover,avatar,body);root.append(card);
 }
}
async function shDirectoryResolveTiers(){
 if(!client||!publicList.length)return;
 // RPC returns only a public tier, not private billing records. Failure defaults to standard placement.
 const ids=publicList.map(p=>p.id).filter(id=>!shDirectoryTiers.has(id));
 for(let i=0;i<ids.length;i+=10){
  await Promise.all(ids.slice(i,i+10).map(async id=>{try{const {data,error}=await client.rpc('public_creator_premium_tier',{creator_uuid:id});shDirectoryTiers.set(id,!error&&['pro','studio'].includes(data)?data:'free')}catch{shDirectoryTiers.set(id,'free')}}));
 }
 shDirectoryRender();
}
function shOpenDirectory(){
 const el=$('shDirCards');if(!el)return;
 if(!window.shDirectoryListenersReady){window.shDirectoryListenersReady=true;for(const id of ['shDirSearch','shDirCity','shDirSpecialty'])$(id)?.addEventListener(id==='shDirSpecialty'?'change':'input',shDirectoryRender);for(const id of ['shDirDate','shDirAvailableOnly'])$(id)?.addEventListener('change',shDirectoryRender);$('shDirClear')?.addEventListener('click',()=>{for(const id of ['shDirSearch','shDirCity','shDirSpecialty','shDirDate'])$(id).value='';$('shDirAvailableOnly').checked=false;shDirectoryRender()})}
 shDirectoryRender();
 if(shDirectoryLoadPromise)return;
 shDirectoryLoadPromise=(async()=>{if(!publicList.length)await loadCreators();await shDirectoryResolveTiers()})().finally(()=>{shDirectoryLoadPromise=null});
}
window.shOpenDirectory=shOpenDirectory;

// Public-facing portfolio labels should describe the art, never expose upload filenames.
function shMediaDisplayTitle(m){
 // Filenames sometimes entered the caption field in older uploads; clean BOTH fields.
 const looksLikeFile = value => {
  const v=String(value||'').trim();
  if(!v)return false;
  return /^(?:IMG|MOV|VID|DSC|DSCF|DSCN|PXL|MVIMG|GOPR|DJI|MVI|SCREENSHOT|PHOTO|VIDEO|FILE)[\s_.-]*[\dA-Z_-]+(?:\s*\([^)]*\))?(?:\.(?:mov|mp4|m4v|avi|webm|jpg|jpeg|png|heic|heif|webp))?$/i.test(v)
   || /^(?:IMG|MOV|VID|DSC|DSCF|DSCN|PXL|MVIMG|GOPR|DJI|MVI|SCREENSHOT|PHOTO|VIDEO|FILE)[\s_.-]*\d/i.test(v)
   || /^.{1,90}\.(?:mov|mp4|m4v|avi|webm|jpg|jpeg|png|heic|heif|webp)$/i.test(v)
   || /^(?:[a-f0-9]{8}-){4}[a-f0-9]{12}$/i.test(v);
 };
 const caption=String(m?.caption||'').trim();
 const original=String(m?.title||'').trim();
 if(caption && !looksLikeFile(caption))return caption;
 if(original && !looksLikeFile(original))return original;
 return ''; // Leave art uncluttered when no human-written story is available.
}

// Behind the Lens: showcase only media belonging to public, published profiles.
async function shLensLoad(){
 const stage=$('shLensStage'); if(!stage||!client)return;
 const allowed=new Map(publicList.filter(p=>p.is_public===true).map(p=>[p.id,p]));
 const {data,error}=await client.rpc('sh_daily_lens');
 if(error){console.warn('Behind the Lens:',error.message);return}
 for(const m of data||[])if(!allowed.has(m.user_id))allowed.set(m.user_id,{id:m.user_id,display_name:m.creator_name||'ShutterHunters creator',avatar_url:m.creator_avatar,is_public:true});
 const items=(data||[]).filter(m=>allowed.has(m.user_id)&&['image','video'].includes(m.media_type)&&validLink(m.media_url)).slice(0,9);
 if(!items.length)return;
 const grid=document.createElement('div');grid.className='sh-lens-grid';
 items.forEach((m,index)=>{
   const creator=allowed.get(m.user_id),card=document.createElement('button');card.type='button';card.className='sh-lens-card';card.setAttribute('aria-label','Preview '+shMediaDisplayTitle(m)+' by '+(creator.display_name||'a creator'));
   const thumb=validLink(m.thumbnail_url)|| (m.media_type==='image'?validLink(m.media_url):null) || validLink(creator.cover_url)||validLink(creator.avatar_url);
   if(m.media_type==='video'){
     const vid=document.createElement('video');vid.src=m.media_url;vid.muted=true;vid.defaultMuted=true;vid.autoplay=true;vid.loop=true;vid.playsInline=true;vid.preload='auto';vid.setAttribute('muted','');vid.setAttribute('playsinline','');vid.setAttribute('webkit-playsinline','');vid.setAttribute('aria-hidden','true');vid.tabIndex=-1;
     if(thumb)vid.poster=thumb;
     vid.addEventListener('loadeddata',()=>{if(!document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !navigator.connection?.saveData)vid.play().catch(()=>{});},{once:true});
     card.append(vid);
   }else if(thumb){const img=document.createElement('img');img.src=thumb;img.loading=index===0?'eager':'lazy';img.alt='Portfolio project by '+(creator.display_name||'a ShutterHunters creator');card.append(img)}
   if(m.media_type==='video'){const play=document.createElement('span');play.className='sh-lens-play';play.textContent='▶';card.append(play)}
   const info=document.createElement('span');info.className='sh-lens-copy';const label=document.createElement('span');label.className='sh-lens-label';label.textContent='';label.hidden=true;const title=document.createElement('strong');const rawTitle=shMediaDisplayTitle(m);title.textContent=rawTitle.length>56?rawTitle.slice(0,53).trimEnd()+'…':rawTitle;title.hidden=!rawTitle;const credit=document.createElement('small');credit.textContent=(m.media_type==='video'?'FILMED BY ':'CAPTURED BY ')+(creator.display_name||'SHUTTERHUNTERS CREATOR')+' ↗';info.append(label,title,credit);card.append(info);
   card.onclick=()=>shLensOpen(m,creator);grid.append(card);
 });
 stage.replaceChildren(grid);
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const saveData=navigator.connection?.saveData;
 if(!reduce&&!saveData){
   if(window.shLensObserver)window.shLensObserver.disconnect();
   window.shLensObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{const v=entry.target;if(entry.isIntersecting&&!document.hidden){v.play().catch(()=>{});}else v.pause();}),{threshold:.3});
   grid.querySelectorAll('video').forEach(v=>window.shLensObserver.observe(v));
 }
}
function shLensOpen(m,creator){
 const overlay=$('shLensViewer'),container=$('shLensViewerContent');if(!overlay||!container)return;container.replaceChildren();
 const media=document.createElement(m.media_type==='video'?'video':'img');media.className='sh-lens-viewer-media';media.src=m.media_url;if(m.media_type==='video'){media.controls=true;media.playsInline=true;media.preload='metadata';media.autoplay=true;media.muted=false;media.volume=1}else{media.alt=m.caption||m.title||'Creator portfolio photo'}
 const title=document.createElement('h3');title.textContent=shMediaDisplayTitle(m);title.hidden=!title.textContent;const desc=document.createElement('p');desc.textContent='';desc.hidden=true;const credit=document.createElement('div');credit.className='sh-lens-credit';credit.append(document.createTextNode(m.media_type==='video'?'FILMED BY ':'CAPTURED BY '));const link=document.createElement('button');link.type='button';link.textContent=creator.display_name||'View creator';link.onclick=()=>{shLensClose();openProfile(creator.id)};credit.append(link);container.append(media,title,desc,credit);overlay.hidden=false;document.body.style.overflow='hidden';if(m.media_type==='video')media.play().catch(()=>{});$('shLensClose')?.focus();
}
function shLensClose(){const overlay=$('shLensViewer');if(!overlay)return;overlay.hidden=true;overlay.querySelector('video')?.pause();document.body.style.overflow=''}
$('shLensClose')?.addEventListener('click',shLensClose);
$('shLensViewer')?.addEventListener('click',e=>{if(e.target.id==='shLensViewer')shLensClose()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('shLensViewer')?.hidden)shLensClose()});
async function loadCreators(){const {data,error}=await client.from('profiles').select('id,display_name,city,state,role,specialty,specialties,hourly_rate,avatar_url,cover_url,bio,portfolio_url,instagram_url,available_for_second_shooting,is_public').eq('is_public',true).order('created_at',{ascending:false}).limit(100);if(error){console.warn('Public profiles:',error.message);return}publicList=data||[];for(const p of publicList)creatorCache.set(p.id,p);shLensLoad().catch(e=>console.warn("Behind the Lens unavailable",e));showCreators=renderCreators;renderCreators();if(!$('directory')?.classList.contains('hidden')){shDirectoryRender();await shDirectoryResolveTiers()}await v111LoadSaved()}
function renderCreators(){const out=$('creators');out.replaceChildren();const query=$('search').value.trim().toLowerCase(),place=$('location').value.trim().toLowerCase();const matches=publicList.filter(p=>(current==='All'||specialtiesOf(p).includes(current))&&(!query||[p.display_name,p.role,...specialtiesOf(p)].join(' ').toLowerCase().includes(query))&&(!place||[p.city,p.state].join(' ').toLowerCase().includes(place)));if(!matches.length){out.append(text('div','No public creators match your search yet.','empty'));return}for(const p of matches){const item=document.createElement('article');item.className='creator';const image=document.createElement('img');image.alt='Creator portrait';image.loading='lazy';image.src=validLink(p.avatar_url)||IMAGES.creator1;const body=document.createElement('div');body.className='creatorcontent';body.append(text('h3',p.display_name),text('div',p.role+' · '+p.city+', '+p.state,'meta'));const tags=document.createElement('div');tags.className='chipline';for(const s of specialtiesOf(p).slice(0,4))tags.append(text('span',s));body.append(tags);if(p.hourly_rate!==null)body.append(text('div','From $'+p.hourly_rate+'/hr','rates'));const btn=text('button','View profile →','filter');btn.onclick=()=>openProfile(p.id);body.append(btn);const premiumBadge=text('span','','v121-discover-badge');premiumBadge.hidden=true;body.insertBefore(premiumBadge,btn);client.rpc('public_creator_premium_tier',{creator_uuid:p.id}).then(({data})=>{if(data==='pro'||data==='studio'){premiumBadge.textContent=data==='studio'?'✦ STUDIO MEMBER':'♛ PRO CREATOR';premiumBadge.hidden=false}}).catch(()=>{});item.append(image,body);out.append(item)}}
async function openProfile(id){
 shSocialClose();
 // Keep old/default theme hidden until current profile data and theme finish loading.
 const root=$('publicprofile');
 root?.classList.add('sh-profile-loading');
 try { await shOpenProfileLoaded(id); }
 finally { root?.classList.remove('sh-profile-loading'); }
}
// V13.6.5 — Follow is distinct from private Save Creator and job shortlists.
function shSocialClose(){
 const panel=$('shProfileListPanel');
 if(panel)panel.hidden=true;
 delete document.body.dataset.shArchiveOpen;
 // The archives are an independent full-screen layer, not a profile section.
 // Explicitly restore the underlying profile when returning from any archive.
 const profile=$('publicprofile');
 if(profile?.classList.contains('hidden') && viewed?.id)go('publicprofile');
 $('shCompletedCount')?.focus?.({preventScroll:true});
}
// Register a single stable handler; profile count refreshes must never stack listeners.
$('shCloseProfileList')?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();shSocialClose()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('shProfileListPanel')?.hidden)shSocialClose()});
async function shSocialOpen(kind,id){
 const section=$('shProfileListPanel'),list=$('shProfileListEntries'),note=$('shProfileListNote');if(!section||!client)return;
 section.hidden=false;document.body.dataset.shArchiveOpen='true';section.focus({preventScroll:true});list.replaceChildren();note.textContent='Loading…';
 $('shProfileListHeading').textContent=kind==='followers'?'Followers':kind==='following'?'Following':'Completed Projects';
 if(kind==='completed'){
   const {data,error}=await client.rpc('sh_public_completed',{p_account:id});
   if(error){note.textContent='Completed projects unavailable. Check the V13.6.5 database migration.';return}
   note.textContent=(data||[]).length?'Completed through ShutterHunters · project details only':'No verified completed projects yet.';
   for(const job of data||[]){const card=document.createElement('article');card.className='sh-profile-entry';const info=document.createElement('span');info.textContent=[job.job_title,job.job_event_date].filter(Boolean).join(' · ');card.append(info);list.append(card)}return;
 }
 const column=kind==='followers'?'followed_id':'follower_id',other=kind==='followers'?'follower_id':'followed_id';
 const {data,error}=await client.from('sh_creator_follows').select(other).eq(column,id).limit(100);
 if(error){note.textContent='Follow list unavailable. Run the V13.6.5 SQL migration.';return}
 const ids=(data||[]).map(r=>r[other]);note.textContent=ids.length?ids.length+' account(s)':'Nobody here yet.';if(!ids.length)return;
 const found=await client.from('profiles').select('id,display_name,avatar_url,city,is_public').in('id',ids).eq('is_public',true);
 for(const person of found.data||[]){const b=document.createElement('button');b.type='button';b.className='sh-profile-entry';if(validLink(person.avatar_url)){const img=document.createElement('img');img.src=person.avatar_url;img.alt='';b.append(img)}const t=document.createElement('span');t.textContent=[person.display_name,person.city].filter(Boolean).join(' · ');b.append(t);b.onclick=()=>{shSocialClose();openProfile(person.id)};list.append(b)}
}
async function shSocialRefresh(id){
 if(!client)return;
 for(const [kind,col,el] of [['followers','followed_id','shFollowersCount'],['following','follower_id','shFollowingCount']]){
 const r=await client.from('sh_creator_follows').select('id',{count:'exact',head:true}).eq(col,id);if(!r.error&&$(el))$(el).innerHTML=String(r.count||0)+' <small>'+kind+'</small>';
 }
 const done=await client.rpc('sh_public_completed',{p_account:id});
 if(!done.error&&$('shCompletedCount'))$('shCompletedCount').innerHTML=String((done.data||[]).length)+' <small>Completed jobs</small>';
 const button=$('shFollowBtn');if(button){button.hidden=!user||user.id===id;button.disabled=false;if(user&&user.id!==id){const existing=await client.from('sh_creator_follows').select('id').eq('follower_id',user.id).eq('followed_id',id).maybeSingle();if(existing.error){button.textContent='Follow unavailable';button.disabled=true}else{const follows=Boolean(existing.data);button.textContent=follows?'✓ Added Friend':'＋ Add Friend';button.onclick=async()=>{button.disabled=true;const {error}=follows?await client.from('sh_creator_follows').delete().eq('follower_id',user.id).eq('followed_id',id):await client.from('sh_creator_follows').insert({follower_id:user.id,followed_id:id});if(error){alert('Could not update follow: '+error.message);button.disabled=false}else await shSocialRefresh(id)}}}}
 for(const [kind,el] of [['followers','shFollowersCount'],['following','shFollowingCount'],['completed','shCompletedCount']])if($(el))$(el).onclick=()=>shSocialOpen(kind,id);
 // Back-to-profile handler is registered once, outside profile refresh.
}
async function shOpenProfileLoaded(id){if(!id)return;let p=creatorCache.get(id);if(p){const fresh=await client.from('profiles').select('*').eq('id',id).maybeSingle();if(!fresh.error&&fresh.data){p=fresh.data;creatorCache.set(id,p)}}if(!p){const {data,error}=await client.from('profiles').select('*').eq('id',id).maybeSingle();if(error||!data){alert('Profile unavailable or not published.');return}p=data}if(p.is_public===false&&id!==user?.id){alert('This profile is private.');return}viewed=p;go('publicprofile');$('pubName').textContent=p.display_name||'Creative';$('pubSubtitle').textContent=[p.role,p.city,p.state].filter(Boolean).join(' · ');$('pubBio').textContent=p.bio||'This creator is still writing their story.';$('pubCover').style.backgroundImage=validLink(p.cover_url)?'linear-gradient(0deg,#08171979,#08171912),url("'+CSS.escape(p.cover_url)+'")':'';const a=$('pubAvatar');a.replaceChildren();if(validLink(p.avatar_url)){const img=document.createElement('img');img.alt='Creator photo';img.src=p.avatar_url;a.append(img)}else a.textContent=(p.display_name||'SH').slice(0,2).toUpperCase();const specials=$('pubSpecialties');specials.replaceChildren();for(const s of specialtiesOf(p))specials.append(text('span',s));if(!specials.childElementCount){specials.append(text('span',id===user?.id?'No specialties saved — set them in Edit details':'Specialties not listed'));}$('pubDetails').replaceChildren();if(p.hourly_rate!==null)$('pubDetails').append(text('p','Starting from $'+p.hourly_rate+'/hour'));if(p.available_for_second_shooting)$('pubDetails').append(text('p','✓ Available for second shooting'));$('pubDetails').append(text('p',p.city+', '+p.state));const links=$('pubLinks');links.replaceChildren();for(const [title,url] of [['Website',p.portfolio_url],['Instagram',p.instagram_url]]){const safe=validLink(url);if(safe){const a=document.createElement('a');a.href=safe;a.target='_blank';a.rel='noopener noreferrer';a.className='sh-profile-link';a.setAttribute('aria-label','Open '+title+' in a new tab');const ico=document.createElement('span');ico.className='sh-profile-link-icon';ico.textContent=title==='Instagram'?'◎':'⌘';const copy=document.createElement('span');copy.className='sh-profile-link-copy';const heading=document.createElement('span');heading.textContent=title==='Instagram'?'Instagram':'My Portfolio';const sub=document.createElement('small');sub.textContent='VISIT '+(title==='Instagram'?'SOCIAL PROFILE':'WEBSITE');copy.append(heading,sub);const arrow=document.createElement('span');arrow.className='sh-profile-link-arrow';arrow.textContent='↗';a.append(ico,copy,arrow);links.append(a)}}v111UpdateSaveButton(id);$('inquireBtn').onclick=()=>startInquiry(p);$('inquireBtn').disabled=id===user?.id;const {data,error}=await client.from('portfolio_media').select('id,media_type,media_url,title,caption,thumbnail_url').eq('user_id',id).order('sort_order').limit(60);v5Media=data||[];v101PhotoItems=v5Media.filter(m=>m.media_type==='image');v5Filter='video';$('pubMediaEmpty').textContent=error?'Gallery unavailable: '+error.message:!v5Media.length?'This creator hasn’t added portfolio work yet.':'';renderV5Feed();await v111ShowFeatured(id);await v12ApplyPublicProfile(id);shSocialRefresh(id).catch(e=>console.warn('Creative Circle:',e));}
const v103PortfolioTabs=$('v5PortfolioTabs');
if(v103PortfolioTabs){v103PortfolioTabs.addEventListener('click',event=>{const button=event.target.closest('button[data-v5-filter]');if(!button||!v103PortfolioTabs.contains(button))return;event.preventDefault();v5Filter=button.dataset.v5Filter;renderV5Feed();});}

// V12.3: render a dedicated cover button even if a creator has not uploaded a thumbnail.
// When possible, show a frame captured locally from the original video. No DB writes.
function v123CapturePoster(m, img, fallback){
  if(!m?.media_url||m.thumbnail_url)return;
  const video=document.createElement('video');video.crossOrigin='anonymous';video.muted=true;video.playsInline=true;video.preload='auto';
  let completed=false;const finish=()=>{if(completed)return;completed=true;video.pause();video.removeAttribute('src');video.load()};
  const timeout=setTimeout(finish,8000);
  video.addEventListener('loadedmetadata',()=>{try{video.currentTime=Math.min(1,Math.max(.1,(video.duration||1)*.1))}catch{clearTimeout(timeout);finish()}},{once:true});
  video.addEventListener('seeked',()=>{try{if(completed||!video.videoWidth)return;const canvas=document.createElement('canvas');const scale=Math.min(1,900/video.videoWidth);canvas.width=Math.round(video.videoWidth*scale);canvas.height=Math.round(video.videoHeight*scale);canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);const url=canvas.toDataURL('image/jpeg',.78);img.src=url;img.hidden=false;if(fallback)fallback.hidden=true;canvas.width=canvas.height=0}catch(e){console.info('Automatic video cover unavailable; showing designed fallback.')}finally{clearTimeout(timeout);finish()}},{once:true});
  video.addEventListener('error',()=>{clearTimeout(timeout);finish()},{once:true});
  video.src=m.media_url;
}
function v123VideoCover(m,play){
  const button=document.createElement('button');button.type='button';button.className='v123-film-cover';button.setAttribute('aria-label','Play film: '+(m.caption||m.title||'Selected film'));
  const fallback=document.createElement('span');fallback.className='v123-fallback';fallback.append(text('small','SHUTTERHUNTERS · FILM'),text('strong',(m.caption||m.title||'Selected film').slice(0,90)));
  const playIcon=text('span','▶','v123-play');button.append(fallback,playIcon);
  if(m.thumbnail_url){const poster=document.createElement('img');poster.src=m.thumbnail_url;poster.alt='Film cover';poster.loading='lazy';poster.onerror=()=>{poster.remove();fallback.hidden=false};button.insertBefore(poster,fallback);fallback.hidden=true}
  else {const poster=document.createElement('img');poster.alt='Video preview';poster.hidden=true;poster.onload=()=>{poster.hidden=false;fallback.hidden=true};button.insertBefore(poster,fallback);v123CapturePoster(m,poster,fallback)}
  button.onclick=play;return button;
}
function renderV5Feed(){
 const gal=$('pubMedia');gal.replaceChildren();gal.classList.toggle('photos-mode',v5Filter==='image');
 document.querySelectorAll('[data-v5-filter]').forEach(b=>b.classList.toggle('active',b.dataset.v5Filter===v5Filter));
 const items=v5Media.filter(m=>v5Filter==='all'||m.media_type===v5Filter);
 if(v5Media.length&&!items.length)$('pubMediaEmpty').textContent=v5Filter==='video'?'No videos yet. Try Photos or All work.':'No photos yet. Try Videos or All work.';
 else if(v5Media.length)$('pubMediaEmpty').textContent='';
 for(const m of items){
  const figure=document.createElement('figure');figure.className=m.media_type==='video'?'film':'';
  let media;
  if(m.media_type==='video'){media=v123VideoCover(m,()=>expandV5(m))}
  else {media=document.createElement('img');media.src=m.media_url;media.loading='lazy';media.alt=m.title||'Portfolio photo';media.onerror=()=>{media.alt='Photo could not load — please refresh and try again'};media.ondblclick=()=>expandV5(m);media.onclick=()=>expandV5(m);media.tabIndex=0;media.setAttribute('role','button');media.setAttribute('aria-label','Open photo full size');media.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();expandV5(m)}}}
  const caption=text('figcaption','','');
  const fullCaption=shMediaDisplayTitle(m);
  const captionBody=text('span',fullCaption,'sh-caption');if(fullCaption)caption.append(captionBody);else caption.hidden=true;
  if(fullCaption.length>170){
    let expanded=false;const toggle=text('button','Read full story ↓','sh-caption-toggle');toggle.type='button';
    const update=()=>{captionBody.textContent=expanded?fullCaption:fullCaption.slice(0,170).trimEnd()+'…';toggle.textContent=expanded?'Show less ↑':'Read full story ↓';toggle.setAttribute('aria-expanded',String(expanded))};
    toggle.onclick=()=>{expanded=!expanded;update()};caption.append(toggle);update();
  }
  const actions=document.createElement('div');actions.className='v5-actions';
  const like=text('button','♡ Like');const comments=text('button','◌ Comments');const expand=text('button',m.media_type==='image'?'↗ Open photo':'↗ Watch film');
  like.type=comments.type=expand.type='button';
  const commentArea=document.createElement('div');commentArea.className='v5-comments hidden';expand.onclick=()=>expandV5(m);
  actions.append(like,comments,expand);figure.append(media,caption,actions,commentArea);gal.append(figure);initV5Social(m,like,comments,commentArea);
 }
}
let v8Current=null,v8Portrait=false,v8TouchStart=null,v101PhotoItems=[];
function v101PhotoNavigate(direction){if(!v8Current||v8Current.media_type!=='image')return;const i=v101PhotoItems.findIndex(x=>x.id===v8Current.id);const next=v101PhotoItems[i+direction];if(next)expandV5(next)}
function v101SetPhotoControls(){const isPhoto=v8Current?.media_type==='image';const nav=$('v101PhotoNavigation');nav.hidden=!isPhoto||v101PhotoItems.length<2;if(!isPhoto)return;const i=v101PhotoItems.findIndex(x=>x.id===v8Current.id);$('v101PhotoPrev').disabled=i<=0;$('v101PhotoNext').disabled=i<0||i>=v101PhotoItems.length-1;$('v101PhotoCounter').textContent=(i+1)+' / '+v101PhotoItems.length;}
function v8Move(direction){
  if(!v8Portrait||!v8Current)return;
  const items=v5Media.filter(m=>m.media_type==='video');
  const i=items.findIndex(m=>m.id===v8Current.id);
  const target=items[i+direction];
  if(target)expandV5(target);
}
function v8NavState(){
  const items=v5Media.filter(m=>m.media_type==='video');
  const index=items.findIndex(m=>m.id===v8Current?.id);
  $('v8Prev').disabled=!v8Portrait||index<=0;
  $('v8Next').disabled=!v8Portrait||index<0||index>=items.length-1;
  $('v8Navigation').hidden=!v8Portrait||items.length<=1;
  $('v8Counter').textContent=v8Portrait?(index+1)+' / '+items.length:'';
}
function expandV5(m){
  const root=$('v5Lightbox'),area=$('v5Expanded');
  const existing=area.querySelector('video');if(existing){existing.pause();existing.removeAttribute('src');existing.load()}
  area.replaceChildren();v8Current=m;v8Portrait=false;
  root.classList.remove('v8-portrait','v8-landscape','v8-photo');
  root.classList.add(m.media_type==='video'?'v8-landscape':'v8-photo');
  const el=document.createElement(m.media_type==='video'?'video':'img');
  el.src=m.media_url;
  if(m.media_type==='video'){
    el.controls=true;el.autoplay=true;el.playsInline=true;
    el.preload='metadata';if(m.thumbnail_url)el.poster=m.thumbnail_url;
    el.addEventListener('loadedmetadata',()=>{
      if(v8Current?.id!==m.id)return;
      v8Portrait=el.videoHeight>el.videoWidth;
      root.classList.toggle('v8-portrait',v8Portrait);
      root.classList.toggle('v8-landscape',!v8Portrait);
      v8NavState();
    });
  }else{el.alt=m.title||'Portfolio photo'}
  area.append(el);
  $('v5ExpandedCaption').textContent=shMediaDisplayTitle(m);
  $('v8PlayerTitle').textContent=shMediaDisplayTitle(m);
  root.hidden=false;document.body.style.overflow='hidden';v8NavState();v101SetPhotoControls();
}
function closeV5(){
 const video=$('v5Expanded').querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load()}
 $('v5Expanded').replaceChildren();$('v5Lightbox').hidden=true;document.body.style.overflow='';v8Current=null;v8Portrait=false;
}
$('v5Close').onclick=closeV5;
$('v5Lightbox').addEventListener('click',e=>{if(e.target===$('v5Lightbox'))closeV5()});
$('v8Prev').onclick=()=>v8Move(-1);$('v8Next').onclick=()=>v8Move(1);$('v101PhotoPrev').onclick=()=>v101PhotoNavigate(-1);$('v101PhotoNext').onclick=()=>v101PhotoNavigate(1);
$('v5Lightbox').addEventListener('touchstart',e=>{if(v8Current?.media_type==='image'&&e.touches.length===1){const t=e.touches[0];v8TouchStart={x:t.clientX,y:t.clientY};return}if(!v8Portrait||e.touches.length!==1)return;const t=e.touches[0];v8TouchStart={x:t.clientX,y:t.clientY}}, {passive:true});
$('v5Lightbox').addEventListener('touchend',e=>{if(v8Current?.media_type==='image'&&v8TouchStart&&e.changedTouches.length===1){const t=e.changedTouches[0];const dx=t.clientX-v8TouchStart.x,dy=t.clientY-v8TouchStart.y;v8TouchStart=null;if(Math.abs(dx)>85&&Math.abs(dx)>Math.abs(dy)*1.4)v101PhotoNavigate(dx<0?1:-1);return}if(!v8Portrait||!v8TouchStart||e.changedTouches.length!==1)return;const t=e.changedTouches[0];const dy=t.clientY-v8TouchStart.y,dx=t.clientX-v8TouchStart.x;v8TouchStart=null;if(Math.abs(dy)>85&&Math.abs(dy)>Math.abs(dx)*1.4)v8Move(dy<0?1:-1)}, {passive:true});
document.addEventListener('keydown',e=>{
 if($('v5Lightbox').hidden)return;
 if(e.key==='Escape')closeV5();
 else if(v8Current?.media_type==='image'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();v101PhotoNavigate(e.key==='ArrowRight'?1:-1)}
 else if(v8Portrait&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();v8Move(e.key==='ArrowDown'?1:-1)}
});

async function initV5Social(m,like,comments,area){const {data:likes,error}=await client.from('portfolio_likes').select('user_id').eq('media_id',m.id).limit(1000);if(error){like.title='Run the V5 database migration to enable likes';comments.title='Run the V5 database migration to enable comments';like.disabled=true;comments.disabled=true;return}let myLike=(likes||[]).some(l=>l.user_id===user?.id);let count=(likes||[]).length;const refresh=()=>{like.textContent=(myLike?'♥':'♡')+' '+count+' likes';like.classList.toggle('liked',myLike)};refresh();like.onclick=async()=>{if(!user){alert('Sign in to like this post.');return}like.disabled=true;const result=myLike?await client.from('portfolio_likes').delete().eq('media_id',m.id).eq('user_id',user.id):await client.from('portfolio_likes').insert({media_id:m.id,user_id:user.id});like.disabled=false;if(result.error){alert(result.error.message);return}count+=myLike?-1:1;myLike=!myLike;refresh()};comments.onclick=async()=>{area.classList.toggle('hidden');if(area.classList.contains('hidden'))return;await loadV5Comments(m,area)}}
async function loadV5Comments(m,area){area.replaceChildren();const {data,error}=await client.from('portfolio_comments').select('id,user_id,body,created_at').eq('media_id',m.id).order('created_at',{ascending:false}).limit(40);if(error){area.append(text('p','Comments unavailable: '+error.message));return}for(const c of data||[])area.append(text('div',(c.user_id===user?.id?'You: ':'Member: ')+c.body,'v5-comment-item'));if(!user){area.append(text('small','Sign in to leave a comment.'));return}const form=document.createElement('form');const inp=document.createElement('input');inp.placeholder='Write a respectful comment…';inp.maxLength=500;inp.required=true;const submit=text('button','Post');submit.type='submit';form.append(inp,submit);form.onsubmit=async e=>{e.preventDefault();submit.disabled=true;const {error}=await client.from('portfolio_comments').insert({media_id:m.id,user_id:user.id,body:inp.value.trim()});submit.disabled=false;if(error){alert(error.message);return}await loadV5Comments(m,area)};area.append(form)}

function startInquiry(p){if(!user){go('account');say('Sign in or create a free account to send a project inquiry.');return}if(!p||p.id===user.id)return;viewed=p;$('inquiryTo').textContent='To '+p.display_name;$('inquiryFormStatus').textContent='';$('inquiryModal').classList.remove('hidden')}
$('closeInquiry').onclick=()=>$('inquiryModal').classList.add('hidden');$('inquiryModal').addEventListener('click',e=>{if(e.target===$('inquiryModal'))$('inquiryModal').classList.add('hidden')});
$('inquiryForm').addEventListener('submit',async e=>{e.preventDefault();if(!user||!viewed||viewed.id===user.id)return;const f=new FormData(e.target);const row={sender_id:user.id,recipient_id:viewed.id,subject:String(f.get('subject')).trim(),message:String(f.get('message')).trim(),event_date:f.get('event_date')||null,budget:f.get('budget')?Number(f.get('budget')):null};$('inquiryFormStatus').textContent='Sending…';const {error}=await client.from('inquiries').insert(row);if(error){$('inquiryFormStatus').textContent='Could not send: '+error.message;return}$('inquiryForm').reset();$('inquiryModal').classList.add('hidden');alert('Your inquiry was sent! See it in Inquiries → Sent.');go('inquiries');mode='sent';await loadInquiries()});
$('receivedTab').onclick=()=>{mode='received';loadInquiries()};$('sentTab').onclick=()=>{mode='sent';loadInquiries()};
let shActiveInquiry=null;let shThreadLoadToken=0;
async function shOpenThread(inquiry){
 if(!user||![inquiry.sender_id,inquiry.recipient_id].includes(user.id))return;
 shActiveInquiry=inquiry;
 const section=$('shThread');section.hidden=false;
 $('shThreadTitle').textContent=inquiry.subject||'Project conversation';
 $('shThreadContext').textContent='Original request: '+(inquiry.message||'')+(inquiry.event_date?' · Project date '+inquiry.event_date:'');
 $('shReplyText').value='';$('shReplyStatus').textContent='';
 await shLoadThread();section.scrollIntoView({behavior:'smooth',block:'start'});
}
async function shLoadThread(){
 if(!shActiveInquiry||!user)return;
 const id=shActiveInquiry.id,token=++shThreadLoadToken,out=$('shThreadMessages');
 out.replaceChildren(text('p','Loading conversation…'));
 const {data,error}=await client.from('inquiry_messages').select('id,sender_id,body,created_at').eq('inquiry_id',id).order('created_at',{ascending:true}).limit(200);
 if(token!==shThreadLoadToken||shActiveInquiry?.id!==id)return;
 out.replaceChildren();
 if(error){out.append(text('p','Could not load replies: '+error.message+'. Check that V12_4_MESSAGES.sql was installed.'));return}
 const first=document.createElement('article');first.className='sh-bubble'+(shActiveInquiry.sender_id===user.id?' mine':'');
 first.append(text('small',(shActiveInquiry.sender_id===user.id?'You':'Other member')+' · Original inquiry'),text('p',shActiveInquiry.message||''));out.append(first);
 for(const m of data||[]){const mine=m.sender_id===user.id;const bubble=document.createElement('article');bubble.className='sh-bubble'+(mine?' mine':'');bubble.append(text('small',(mine?'You':'Other member')+' · '+new Date(m.created_at).toLocaleString()),text('p',m.body));out.append(bubble)}
 out.scrollTop=out.scrollHeight;
}
$('shThreadClose').addEventListener('click',()=>{$('shThread').hidden=true;shActiveInquiry=null;shThreadLoadToken++});
$('shReplyRefresh').addEventListener('click',()=>shLoadThread());
$('shReplyForm').addEventListener('submit',async e=>{
 e.preventDefault();if(!user||!shActiveInquiry)return;
 const body=$('shReplyText').value.trim(),btn=$('shReplySend');
 if(!body||body.length>3000){$('shReplyStatus').textContent='Enter a message under 3,000 characters.';return}
 const inquiryId=shActiveInquiry.id;btn.disabled=true;$('shReplyStatus').textContent='Sending…';
 const {error}=await client.from('inquiry_messages').insert({inquiry_id:inquiryId,sender_id:user.id,body});
 btn.disabled=false;
 if(error){$('shReplyStatus').textContent='Message not sent: '+error.message;return}
 $('shReplyText').value='';$('shReplyStatus').textContent='Sent!';await shLoadThread();
});
async function loadInquiries(){
 if(!user){$('shThread').hidden=true;shActiveInquiry=null;return}
 $('receivedTab').classList.toggle('on',mode==='received');$('sentTab').classList.toggle('on',mode==='sent');
 const key=mode==='received'?'recipient_id':'sender_id';
 const {data,error}=await client.from('inquiries').select('*').eq(key,user.id).order('created_at',{ascending:false}).limit(100);
 const out=$('inquiryList');out.replaceChildren();
 $('inquiryStatus').textContent=error?'Inbox unavailable: '+error.message:!(data||[]).length?'No '+mode+' inquiries yet.':`${data.length} ${mode} inquiries`;
 if(error)return;await updateInquiryBadge();
 for(const i of data||[]){
  const d=document.createElement('article');d.className='inquiry-card';const top=document.createElement('header');top.append(text('h3',i.subject),text('span',i.status||'new','tag'));
  const when=i.event_date?' · Project date '+i.event_date:'';
  d.append(top,text('small',new Date(i.created_at).toLocaleString()+when),text('p',i.message));
  if(i.budget!==null)d.append(text('p','Budget: $'+i.budget));
  const open=text('button','✉ Open conversation →','sh-open-thread');open.type='button';open.onclick=()=>shOpenThread(i);d.append(open);
  if(mode==='received'&&i.status==='new'){const btn=text('button','Mark reviewed','filter');btn.onclick=async()=>{const {error}=await client.from('inquiries').update({status:'reviewed'}).eq('id',i.id).eq('recipient_id',user.id);if(error)alert(error.message);else loadInquiries()};d.append(btn)}
  out.append(d)
 }
 if(shActiveInquiry){const updated=(data||[]).find(x=>x.id===shActiveInquiry.id);if(updated)shActiveInquiry=updated;else{$('shThread').hidden=true;shActiveInquiry=null}}
}
async function updateInquiryBadge(){if(!user)return;const {count,error}=await client.from('inquiries').select('id',{count:'exact',head:true}).eq('recipient_id',user.id).eq('status','new');if(error)return;const n=count||0;$('navInboxCount').textContent=n;$('navInboxCount').classList.toggle('hidden',!n);$('hubInboxCount').textContent=n?'('+n+' new)':''}
const oldGo=go;go=function(id){if(id==='profile')id='studio';oldGo(id);if(id==='studio')showStudio();if(id==='inquiries')loadInquiries()};

// V11.1 enhancements. These use separate RLS-protected tables; existing portfolio records are not migrated.
let v111FeaturedId=null;let v111SavedIds=new Set();
async function v111LoadPlan(){
 const title=$('v111PlanName'),detail=$('v111PlanDetail');if(!title)return;
 if(!user){title.textContent='Free creator';detail.textContent='Sign in to see your membership. Sandbox billing only.';return;}
 const {data,error}=await client.from('creator_memberships').select('tier,status,current_period_end').eq('user_id',user.id).maybeSingle();
 if(error){detail.textContent='Membership status currently unavailable.';return;}
 const active=data?.status==='active'&&['pro','studio'].includes(data?.tier);
 title.textContent=active?(data.tier==='studio'?'Studio membership':'Pro membership'):'Free creator';
 detail.textContent=active?'Active test membership'+(data.current_period_end?' · Period ends '+new Date(data.current_period_end).toLocaleDateString():'')+'. Manage your plan through Stripe Sandbox.':'Free membership. Pro and Studio are available for sandbox testing; paid visibility benefits are still planned.';
 if($('v111StudioTier'))$('v111StudioTier').textContent=title.textContent;
 if($('v111StudioPlanDetail'))$('v111StudioPlanDetail').textContent=detail.textContent;
}
$('v111ManageBilling')?.addEventListener('click',async()=>{if(!user){go('account');return}const btn=$('v111ManageBilling');btn.disabled=true;try{await billingRequest('stripe-portal')}catch(e){alert(e.message);btn.disabled=false}});
async function v111LoadFeaturedSelection(){
 v111FeaturedId=null;if(!user)return;
 const {data,error}=await client.from('creator_featured_films').select('media_id').eq('user_id',user.id).maybeSingle();
 if(!error)v111FeaturedId=data?.media_id||null;
}
async function v111SetFeatured(mediaId){
 if(!user)return;const isCurrent=v111FeaturedId===mediaId;
 const result=isCurrent?await client.from('creator_featured_films').delete().eq('user_id',user.id):await client.from('creator_featured_films').upsert({user_id:user.id,media_id:mediaId},{onConflict:'user_id'});
 if(result.error){alert('Featured films require V11_1_FEATURES.sql in Supabase: '+result.error.message);return}
 v111FeaturedId=isCurrent?null:mediaId;await loadMyMedia();
}
async function v111LoadSaved(){
 v111SavedIds=new Set();const target=$('v111SavedList'),note=$('v111SavedNote');if(!target)return;
 target.replaceChildren();if(!user){note.textContent='Sign in to save creators you would like to hire or collaborate with.';return}
 const {data,error}=await client.from('saved_creators').select('creator_id').eq('user_id',user.id).limit(100);
 if(error){note.textContent='Saved creators will be available after installing V11_1_FEATURES.sql.';return}
 v111SavedIds=new Set((data||[]).map(d=>d.creator_id));note.textContent=v111SavedIds.size?v111SavedIds.size+' creator(s) on your shortlist.':'Your shortlist is empty. Save someone from Discover or their profile.';
 for(const id of v111SavedIds){const p=creatorCache.get(id)||publicList.find(x=>x.id===id);if(!p)continue;const card=document.createElement('article');card.className='v111-saved-card';card.append(text('h3',p.display_name||'Creative'),text('p',[p.role,p.city,p.state].filter(Boolean).join(' · ')));const btn=text('button','View profile →','filter');btn.onclick=()=>openProfile(id);card.append(btn);target.append(card)}
}
async function v111ToggleSaved(id){
 if(!user){alert('Sign in to save favorite creators.');go('account');return}
 if(id===user.id)return;
 const saved=v111SavedIds.has(id),result=saved?await client.from('saved_creators').delete().eq('user_id',user.id).eq('creator_id',id):await client.from('saved_creators').insert({user_id:user.id,creator_id:id});
 if(result.error){alert('Saved creators require V11_1_FEATURES.sql: '+result.error.message);return}
 await v111LoadSaved();v111UpdateSaveButton(id);renderCreators();
}
function v111UpdateSaveButton(id){const btn=$('v111SaveCreator');if(!btn)return;btn.classList.toggle('saved',v111SavedIds.has(id));btn.textContent=v111SavedIds.has(id)?'♥ Saved creator':'♡ Save creator';btn.disabled=id===user?.id;btn.onclick=()=>v111ToggleSaved(id)}
async function v111ShowFeatured(id){
 const area=$('v111FeaturedFilm'),out=$('v111FeaturedMedia');if(!area||!out)return;area.classList.add('hidden');out.replaceChildren();
 const {data,error}=await client.from('creator_featured_films').select('media_id').eq('user_id',id).maybeSingle();if(error||!data?.media_id)return;
 const film=v5Media.find(m=>m.id===data.media_id&&m.media_type==='video');if(!film)return;
 const cover=v123VideoCover(film,()=>{const video=document.createElement('video');video.className='v123-feature-video';video.src=film.media_url;video.controls=true;video.autoplay=true;video.playsInline=true;video.preload='metadata';if(film.thumbnail_url)video.poster=film.thumbnail_url;out.replaceChildren(video);video.play().catch(()=>{})});
 out.append(cover);$('v111FeaturedCaption').textContent=shMediaDisplayTitle(film);$('v111FeaturedCaption').hidden=!$('v111FeaturedCaption').textContent;area.classList.remove('hidden');
}

let v12ThemeLoadedFor=null;
// V12: tier-verified creator themes and one-time guided post-upgrade onboarding.
let v12Tier='free',v12Theme='midnight',v12Onboarded=true,v12TourIndex=0;
const v12ThemeOptions={pro:[['midnight','Midnight Cinema','Bold, moody, dramatic'],['golden','Golden Hour','Warm, romantic film look'],['editorial','Modern Editorial','Artful, minimal contrast']],studio:[['atelier','Studio Atelier','Luxury production house'],['noir','Monochrome Noir','Black-and-white cinema']]};
const v12TourSteps=[
 ['Welcome to your creative era.','Your premium membership unlocks a dramatically different public-facing portfolio. Everyone visiting your profile can experience it.'],
 ['Choose your signature style.','Select a cinematic theme. Pro creators get three looks; Studio businesses get two elevated studio identities.'],
 ['Put your finest work first.','Your featured film takes center stage. Add a cover photograph and polished captions to tell the story behind your work.'],
 ['Step into the spotlight.','Preview your public profile, adjust your theme any time, and share your page with potential clients.']
];
function v12ThemeForTier(tier,theme){const options=v12ThemeOptions[tier]||[];return options.some(x=>x[0]===theme)?theme:(options[0]?.[0]||'');}
function v12RenderChoices(){const root=$('v12ThemeChoices');if(!root)return;root.replaceChildren();for(const [id,name,description] of v12ThemeOptions[v12Tier]||[]){const b=document.createElement('button');b.type='button';b.className='v12-theme-choice';b.setAttribute('aria-pressed',String(v12Theme===id));b.append(text('strong',name),text('span',description));b.addEventListener('click',()=>{v12Theme=id;v12RenderChoices();$('v12ThemeStatus').textContent='Theme selected. Click Save my theme to publish it.'});root.append(b)}}
function v12TourDisplay(){const step=v12TourSteps[v12TourIndex];$('v12TourStep').textContent='STEP '+String(v12TourIndex+1).padStart(2,'0')+' / 04';$('v12TourTitle').textContent=step[0];$('v12TourDescription').textContent=step[1];$('v12TourNext').textContent=v12TourIndex===3?'Customize my profile →':'Continue →';}
function v12StartTour(){if(!['pro','studio'].includes(v12Tier))return;v12TourIndex=0;v12TourDisplay();$('v12Tour').hidden=false;$('v12TourNext').focus()}
async function v12CloseTour(){const tour=$('v12Tour');tour.hidden=true;if(!user)return;if(!v12Onboarded){const {error}=await client.from('creator_profile_experiences').upsert({user_id:user.id,theme:v12ThemeForTier(v12Tier,v12Theme),onboarding_done:true},{onConflict:'user_id'});if(error)console.warn('Could not save onboarding completion',error.message);else v12Onboarded=true}}
$('v12TourNext')?.addEventListener('click',async()=>{if(v12TourIndex<3){v12TourIndex++;v12TourDisplay()}else{await v12CloseTour();go('studio');openProfile(user.id)}});
$('v12TourSkip')?.addEventListener('click',v12CloseTour);
$('v12ReplayTour')?.addEventListener('click',v12StartTour);
$('v12PreviewTheme')?.addEventListener('click',()=>{if(user)openProfile(user.id)});
$('v12SaveTheme')?.addEventListener('click',async()=>{if(!user||!['pro','studio'].includes(v12Tier))return;const button=$('v12SaveTheme');button.disabled=true;$('v12ThemeStatus').textContent='Saving your theme…';const {error}=await client.from('creator_profile_experiences').upsert({user_id:user.id,theme:v12ThemeForTier(v12Tier,v12Theme)},{onConflict:'user_id'});button.disabled=false;$('v12ThemeStatus').textContent=error?'Could not save: '+error.message:'Saved! Visitors will now see your new cinematic profile.'});
async function v12LoadMyExperience(){if(!user){v12Tier='free';$('v12ThemePanel').hidden=true;return}const {data:membership,error:membershipError}=await client.from('creator_memberships').select('tier,status').eq('user_id',user.id).maybeSingle();if(membershipError){console.warn('Membership query failed:',membershipError.message);$('v12ThemePanel').hidden=true;return}v12Tier=membership?.status==='active'&&['pro','studio'].includes(membership?.tier)?membership.tier:'free';$('v12ThemePanel').hidden=true;if(v12Tier==='free')return;const {data:settings,error}=await client.from('creator_profile_experiences').select('theme,onboarding_done').eq('user_id',user.id).maybeSingle();if(error){$('v12ThemeStatus').textContent='Install V12_PROFILE_EXPERIENCES.sql to enable themes.';return}v12Theme=v12ThemeForTier(v12Tier,settings?.theme);v12Onboarded=!!settings?.onboarding_done;v12RenderChoices();$('v12ThemeStatus').textContent=v12Tier==='studio'?'Studio collection unlocked · Choose your production house aesthetic.':'Pro collection unlocked · Choose your cinematic aesthetic.';if(!v12Onboarded&&!recoveryAuthorized&&!pendingRecoverySession?.user)v12StartTour()}
// V12.1: preview never writes to Supabase; publish is the sole mutation.
let v121PublicId=null,v121SavedTheme='',v121DraftTheme='',v121OwnerTier='free';
function v121PaintTheme(tier,theme){
 const root=$('publicprofile');root.classList.remove('v12-pro','v12-studio','v12-midnight','v12-golden','v12-editorial','v12-atelier','v12-noir');
 if(!['pro','studio'].includes(tier))return;
 root.classList.add('v12-'+tier,'v12-'+v12ThemeForTier(tier,theme));
}
function v121EditorChoices(){
 const wrap=$('v121ThemeButtons');if(!wrap)return;wrap.replaceChildren();
 for(const [id,name,desc] of v12ThemeOptions[v121OwnerTier]||[]){
   const b=text('button',name+' · '+desc);b.type='button';b.setAttribute('aria-pressed',String(id===v121DraftTheme));
   b.onclick=()=>{v121DraftTheme=id;v121PaintTheme(v121OwnerTier,id);v121EditorChoices();$('v121EditorStatus').textContent='Preview only — not published yet.'};wrap.append(b)
 }
}
let v132PremiumRenderSerial=0;
async function v12ApplyPublicProfile(id){
 const serial=++v132PremiumRenderSerial;
 const root=$('publicprofile');v121PublicId=id;
 root.querySelectorAll('.v12-hero-kicker, .v12-tag, .v121-premium-badge').forEach(el=>el.remove());
 const editor=$('v121OwnerEditor');v122CloseEditor();$('v122EditorToggle').hidden=true;v121PaintTheme('free','');
 const {data:publicTier,error}=await client.rpc('public_creator_premium_tier',{creator_uuid:id});
 if(error||!['pro','studio'].includes(publicTier))return;
 if(viewed?.id!==id || serial!==v132PremiumRenderSerial)return;
 const tier=publicTier;
 const result=await client.from('creator_profile_experiences').select('theme').eq('user_id',id).maybeSingle();
 if(viewed?.id!==id || serial!==v132PremiumRenderSerial)return;
 const theme=v12ThemeForTier(tier,result.data?.theme);v121PaintTheme(tier,theme);
 root.querySelectorAll('.v12-hero-kicker, .v12-tag, .v121-premium-badge').forEach(el=>el.remove());
 const heading=$('pubName');
 const badge=text('div',tier==='studio'?'✦ SHUTTERHUNTERS STUDIO MEMBER':'♛ SHUTTERHUNTERS PRO CREATOR','v121-premium-badge');
 const kicker=text('div',tier==='studio'?'A CREATIVE HOUSE FOR BIG IDEAS':theme==='golden'?'CHASING THE GOLDEN LIGHT':theme==='editorial'?'THE ART OF SEEING DIFFERENTLY':'EVERY FRAME TELLS A STORY','v12-hero-kicker');
 heading.before(badge,kicker);
 if(user?.id===id){v121OwnerTier=tier;v121SavedTheme=theme;v121DraftTheme=theme;$('v122EditorToggle').hidden=false;v121EditorChoices();$('v121EditorStatus').textContent='Your visitors are viewing your published design.'}
}
function v122CloseEditor(){const drawer=$('v121OwnerEditor');if(drawer)drawer.hidden=true;const shade=$('v122EditorBackdrop');if(shade)shade.hidden=true;const trigger=$('v122EditorToggle');if(trigger)trigger.setAttribute('aria-expanded','false');}
function v122OpenEditor(){if($('v122EditorToggle').hidden)return;$('v121OwnerEditor').hidden=false;$('v122EditorBackdrop').hidden=false;$('v122EditorToggle').setAttribute('aria-expanded','true');$('v122EditorClose').focus();}
$('v122EditorToggle')?.addEventListener('click',()=>{$('v121OwnerEditor').hidden?v122OpenEditor():v122CloseEditor()});
$('v122EditorClose')?.addEventListener('click',v122CloseEditor);
$('v122EditorBackdrop')?.addEventListener('click',v122CloseEditor);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('v121OwnerEditor').hidden)v122CloseEditor()});
$('v121Discard')?.addEventListener('click',()=>{v121DraftTheme=v121SavedTheme;v121PaintTheme(v121OwnerTier,v121SavedTheme);v121EditorChoices();$('v121EditorStatus').textContent='Preview discarded.'});
$('v121Publish')?.addEventListener('click',async()=>{
 if(!user||user.id!==v121PublicId||!['pro','studio'].includes(v121OwnerTier))return;
 const button=$('v121Publish');button.disabled=true;$('v121EditorStatus').textContent='Publishing…';
 const {data:check,error:checkError}=await client.from('creator_memberships').select('tier,status').eq('user_id',user.id).maybeSingle();
 if(checkError||check?.status!=='active'||check.tier!==v121OwnerTier){$('v121EditorStatus').textContent='Membership could not be confirmed. Nothing was published.';button.disabled=false;return}
 const {error}=await client.from('creator_profile_experiences').upsert({user_id:user.id,theme:v121DraftTheme},{onConflict:'user_id'});
 button.disabled=false;
 if(error){$('v121EditorStatus').textContent='Could not publish: '+error.message;return}
 v121SavedTheme=v121DraftTheme;v12Theme=v121DraftTheme;v12RenderChoices();$('v121EditorStatus').textContent='Published! Visitors now see this theme.';
});
// Keep the editable media visible in Profile Details as well as the Posts tab.
$('v121ManagePosts')?.addEventListener('click',()=>{studioTab('posts');$('manageMedia')?.scrollIntoView({behavior:'smooth',block:'center'})});
async function v121LoadDetailsMedia(){
 const out=$('v121DetailsGallery');if(!out||!user)return;out.replaceChildren();
 const {data,error}=await client.from('portfolio_media').select('id,media_type,media_url,thumbnail_url,caption,title').eq('user_id',user.id).order('created_at',{ascending:false}).limit(24);
 if(error){out.append(text('p','Could not load media: '+error.message));return}
 const rows=uniqueMyMediaPosts(data);
 if(!rows.length){out.append(text('p','No portfolio posts yet. Upload photos and videos under My Posts.'));return}
 for(const m of rows){const card=document.createElement('article');card.className='v121-mini';
   const media=document.createElement(m.media_type==='video'?'video':'img');media.src=m.media_type==='video'?(m.media_url||''):(m.media_url||'');
   if(m.media_type==='video'){media.preload='none';media.controls=true;if(m.thumbnail_url)media.poster=m.thumbnail_url}else{media.loading='lazy';media.alt=m.caption||'Portfolio photo'}
   const display=shMediaDisplayTitle(m);card.append(media);if(display)card.append(text('p',display));out.append(card)
 }
}
const v121OriginalStudioTab=studioTab;
studioTab=function(tab){v121OriginalStudioTab(tab);if(tab==='details')v121LoadDetailsMedia()};


// A verified PASSWORD_RECOVERY event may have arrived before the form was created.
recoveryUiReady=true;
// Explicit recovery landing route also handles Supabase's PKCE ?code= callback,
// where some browsers never receive a PASSWORD_RECOVERY notification.
// The query flag ONLY requests this UI; Supabase must first validate the session.
// SECURITY: never treat an existing logged-in session as recovery authority.
// A ?sh_reset=1 URL by itself is NOT a password reset grant.
// Only Supabase's PASSWORD_RECOVERY event (above), or a verified incoming
// recovery access token matching the current session (below), may show the form.
if(recoveryReturnRequested&&!pendingRecoverySession&&!incomingRecoveryToken){
  console.info('Recovery return requested; awaiting a verified PASSWORD_RECOVERY event.');
}

if(pendingRecoverySession?.user)showRecovery(pendingRecoverySession.user.email||'');
// Defensive fallback for implicit-flow callbacks: only accept a matching, verified
// Supabase session from the incoming recovery token, NEVER a preexisting login.
if(incomingRecoveryToken){
  client.auth.getSession().then(async({data,error})=>{
    if(error||!data?.session||data.session.access_token!==incomingRecoveryToken)return;
    const verified=await client.auth.getUser();
    if(!verified.error&&verified.data?.user){
      pendingRecoverySession=data.session;
      showRecovery(verified.data.user.email||'');
    }
  }).catch(()=>{});
}
updateAuth();loadCreators();
// V13.4 — Client jobs and paid proposals. The database RPC enforces membership.
function shJobEl(tag,label,cls){const el=document.createElement(tag);if(label!=null)el.textContent=label;if(cls)el.className=cls;return el}
async function shGetViewer(){const {data,error}=await client.auth.getUser();if(error)return null;return data?.user||null}
async function shGetJobTier(id){const {data,error}=await client.from('creator_memberships').select('tier,status').eq('user_id',id).maybeSingle();return !error&&data?.status==='active'&&['pro','studio'].includes(data.tier)?data.tier:null}
window.shLoadRealJobs=async function(){const out=$('shLiveJobsList'),status=$('shLiveJobsStatus');if(!out||!status)return;out.replaceChildren();status.textContent='Finding current member projects…';const viewer=await shGetViewer();if(!viewer){status.textContent='Sign in to see real member projects. Sample listings are below.';const b=shJobEl('button','Sign in to view jobs','filter');b.onclick=()=>go('account');out.append(b);return}const {data,error}=await client.from('sh_job_posts').select('id,client_id,title,location,specialty,budget,details,status,created_at,event_date').eq('status','open').order('created_at',{ascending:false}).limit(50);if(error){status.textContent='Real jobs unavailable. Install V13_4_REAL_JOBS.sql or check permissions: '+error.message;return}status.textContent=(data||[]).length?`${data.length} real member project(s) · Verified account posts`:'No real jobs posted yet. Be the first to share an opportunity.';const tier=await shGetJobTier(viewer.id);const query=(window.shCityQuery||'').toLowerCase();const filtered=(data||[]).filter(j=>!query||String(j.location||'').toLowerCase().includes(query));if(query)status.textContent=filtered.length+' matching real job(s) of '+(data||[]).length+' loaded; showing first 50 latest opportunities.';for(const job of filtered){const card=shJobEl('article',null,'job sh-job-live'),top=shJobEl('div',null,'sh-job-top'),title=shJobEl('h3',job.title),tag=shJobEl('span','REAL MEMBER JOB','sh-job-demo');top.append(title,tag);card.append(top,shJobEl('div',job.location+' · '+job.specialty,'sh-job-meta'),shJobEl('p',job.details));if(job.event_date){const match=shJobEl('div',null,'sh-job-match');match.append(shJobEl('span','📅 Shoot date: '+shDateShort(job.event_date),'sh-job-date-pill'));const find=shJobEl('button','📷 Find available creators →','filter');find.type='button';find.onclick=()=>{go('directory');$('shDirDate').value=job.event_date;$('shDirAvailableOnly').checked=true;if(typeof window.shOpenDirectory==='function')window.shOpenDirectory()};match.append(find);card.append(match)}if(job.budget!=null)card.append(shJobEl('strong','$'+Number(job.budget).toLocaleString()+' budget'));const actions=shJobEl('div',null,'sh-job-controls');if(job.client_id===viewer.id){const own=shJobEl('span','Your job listing · Open','sh-job-status');actions.append(own);const spot=shJobEl('button','✦ View Spotlight matches','filter');spot.type='button';spot.onclick=()=>window.shShowSpotlight(job);actions.append(spot);const saved=shJobEl('button','♡ Potential candidates','filter');saved.type='button';saved.onclick=()=>window.shShowJobShortlist(job);actions.append(saved);const close=shJobEl('button','Close job','filter');close.onclick=async()=>{if(!confirm('Close this job to new proposals?'))return;close.disabled=true;const {error}=await client.from('sh_job_posts').update({status:'closed'}).eq('id',job.id).eq('client_id',viewer.id);if(error){alert(error.message);close.disabled=false}else window.shLoadRealJobs()};actions.append(close)}else if(tier){const apply=shJobEl('button','Send proposal & message client →','action');actions.append(apply);apply.onclick=()=>{if(card.querySelector('.sh-proposal-box')){card.querySelector('.sh-proposal-box').remove();return}const box=shJobEl('form',null,'sh-proposal-box'),label=shJobEl('label','Introduce yourself and explain your fit for this project'),input=document.createElement('textarea'),feedback=shJobEl('p','','sh-job-status'),send=shJobEl('button','Submit proposal','action');input.required=true;input.minLength=20;input.maxLength=3000;input.placeholder='Hi! I am a filmmaker specializing in…';send.type='submit';box.append(label,input,send,feedback);box.onsubmit=async e=>{e.preventDefault();send.disabled=true;feedback.textContent='Submitting…';const result=await client.rpc('sh_apply_to_job',{p_job_id:job.id,p_message:input.value.trim()});if(result.error){feedback.textContent=result.error.message;send.disabled=false;return}feedback.textContent='Proposal sent! Open Inquiries → Sent to continue your conversation.';send.textContent='Proposal sent';send.disabled=true};card.append(box)}}else{const upgrade=shJobEl('button','Unlock Pro to send a proposal','filter');upgrade.onclick=()=>go('membership');actions.append(upgrade)}card.append(actions);out.append(card)}};
window.shLoadPrivateTests=async function(){
 const area=$('shPrivateTestArea'),out=$('shPrivateTestList'),status=$('shPrivateTestStatus');if(!area||!out||!status)return;
 out.replaceChildren();const viewer=await shGetViewer();if(!viewer){area.classList.add('hidden');return}
 const {data,error}=await client.from('sh_private_test_jobs').select('id,owner_id,title,location,specialty,budget,details,event_date,created_at').eq('owner_id',viewer.id).order('created_at',{ascending:false}).limit(20);
 if(error){area.classList.remove('hidden');status.textContent='Private tests unavailable. Run the V13.5.10 SQL migration. '+error.message;return}
 area.classList.toggle('hidden',!(data||[]).length);status.textContent=(data||[]).length+' private test project(s) · Visible only to you.';
 for(const item of data){const card=shJobEl('article',null,'sh-test-card'),title=shJobEl('h3',item.title),meta=shJobEl('p',item.location+' · '+item.specialty+(item.event_date?' · '+shDateShort(item.event_date):''),'sh-job-meta'),tag=shJobEl('span','PRIVATE TEST — NOT PUBLIC','sh-test-pill'),actions=shJobEl('div',null,'sh-job-controls'),preview=shJobEl('button','✦ Preview Spotlight','action'),remove=shJobEl('button','Delete test','filter');preview.type='button';preview.onclick=()=>window.shShowSpotlight({...item,client_id:viewer.id,__privateTest:true});remove.type='button';remove.onclick=async()=>{if(!confirm('Delete this private test project?'))return;remove.disabled=true;const {error}=await client.from('sh_private_test_jobs').delete().eq('id',item.id).eq('owner_id',viewer.id);if(error){alert(error.message);remove.disabled=false}else window.shLoadPrivateTests()};const saved=shJobEl('button','♡ Potential candidates','filter');saved.type='button';saved.onclick=()=>window.shShowJobShortlist({...item,__privateTest:true});actions.append(preview,saved,remove);card.append(tag,title,meta,shJobEl('p',item.details),actions);out.append(card)}
};
window.shPublishJob=async function(form){const status=$('shPostJobStatus'),submit=form.querySelector('button[type=submit],button:not([type])');status.textContent='';const viewer=await shGetViewer();if(!viewer){status.textContent='Sign in before publishing a job.';go('account');return}const fields=Object.fromEntries(new FormData(form));const title=String(fields.title||'').trim(),location=String(fields.location||'').trim(),specialty=String(fields.specialty||'').trim(),details=String(fields.details||'').trim(),budget=fields.budget===''?null:Number(fields.budget),event_date=String(fields.event_date||'').trim()||null;if(title.length<5||location.length<2||details.length<15){status.textContent='Add a clear job title (5+ characters), location and project details (15+ characters).';return}if(fields.private_test==='yes'){
 submit.disabled=true;status.textContent='Saving private test project…';
 const {data:preview,error:testError}=await client.from('sh_private_test_jobs').insert({owner_id:viewer.id,title,location,specialty,details,budget,event_date}).select('id,owner_id,title,location,specialty,event_date').single();
 submit.disabled=false;if(testError){status.textContent='Private test could not be saved: '+testError.message+' — Run the V13_5_10_PRIVATE_TEST_JOBS.sql migration first.';return}
 form.reset();document.getElementById('shPostSubmit').textContent='Publish Job';go('jobs');await window.shLoadPrivateTests();window.shShowSpotlight({...preview,client_id:viewer.id,__privateTest:true});return;
 }
 submit.disabled=true;status.textContent='Publishing your job…';const {data:posted,error}=await client.from('sh_job_posts').insert({client_id:viewer.id,title,location,specialty,details,budget,event_date}).select('id,client_id,title,location,specialty,event_date').single();submit.disabled=false;if(error){status.textContent='Could not publish: '+error.message;return}form.reset();status.textContent='Job published. Browse your Spotlight recommendations in Jobs.';go('jobs');if(posted?.id)window.shShowSpotlight(posted)};



// V13.5.9 — Real account booking requests and member-only, private dashboards.
// No billing/contract claims: this booking flow is scheduling-only until the secure checkout is built.
const shBookingText=(tag,content,klass)=>shJobEl(tag,content,klass);
window.shLoadBookings=async function(){
 const root=$('shBookingsList'),note=$('shBookingsStatus');if(!root||!note)return;
 root.replaceChildren();const viewer=await shGetViewer();if(!viewer){note.textContent='Sign in to view your bookings.';return}
 const {data,error}=await client.from('sh_booking_requests').select('id,job_id,client_id,creator_id,status,created_at,job_title,job_location,job_event_date,job_budget').or('client_id.eq.'+viewer.id+',creator_id.eq.'+viewer.id).order('created_at',{ascending:false}).limit(100);
 if(error){note.textContent='Booking service not ready. Run V13_5_9_BOOKINGS.sql in Supabase. '+error.message;return}
 note.textContent=(data||[]).length?(data.length+' private booking request(s)'):'No bookings yet. Post a job or receive a booking request.';
 for(const b of data||[]){const mine=b.creator_id===viewer.id,job={title:b.job_title,location:b.job_location,event_date:b.job_event_date,budget:b.job_budget},card=shBookingText('article',null,'sh-booking');
  card.append(shBookingText('span',mine?'CREATOR BOOKING':'CLIENT HIRE','sh-booking-kicker'),shBookingText('h3',job.title||'Project'),shBookingText('p',[job.location,job.event_date&&shDateShort(job.event_date)].filter(Boolean).join(' · ')),shBookingText('strong',String(b.status).replace('_',' ').toUpperCase()));
  const acts=shBookingText('div',null,'sh-booking-actions'),msg=shBookingText('p','','sh-inline-alert');
  if(mine&&b.status==='pending'){for(const [label,choice] of [['Accept booking','accept'],['Decline','decline']]){const btn=shBookingText('button',label,choice==='accept'?'action':'filter');btn.onclick=async()=>{btn.disabled=true;msg.textContent='Saving…';const {error}=await client.rpc('sh_respond_booking',{p_booking_id:b.id,p_accept:choice==='accept'});if(error){msg.textContent=error.message;btn.disabled=false;return}await window.shLoadBookings();if(choice==='accept'){window.shLoadRealJobs();if(typeof shLoadSchedule==='function')await shLoadSchedule()}};acts.append(btn)}}
  if(!mine&&b.status==='pending')acts.append(shBookingText('span','Awaiting creator response','sh-job-status'));
  if(b.status==='confirmed'){
    acts.append(shBookingText('span','Confirmed · Public listing closed · Date reserved','sh-job-status'));
    const finish=shBookingText('button','Confirm work completed','filter');finish.type='button';finish.onclick=async()=>{if(!confirm('Confirm your side of this project was completed? Both sides must confirm before it appears in the public archive.'))return;finish.disabled=true;msg.textContent='Recording completion…';const publicly=confirm('Also allow this project title to appear on both public profiles? It will only become public if the other party agrees. No price, client contact details, or private notes are shown.');const {data,error}=await client.rpc('sh_confirm_completed_job',{p_booking_id:b.id,p_public:publicly});if(error){msg.textContent=error.message;finish.disabled=false;return}msg.textContent=data==='completed'?'Verified completed!':'Your confirmation is saved. Waiting for the other party.';await window.shLoadBookings()};acts.append(finish);
  }
  if(b.status==='completed')acts.append(shBookingText('span','✓ Completed · Added to public project history','sh-job-status'));
  card.append(acts,msg);root.append(card)
 }
};
window.shRequestBooking=async function(jobId,creatorId){
 const note=$('shSpotStatus');if(note)note.textContent='Sending booking request…';const viewer=await shGetViewer();if(!viewer){if(note)note.textContent='Please sign in to request a booking.';go('account');return}
 const {error}=await client.rpc('sh_request_booking',{p_job_id:jobId,p_creator_id:creatorId});
 if(error){if(note)note.textContent='Booking request not sent: '+error.message;else alert(error.message);return}
 if(note)note.textContent='Booking request sent! The creator must accept before the job is closed or their date becomes booked.';
 await window.shLoadBookings();
};
// Fictional UI-only Spotlight demonstration cards. No auth accounts, database rows, subscriptions,
// or private calendar entries are created. Never use these for a public job or real booking.
// V13.5.13 — private per-job shortlist and cinematic focus layer.
let shActiveSpotJob=null;
// Mount Spotlight directly under body, outside the Jobs shell and its clipping/stacking contexts.
function shCloseSpotlight(){
 const panel=$('shSpotlight');panel?.classList.add('hidden');panel?.classList.remove('shspot-modal');
 document.getElementById('shSpotBackdrop')?.remove();document.body.classList.remove('sh-spot-open');
}
function shOpenSpotlightLayer(){
 const panel=$('shSpotlight');if(!panel)return;
 if(panel.parentElement!==document.body)document.body.appendChild(panel);
 let backdrop=document.getElementById('shSpotBackdrop');
 if(!backdrop){backdrop=document.createElement('div');backdrop.id='shSpotBackdrop';backdrop.className='sh-spot-backdrop';backdrop.setAttribute('aria-hidden','true');backdrop.addEventListener('click',shCloseSpotlight);document.body.appendChild(backdrop)}
 panel.classList.remove('hidden');panel.classList.add('shspot-modal');
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
 document.body.classList.add('sh-spot-open');panel.scrollTop=0;
 requestAnimationFrame(()=>document.getElementById('shSpotClose')?.focus({preventScroll:true}));
}
window.shCloseSpotlight=shCloseSpotlight;
const shCandidateKey=(p,isDemo)=>isDemo?{demo_key:p.name}:{creator_id:p.id};
// V13.5.13: Fictional Private Test Project candidates are browser-local only.
// These demo selections never touch real creator or job records.
function shDemoListKey(job,viewer){return 'sh_demo_candidates_v13513_'+viewer.id+'_'+job.id}
function shDemoGet(job,viewer){try{const values=JSON.parse(localStorage.getItem(shDemoListKey(job,viewer))||'[]');return Array.isArray(values)?values.filter(n=>shSpotlightDemoCreators.some(d=>d.name===n)).map(n=>({id:'demo-'+n,demo_key:n,creator_id:null})):[]}catch(e){console.warn('Demo shortlist read failed',e);return []}}
function shDemoSet(job,viewer,items){localStorage.setItem(shDemoListKey(job,viewer),JSON.stringify(items.map(x=>x.demo_key)))}
function shShortlistError(err){const msg=$('shSpotStatus');if(msg)msg.textContent='Candidate list error: '+(err?.message||String(err))}
async function shReadShortlist(job){const viewer=await shGetViewer();if(!viewer||!job)return[];if(job.__privateTest)return shDemoGet(job,viewer);const query=client.from('sh_job_shortlists').select('id,creator_id,demo_key,created_at').eq('owner_id',viewer.id).eq(job.__privateTest?'private_test_id':'job_id',job.id).order('created_at',{ascending:false});const {data,error}=await query;if(error){console.warn('Shortlist load:',error.message);shShortlistError(error);throw error}return data||[]}
async function shToggleCandidateSave(job,p,isDemo,button){
 const status=$('shSpotStatus');if(!button||!job)return;
 button.disabled=true;button.textContent='Saving…';
 try{
  const viewer=await shGetViewer();if(!viewer)throw Error('Please sign in first.');
  if(job.__privateTest){
   if(!isDemo)throw Error('Only fictional test creators belong in this test shortlist.');
   const existing=shDemoGet(job,viewer),match=existing.find(x=>x.demo_key===p.name);
   const next=match?existing.filter(x=>x.demo_key!==p.name):[...existing,{demo_key:p.name}];
   shDemoSet(job,viewer,next);
   button.setAttribute('aria-pressed',String(!match));
   button.textContent=match?'♡ Save to potential candidates':'♥ Saved for this job';
   if(status)status.textContent=match?'Removed from demo shortlist.':'Saved to this private test job! Open Potential candidates to review. (Saved only on this device.)';
   return;
  }
  if(isDemo)throw Error('Fictional profiles cannot be saved to real jobs.');
  const existing=await shReadShortlist(job),match=existing.find(x=>x.creator_id===p.id);
  let result;
  if(match)result=await client.from('sh_job_shortlists').delete().eq('id',match.id).eq('owner_id',viewer.id);
  else result=await client.from('sh_job_shortlists').insert({owner_id:viewer.id,job_id:job.id,creator_id:p.id});
  if(result.error)throw result.error;
  button.setAttribute('aria-pressed',String(!match));button.textContent=match?'♡ Save to potential candidates':'♥ Saved for this job';
  if(status)status.textContent=match?'Removed from this job shortlist.':'Saved to this job. Open Potential candidates to review.';
 }catch(e){console.error('Candidate save failed',e);button.textContent='♡ Retry save';if(status)status.textContent='Could not save candidate: '+(e?.message||String(e))+'. For real jobs confirm the shortlist SQL is installed.'}
 finally{button.disabled=false}
}
function shSaveButton(job,p,isDemo){const btn=shBookingText('button','♡ Save to potential candidates','sh-save-candidate');btn.type='button';btn.setAttribute('aria-pressed','false');btn.onclick=()=>shToggleCandidateSave(job,p,isDemo,btn);shReadShortlist(job).then(items=>{if(!btn.isConnected)return;const saved=items.some(x=>isDemo?x.demo_key===p.name:x.creator_id===p.id);btn.textContent=saved?'♥ Saved for this job':'♡ Save to potential candidates';btn.setAttribute('aria-pressed',String(saved))}).catch(e=>{if(btn.isConnected)btn.title='Shortlist unavailable: '+(e?.message||e)});return btn}
window.shShowJobShortlist=async function(job){if(!job)return;shCloseSpotlight();const area=$('shJobShortlistArea'),list=$('shJobShortlistList'),msg=$('shJobShortlistStatus');if(!area||!list)return;area.classList.remove('hidden');list.replaceChildren();$('shJobShortlistHeading').textContent='Potential candidates · '+job.title;msg.textContent='Loading your saved candidates…';let saved;try{saved=await shReadShortlist(job)}catch(e){msg.textContent='Could not load candidates: '+(e?.message||e);return}msg.textContent=saved.length+' saved candidate(s) for this job · '+(job.__privateTest?'Demo selections saved in this browser only.':'Only visible to you.');
for(const entry of saved){
 let p=entry.demo_key?shSpotlightDemoCreators.find(x=>x.name===entry.demo_key):publicList.find(x=>x.id===entry.creator_id);
 if(!p&&entry.creator_id){
  if(!publicList.length)await loadCreators();
  p=publicList.find(x=>x.id===entry.creator_id);
 }
 const isDemo=!!entry.demo_key;
 const card=shBookingText('article',null,'sh-shortlist-profile-card');
 const cover=shBookingText('div',null,'sh-shortlist-cover');
 if(isDemo&&p){
  cover.classList.add('is-demo');
  cover.style.background='radial-gradient(circle at 75% 25%, '+p.color+', #142527 76%)';
  cover.append(shBookingText('span',p.initials,'sh-shortlist-cover-initials'));
 }else if(p){
  const image=document.createElement('img');image.loading='lazy';image.alt='Portfolio cover for '+(p.display_name||'creator');image.src=validLink(p.cover_url)||validLink(p.avatar_url)||IMAGES.creator1;cover.append(image);
 }
 const tag=shBookingText('span',isDemo?'FICTIONAL DEMO':'SAVED CREATOR','sh-shortlist-cover-tag');cover.append(tag);card.append(cover);
 if(p){
  const avatar=shBookingText('div',null,'sh-shortlist-avatar');
  if(isDemo){avatar.textContent=p.initials;avatar.style.background=p.color}
  else {const av=document.createElement('img');av.src=validLink(p.avatar_url)||IMAGES.creator1;av.loading='lazy';av.alt=(p.display_name||'Creator')+' profile photo';avatar.append(av)}
  card.append(avatar);
 }
 const body=shBookingText('div',null,'sh-shortlist-profile-body');
 body.append(shBookingText('h3',p?(p.name||p.display_name):'Creator profile unavailable'));
 if(p){
  body.append(shBookingText('p',isDemo?p.city+' · '+p.specialty.join(' · '):[p.role,p.city,p.state].filter(Boolean).join(' · '),'sh-shortlist-meta'));
  if(isDemo){
   body.append(shBookingText('span',p.tier.toUpperCase()+' · SIMULATED MEMBERSHIP','sh-shortlist-tier'));
   body.append(shBookingText('p',p.bio,'sh-shortlist-bio'));
   const status=shBookingText('div','📷 '+(p.status==='booked'?'Booked on example date':'Available on example date'),'sh-dir-date-status'+(p.status==='booked'?' is-busy':''));body.append(status);
   const detail=shBookingText('div',null,'sh-shortlist-demo-detail hidden');
   detail.append(shBookingText('p','Preview only. A real creator would display their uploaded films, photo portfolio and full profile here. This fictional creator cannot receive bookings or payments.'));
   const viewDemo=shBookingText('button','View demo profile ↓','sh-shortlist-primary');viewDemo.type='button';viewDemo.onclick=()=>{detail.classList.toggle('hidden');viewDemo.textContent=detail.classList.contains('hidden')?'View demo profile ↓':'Hide demo profile ↑'};
   body.append(viewDemo,detail);
  }else{
   if(p.bio)body.append(shBookingText('p',p.bio.length>150?p.bio.slice(0,147)+'…':p.bio,'sh-shortlist-bio'));
   const skills=shBookingText('div',null,'sh-shortlist-skills');for(const skill of specialtiesOf(p).slice(0,4))skills.append(shBookingText('span',skill));body.append(skills);
   if(p.hourly_rate!=null)body.append(shBookingText('p','Starting at $'+p.hourly_rate+'/hr','sh-shortlist-meta'));
   const open=shBookingText('button','View full creator profile ↗','sh-shortlist-primary');open.type='button';open.onclick=()=>openProfile(p.id);body.append(open);
   client.rpc('public_creator_premium_tier',{creator_uuid:p.id}).then(({data,error})=>{if(!error&&(data==='studio'||data==='pro')){const tier=shBookingText('span','✦ '+data.toUpperCase()+' MEMBER','sh-shortlist-tier');body.insertBefore(tier,body.children[1]||null)}}).catch(()=>{});
   if(job.event_date){const status=shBookingText('div','📷 Checking availability…','sh-dir-date-status is-checking');body.append(status);client.rpc('sh_creator_availability',{p_creator:p.id,p_day:job.event_date}).then(({data,error})=>{status.textContent=error?'📷 Availability unavailable':data==='booked'?'📷 Booked for this date':'📷 Available for this date';status.className='sh-dir-date-status'+(error?' is-error':data==='booked'?' is-busy':'')}).catch(()=>{status.textContent='📷 Availability unavailable';status.className='sh-dir-date-status is-error'})}
  }
 }else body.append(shBookingText('p','This creator profile is no longer publicly available.','sh-shortlist-meta'));
 const remove=shBookingText('button','♡ Remove from this job shortlist','sh-shortlist-remove');remove.type='button';remove.onclick=async()=>{
  const viewer=await shGetViewer();if(!viewer)return;
  remove.disabled=true;
  if(job.__privateTest){shDemoSet(job,viewer,shDemoGet(job,viewer).filter(x=>x.demo_key!==entry.demo_key));window.shShowJobShortlist(job);return}
  const {error}=await client.from('sh_job_shortlists').delete().eq('id',entry.id).eq('owner_id',viewer.id);
  if(error){msg.textContent='Could not remove candidate: '+error.message;remove.disabled=false;return}window.shShowJobShortlist(job)
 };body.append(remove);card.append(body);list.append(card)
}
area.scrollIntoView({behavior:'smooth',block:'start'})};
$('shShortlistClose')?.addEventListener('click',()=>$('shJobShortlistArea')?.classList.add('hidden'));
$('shSpotClose')?.addEventListener('click',shCloseSpotlight);
document.addEventListener('keydown',e=>{if(e.key==='Escape')shCloseSpotlight()});
const shSpotlightDemoCreators = Object.freeze([
 {name:'Golden Hour Films',city:'Sacramento',specialty:['Weddings','Events'],tier:'studio',color:'#b98b59',initials:'GH',status:'available',bio:'Documentary-style wedding films and cinematic storytelling. Fictional demonstration profile.'},
 {name:'North Valley Creative',city:'Elk Grove',specialty:['Weddings','Events'],tier:'studio',color:'#647e75',initials:'NV',status:'available',bio:'Wedding films, candid moments and heartfelt edits. Fictional demonstration profile.'},
 {name:'West Coast Visuals',city:'Sacramento',specialty:['Weddings','Real Estate'],tier:'pro',color:'#63758b',initials:'WC',status:'available',bio:'Wedding and portrait imagery with an editorial touch. Fictional demonstration profile.'},
 {name:'Wildframe Productions',city:'Roseville',specialty:['Weddings','Commercial'],tier:'pro',color:'#816a6a',initials:'WF',status:'booked',bio:'Event coverage and commercial production. Fictional demonstration profile.'},
 {name:'Evergreen Portraits',city:'Davis',specialty:['Weddings','Events'],tier:'free',color:'#86876b',initials:'EP',status:'available',bio:'Natural-light portraits and intimate ceremonies. Fictional demonstration profile.'}
]);
function shRenderSpotlightDemo(strip,note,job){
 const spec=String(job.specialty||'').toLowerCase();
 const demo=shSpotlightDemoCreators.filter(d=>!spec||d.specialty.some(s=>s.toLowerCase()===spec));
 const ranked=[...demo].sort((a,b)=>({studio:0,pro:1,free:2}[a.tier]-{studio:0,pro:1,free:2}[b.tier]));
 note.textContent='DEMO PREVIEW · '+ranked.length+' fictional creator cards · Booking and payments disabled. No real accounts created.';
 for(const d of ranked){
  const card=shBookingText('article',null,'shspot-card shspot-demo-card');
  const cover=shBookingText('div',null,'shspot-demo-cover');cover.style.background='radial-gradient(circle at 78% 20%, '+d.color+', #152426 77%)';
  const initials=shBookingText('span',d.initials,'shspot-demo-monogram');cover.append(initials,shBookingText('span','FICTIONAL DEMO','shspot-demo-stamp'));
  const body=shBookingText('div',null,'shspot-body');
  body.append(shBookingText('strong',d.name),shBookingText('small',d.city+' · '+d.specialty.join(', ')),shBookingText('small',d.tier==='studio'?'✦ STUDIO · Priority demo':d.tier==='pro'?'✦ PRO · Priority demo':'FREE · Demo profile'));
  body.append(shBookingText('small',d.status==='booked'?'📷 Booked on example date':'📷 Available on example date',d.status==='booked'?'sh-demo-busy':'sh-available'));
  const more=shBookingText('button','View demo portfolio ↗','filter');more.type='button';more.onclick=()=>{
   const existing=body.querySelector('.sh-demo-details');if(existing){existing.remove();more.textContent='View demo portfolio ↗';return}
   const details=shBookingText('div',null,'sh-demo-details');details.append(shBookingText('p',d.bio),shBookingText('small','Preview only. A real creator profile would show their uploaded portfolio, reviews and booking options. No booking can be requested here.'));
   body.append(details);more.textContent='Hide demo details';
  };
  body.append(more,shSaveButton(job,d,true),shBookingText('small','Demonstration only · Not hireable','shspot-demo-notice'));card.append(cover,body);strip.append(card);
 }
}
window.shShowSpotlight=async function(job){
 const panel=$('shSpotlight'),strip=$('shSpotCards'),note=$('shSpotStatus');if(!panel||!strip||!job?.id)return;const isPrivateTest=job.__privateTest===true;
 shActiveSpotJob=job;shOpenSpotlightLayer();$('shSpotDismiss').onclick=shCloseSpotlight;$('shSpotSaved').onclick=()=>window.shShowJobShortlist(job);strip.replaceChildren();note.textContent='Finding creators who match the date and specialty…';
 $('shSpotIntro').textContent=(isPrivateTest?'PRIVATE TEST · Fictional showcase preview · No bookings. For ':'For ')+job.title+' · '+job.location+(job.event_date?' · '+shDateShort(job.event_date):'')+' · Studio priority among qualified creators.';
 // Private tests are a UI playground; never insert demo profiles into Supabase or expose them in live jobs.
 if(isPrivateTest){
  shRenderSpotlightDemo(strip,note,job);
  $('shSpotExplore').textContent='Explore real creators ↗';
  $('shSpotExplore').onclick=()=>{shCloseSpotlight();go('directory');$('shDirSpecialty').value=job.specialty||'';if(job.event_date){$('shDirDate').value=job.event_date;$('shDirAvailableOnly').checked=true}shOpenDirectory()};
  $('shSpotDismiss').onclick=shCloseSpotlight; $('shSpotSaved').onclick=()=>window.shShowJobShortlist(job);return;
 }
 $('shSpotExplore').textContent='Explore all creators ↗';
 if(!publicList.length)await loadCreators();await shDirectoryResolveTiers();
 const spec=String(job.specialty||'').toLowerCase(),city=String(job.location||'').toLowerCase().split(',')[0].trim();
 let possible=publicList.filter(p=>p.id!==job.client_id&&(!spec||specialtiesOf(p).some(s=>s.toLowerCase()===spec)));
 const scores=await Promise.all(possible.map(async p=>{let busy=false;if(job.event_date){const {data,error}=await client.rpc('sh_creator_availability',{p_creator:p.id,p_day:job.event_date});if(error)return null;busy=data==='booked'}if(busy)return null;const tier=shDirectoryTiers.get(p.id)||'free';const nearby=city&&[p.city,p.state].filter(Boolean).join(' ').toLowerCase().includes(city);return {p,tier,score:(nearby?100:0)+(tier==='studio'?20:tier==='pro'?10:0)}}));
 const best=scores.filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,5);strip.replaceChildren();
 if(!best.length){note.textContent='No available matching creators found yet. Try Explore All Creators.';return}
 note.textContent=best.length+' available creator'+(best.length===1?'':'s')+' matched · Priority placement reflects membership.';
 for(const {p,tier} of best){const card=shBookingText('article',null,'shspot-card'),photo=document.createElement('img');photo.src=validLink(p.cover_url)||validLink(p.avatar_url)||IMAGES.creator1;photo.alt='Portfolio image for '+(p.display_name||'creator');photo.loading='lazy';const body=shBookingText('div',null,'shspot-body');
 body.append(shBookingText('strong',p.display_name||'Creative professional'),shBookingText('small',[p.city,p.state,specialtiesOf(p).slice(0,2).join(', ')].filter(Boolean).join(' · ')),shBookingText('small',tier==='studio'?'✦ Studio · Priority placement':tier==='pro'?'✦ Pro · Priority placement':'Creator'),shBookingText('small',job.event_date?'📷 Available for selected date':'📷 Check schedule with creator','sh-available'));
 const open=shBookingText('button','View portfolio ↗','filter');open.onclick=()=>{shCloseSpotlight();openProfile(p.id)};const req=shBookingText('button','Request booking','action');req.onclick=()=>window.shRequestBooking(job.id,p.id);body.append(open,req,shSaveButton(job,p,false));card.append(photo,body);strip.append(card)
 }
 $('shSpotExplore').onclick=()=>{shCloseSpotlight();go('directory');$('shDirSpecialty').value=job.specialty||'';if(job.event_date){$('shDirDate').value=job.event_date;$('shDirAvailableOnly').checked=true}shOpenDirectory()};
 $('shSpotDismiss').onclick=shCloseSpotlight;$('shSpotSaved').onclick=()=>window.shShowJobShortlist(job);
};

// V13.5.6 — Private creator schedule and public camera availability.
const shCal = {month:new Date(new Date().getFullYear(),new Date().getMonth(),1),rows:new Map(),bulk:false,selected:new Set()};
const shDateLocal=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const shDateShort=day=>new Date(day+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
function shScheduleMessage(t){const el=$('shCalStatus');if(el)el.textContent=t}
async function shLoadSchedule(){
 if(!user){shCal.rows.clear();shRenderSchedule();shScheduleMessage('Sign in to manage your private calendar.');return}
 shScheduleMessage('Loading your private schedule…');
 const from=shDateLocal(new Date(shCal.month.getFullYear(),shCal.month.getMonth()-1,1));
 const to=shDateLocal(new Date(shCal.month.getFullYear(),shCal.month.getMonth()+3,0));
 const {data,error}=await client.from('creator_schedule_days').select('day,status,title,notes').eq('creator_id',user.id).gte('day',from).lte('day',to).order('day');
 if(error){shCal.rows.clear();shScheduleMessage('Schedule unavailable. Install V13_5_6_SCHEDULE.sql in Supabase first. '+error.message);shRenderSchedule();return}
 shCal.rows=new Map((data||[]).map(r=>[r.day,r])); shRenderSchedule();shScheduleMessage('Your changes are stored privately in your ShutterHunters account.');
}
function shRenderSchedule(){
 const grid=$('shCalGrid');if(!grid)return;grid.replaceChildren();
 $('shCalMonth').textContent=shCal.month.toLocaleDateString(undefined,{month:'long',year:'numeric'});
 for(const wd of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'])grid.append(text('div',wd,'sh-cal-heading'));
 const yr=shCal.month.getFullYear(), mo=shCal.month.getMonth(), count=new Date(yr,mo+1,0).getDate();
 for(let i=0;i<new Date(yr,mo,1).getDay();i++)grid.append(document.createElement('div'));
 for(let n=1;n<=count;n++){
  const day=shDateLocal(new Date(yr,mo,n)),record=shCal.rows.get(day),state=record?.status||'available';
  const b=document.createElement('button');b.type='button';b.className='sh-cal-day sh-day-'+state+(day===$('shCalDate').value?' selected':'')+(shCal.selected.has(day)?' sh-bulk-selected':'');
  b.setAttribute('aria-label',shDateShort(day)+': '+(state==='booked'?'booked':state==='available'?'available':'available'));
  b.append(text('strong',String(n)),text('span','📷','sh-cal-emoji'));if(record?.title)b.append(text('small',record.title));
  b.onclick=()=>{if(shCal.bulk){shCal.selected.has(day)?shCal.selected.delete(day):shCal.selected.add(day);shRenderSchedule()}else shChooseDate(day)};grid.append(b);
 }
 const bulkLabel=$('shCalSelectionStatus');if(bulkLabel)bulkLabel.textContent=shCal.selected.size+' day(s) selected'+(shCal.bulk?' · Tap calendar dates to select':''); const bulkButton=$('shCalBulkMode');if(bulkButton)bulkButton.textContent=shCal.bulk?'Finish selecting':'Select multiple dates';
 const upcoming=$('shCalUpcoming');upcoming.replaceChildren();
 const today=shDateLocal(new Date());const rows=[...shCal.rows.values()].filter(r=>r.status==='booked'&&r.day>=today).sort((a,b)=>a.day.localeCompare(b.day)).slice(0,8);
 if(!rows.length)upcoming.append(text('p','No upcoming booked dates in the loaded calendar.','subtle'));
 for(const r of rows){const d=document.createElement('div');d.className='sh-cal-upcoming-item';const tomorrow=shDateLocal(new Date(Date.now()+86400000))===r.day;d.append(text('strong',(tomorrow?'🎬 Tomorrow — ':'📷 ')+shDateShort(r.day)),text('p',r.title||'Booked / unavailable'));if(r.notes)d.append(text('small',r.notes));upcoming.append(d)}
}
function shChooseDate(day){$('shCalDate').value=day;const r=shCal.rows.get(day);$('shCalKind').value=r?.status||'available';$('shCalTitleInput').value=r?.title||'';$('shCalNotes').value=r?.notes||'';shRenderSchedule()}
$('shCalBulkMode')?.addEventListener('click',()=>{shCal.bulk=!shCal.bulk;shRenderSchedule()});
$('shCalSelectMonth')?.addEventListener('click',()=>{shCal.bulk=true;const y=shCal.month.getFullYear(),m=shCal.month.getMonth();for(let n=1;n<=new Date(y,m+1,0).getDate();n++)shCal.selected.add(shDateLocal(new Date(y,m,n)));shRenderSchedule()});
$('shCalDeselect')?.addEventListener('click',()=>{shCal.selected.clear();shRenderSchedule()});
async function shSaveBulk(status){
 if(!user)return shScheduleMessage('Sign in first.');const days=[...shCal.selected].sort();if(!days.length)return shScheduleMessage('Select dates on the calendar first.');
 if(!confirm('Mark '+days.length+' selected dates '+(status==='booked'?'booked':'available')+'? Project names and notes will remain unchanged.'))return;
 const buttons=[$('shCalBulkBooked'),$('shCalBulkAvailable')];buttons.forEach(b=>b.disabled=true);shScheduleMessage('Saving '+days.length+' dates…');
 // Upsert only the status and identity columns; preserve existing notes on update.
 // Process each date separately so one bad record cannot overwrite an existing private appointment.
 let completed=0;for(const day of days){const existing=shCal.rows.get(day);const payload={creator_id:user.id,day,status,title:existing?.title||'',notes:existing?.notes||''};const {error}=await client.from('creator_schedule_days').upsert(payload,{onConflict:'creator_id,day'});if(error){shScheduleMessage('Saved '+completed+' of '+days.length+' dates. Could not save '+shDateShort(day)+': '+error.message);break}shCal.rows.set(day,payload);completed++;}
 buttons.forEach(b=>b.disabled=false);if(completed===days.length){shCal.selected.clear();shCal.bulk=false;shScheduleMessage('Saved '+completed+' dates.');}shRenderSchedule();
}
$('shCalBulkBooked')?.addEventListener('click',()=>shSaveBulk('booked'));
$('shCalBulkAvailable')?.addEventListener('click',()=>shSaveBulk('available'));
window.shOpenSchedule=async()=>{if(!user){go('account');return}go('schedule');shChooseDate(shDateLocal(new Date()));await shLoadSchedule()};
$('shCalPrev')?.addEventListener('click',async()=>{shCal.month=new Date(shCal.month.getFullYear(),shCal.month.getMonth()-1,1);await shLoadSchedule()});
$('shCalNext')?.addEventListener('click',async()=>{shCal.month=new Date(shCal.month.getFullYear(),shCal.month.getMonth()+1,1);await shLoadSchedule()});
$('shCalForm')?.addEventListener('submit',async e=>{e.preventDefault();if(!user)return shScheduleMessage('Sign in first.');const day=$('shCalDate').value;if(!day)return;shScheduleMessage('Saving…');const record={creator_id:user.id,day,status:$('shCalKind').value,title:$('shCalTitleInput').value.trim(),notes:$('shCalNotes').value.trim()};const {error}=await client.from('creator_schedule_days').upsert(record,{onConflict:'creator_id,day'});if(error)return shScheduleMessage('Could not save: '+error.message);shCal.rows.set(day,record);shRenderSchedule();shScheduleMessage('Saved '+shDateShort(day)+' securely.')});
$('shCalRemove')?.addEventListener('click',async()=>{if(!user)return;const day=$('shCalDate').value;if(!day)return;const {error}=await client.from('creator_schedule_days').delete().eq('creator_id',user.id).eq('day',day);if(error)return shScheduleMessage('Could not clear: '+error.message);shCal.rows.delete(day);shChooseDate(day);shScheduleMessage('Cleared '+shDateShort(day)+'. You are available by default.')});
// Public profiles deliberately do not display a calendar or reveal private booking details.
// Availability is only queried when a client selects a date in the Creators directory.

})();
