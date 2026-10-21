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
async function updateAuth(){const {data,error}=await client.auth.getUser();const before=user?.id;user=error?null:data.user;guest.classList.toggle('hidden',!!user);member.classList.toggle('hidden',!user);updateMenu();if(!user){profile=null;v12ThemeLoadedFor=null;$('v12ThemePanel').hidden=true;loadMembership();v111LoadPlan();v111LoadSaved();return}$('signedInAs').textContent=user.email||'Signed in';await loadMembership();await v111LoadPlan();await v111LoadSaved();if(before!==user.id||!v12ThemeLoadedFor||v12ThemeLoadedFor!==user.id){v12ThemeLoadedFor=user.id;await v12LoadMyExperience()}if(before!==user.id||!profile){const q=await client.from('profiles').select('*').eq('id',user.id).maybeSingle();if(q.error){say('Could not load your profile: '+q.error.message);return}profile=q.data; if(profile)fillForm(profile);showStudio();await loadMyMedia();await updateInquiryBadge()}else{await loadMyMedia()}}
async function refreshProfile(){if(!user)return;const {data,error}=await client.from('profiles').select('*').eq('id',user.id).maybeSingle();if(!error){profile=data;if(profile)fillForm(profile);showStudio();await updateInquiryBadge()}}
const forms=[$('signupForm'),$('loginForm')];
if(!ready){forms.forEach(f=>f.querySelectorAll('input,button').forEach(x=>x.disabled=true));notice.textContent='Account configuration is missing. Upload config.js containing only your public Supabase project URL and publishable key.';return}
// Capture the incoming recovery callback BEFORE supabase-js consumes/removes URL tokens.
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
function showRecovery(email){
  recoveryAuthorized=true;recoveryBox.style.display='flex';
  $('shRecoveryFor').textContent=email?'Resetting password for '+email:'Securely update your account password.';
  $('shRecoveryMessage').textContent='Your recovery link is verified. Choose a new password.';
  $('shNewPassword').focus();
}
forgotButton.addEventListener('click',async()=>{
  const email=String(forms[1].elements.namedItem('email').value||'').trim();
  if(!email){say('Enter your email address in the Sign In form, then click Forgot password?');forms[1].elements.namedItem('email').focus();return}
  forgotButton.disabled=true;say('Requesting password recovery email…');
  const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
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
  const button=$('shRecoverySave');button.disabled=true;message.textContent='Saving your new password…';
  const {error}=await client.auth.updateUser({password});
  if(error){message.textContent='Could not reset password: '+error.message;button.disabled=false;return}
  recoveryAuthorized=false;
  message.textContent='Password changed successfully! You can now sign in using your new password.';
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
$('onlineProfileForm').addEventListener('submit',async e=>{e.preventDefault();if(!user)return say('Sign in first.');const f=new FormData(e.target);const additional=primaryAndSelected(f);const data={id:user.id,display_name:String(f.get('display_name')||'').trim(),city:String(f.get('city')||'').trim(),state:String(f.get('state')||'').trim().toUpperCase(),role:String(f.get('role')),specialty:String(f.get('specialty')),specialties:additional,bio:String(f.get('bio')||''),hourly_rate:f.get('hourly_rate')?Number(f.get('hourly_rate')):null,portfolio_url:validLink(String(f.get('portfolio_url')||'')),instagram_url:validLink(String(f.get('instagram_url')||'')),avatar_url:validLink(String(f.get('avatar_url')||'')),is_public:f.has('is_public'),available_for_second_shooting:f.has('available_for_second_shooting')};if(profile?.cover_url)data.cover_url=profile.cover_url;
 say('Saving your studio…');const {error}=await client.from('profiles').upsert(data,{onConflict:'id'});if(error)return say('Could not save profile: '+error.message+' — did you run the v2 SQL migration?');say('Profile saved! '+(data.is_public?'Anyone can discover your work.':'It remains private.'));await refreshProfile();await loadCreators();});
// Storage uploads must use per-user folders and Supabase Storage RLS. Never put private files in a public bucket.
const fileName=(f)=>{const ext=(f.name.split('.').pop()||'bin').toLowerCase();const clean=ext.replace(/[^a-z0-9]/g,'');return crypto.randomUUID()+'.'+clean};
// Photos are optimized locally. Large videos use resumable TUS uploads when Supabase permits.
const MAX_VIDEO_BYTES=500*1024*1024;
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
  let prepared=file;
  if(!isVideo){
    if(!file.type.startsWith('image/'))throw Error('Choose an image file.');
    prepared=await optimizePhoto(file);
  }
  const mime=(prepared.type||'').toLowerCase();
  if(isVideo&&!['video/mp4','video/webm','video/quicktime'].includes(mime)&&!(/\.(mov|mp4|webm)$/i.test(prepared.name)))throw Error('Use MP4, MOV or WebM video.');
  if(isVideo&&prepared.size>MAX_VIDEO_BYTES)throw Error('Video exceeds 500 MB. Export a compressed H.264 MP4.');
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
 const {data:inserted,error:dbErr}=await client.from('portfolio_media').insert({user_id:user.id,media_type:kind,storage_path:res.path,media_url:res.url,title:file.name.slice(0,100),caption:String(caption||'').trim().slice(0,500),sort_order:count}).select('id').single();
 if(dbErr){await client.storage.from('creator-media').remove([res.path]);throw Error(dbErr.message+' — check that PROFILE_HUB_v4.sql has run.');}
 if(kind==='video'){try{let cover=coverFile;if(!cover){const frame=await captureVideoCover(file);if(frame)cover=new File([frame],'video-cover.jpg',{type:'image/jpeg'})}if(cover)await saveVideoCover(inserted.id,cover)}catch(e){console.warn('Video published, but cover could not be set:',e);$('postMediaStatus').textContent='Video published, but cover failed: '+e.message+' — add it from My Posts.'}}
 return true;
}
$('postMediaForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget,file=$('postMediaFile').files?.[0],kind=String(new FormData(f).get('postType')||'image'),caption=String(new FormData(f).get('caption')||'').trim(),status=$('postMediaStatus'),btn=$('publishPostBtn');if(!file||!caption){status.textContent='Choose a file and add its description.';return}if(kind==='video'&&!file.type.startsWith('video/')&&!/\.(mov|mp4|webm)$/i.test(file.name)){status.textContent='Choose a video for a video post.';return}if(kind==='image'&&!file.type.startsWith('image/')){status.textContent='Choose a photo for a photo post.';return}btn.disabled=true;status.textContent='Uploading your post… Larger videos may take a while. Please keep this page open.';try{await uploadOnePortfolio(file,kind,caption,kind==='video'?$('postVideoCover').files?.[0]:null);status.textContent='Published! View it below or on your public profile.';f.reset();$('postMediaFile').accept='image/jpeg,image/png,image/webp';$('postVideoCoverRow').hidden=true;await loadMyMedia()}catch(err){status.textContent='Could not publish: '+err.message}finally{btn.disabled=false}});
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
async function loadMyMedia(){if(!user||!profile)return;const sequence=++myMediaLoadSequence;const out=$('manageMedia');const {data,error}=await client.from('portfolio_media').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(25);if(sequence!==myMediaLoadSequence)return;out.replaceChildren();if(error){out.append(text('p','Portfolio unavailable: '+error.message));return}const uniquePosts=uniqueMyMediaPosts(data);if(!uniquePosts.length){out.append(text('p','No posts yet — upload your first photo or film above.'));return}await v111LoadFeaturedSelection();if(sequence!==myMediaLoadSequence)return;out.replaceChildren();v101PhotoItems=uniquePosts.filter(m=>m.media_type==='image');for(const m of uniquePosts){const item=document.createElement('div');item.className='gallery-item';const media=document.createElement(m.media_type==='video'?'video':'img');media.src=m.media_url;if(m.media_type==='video'){media.controls=true;media.preload='metadata';media.playsInline=true}else{media.loading='lazy';media.alt=m.caption||m.title||'My portfolio post';media.classList.add('v101-photo-thumb');media.tabIndex=0;media.setAttribute('role','button');media.setAttribute('aria-label','View photo full size');media.onclick=()=>expandV5(m);media.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();expandV5(m)}}};const foot=text('div',m.media_type==='video'?'🎬 Video':'📷 Photo','gallery-foot'),caption=text('div',m.caption||'No caption yet','gallery-caption'),tools=document.createElement('div');tools.className='gallery-tools';const edit=text('button','Edit caption','edit-caption');edit.onclick=async()=>{const value=prompt('Write a description for this post (500 characters maximum):',m.caption||'');if(value===null)return;if(value.length>500)return alert('Descriptions must be 500 characters or fewer.');const {error}=await client.from('portfolio_media').update({caption:value}).eq('id',m.id).eq('user_id',user.id);if(error)return alert('Could not save description: '+error.message);await loadMyMedia()};const del=text('button','Delete');del.onclick=async()=>{if(!confirm('Permanently remove this portfolio item?'))return;const {error:dbErr}=await client.from('portfolio_media').delete().eq('id',m.id).eq('user_id',user.id);if(dbErr)return alert(dbErr.message);await client.storage.from('creator-media').remove([m.storage_path]);await loadMyMedia()};if(m.media_type==='video'){if(m.thumbnail_url)media.poster=m.thumbnail_url;const coverLabel=document.createElement('label');coverLabel.className='v7-cover-editor v104-cover-control';coverLabel.textContent=m.thumbnail_url?'Change video cover':'Add video cover';const coverInput=document.createElement('input');coverInput.type='file';coverInput.accept='image/jpeg,image/png,image/webp';coverInput.setAttribute('aria-label','Choose video cover photo');coverInput.onchange=async()=>{if(!coverInput.files?.[0])return;coverInput.disabled=true;coverLabel.firstChild.textContent='Uploading cover…';try{await saveVideoCover(m.id,coverInput.files[0]);await loadMyMedia()}catch(err){alert(err.message);coverInput.disabled=false;coverLabel.firstChild.textContent='Retry video cover'}};coverLabel.append(coverInput);tools.append(coverLabel)}if(m.media_type==='image'){const view=text('button','⛶ View photo','v101-view-photo');view.type='button';view.onclick=()=>expandV5(m);tools.prepend(view)}if(m.media_type==='video'){const feat=text('button',v111FeaturedId===m.id?'★ Featured on profile':'☆ Feature this film','feature-film-btn');feat.classList.toggle('is-featured',v111FeaturedId===m.id);feat.onclick=()=>v111SetFeatured(m.id);tools.append(feat)}tools.append(edit,del);item.append(media,foot,caption,tools);out.append(item)}}
$('viewMine').onclick=()=>openProfile(user?.id);$('hubViewProfile').onclick=()=>openProfile(user?.id);$('hubRefreshPosts').onclick=()=>loadMyMedia();
async function loadCreators(){const {data,error}=await client.from('profiles').select('id,display_name,city,state,role,specialty,specialties,hourly_rate,avatar_url,cover_url,bio,portfolio_url,instagram_url,available_for_second_shooting,is_public').eq('is_public',true).order('created_at',{ascending:false}).limit(100);if(error){console.warn('Public profiles:',error.message);return}publicList=data||[];for(const p of publicList)creatorCache.set(p.id,p);showCreators=renderCreators;renderCreators();await v111LoadSaved()}
function renderCreators(){const out=$('creators');out.replaceChildren();const query=$('search').value.trim().toLowerCase(),place=$('location').value.trim().toLowerCase();const matches=publicList.filter(p=>(current==='All'||specialtiesOf(p).includes(current))&&(!query||[p.display_name,p.role,...specialtiesOf(p)].join(' ').toLowerCase().includes(query))&&(!place||[p.city,p.state].join(' ').toLowerCase().includes(place)));if(!matches.length){out.append(text('div','No public creators match your search yet.','empty'));return}for(const p of matches){const item=document.createElement('article');item.className='creator';const image=document.createElement('img');image.alt='Creator portrait';image.loading='lazy';image.src=validLink(p.avatar_url)||IMAGES.creator1;const body=document.createElement('div');body.className='creatorcontent';body.append(text('h3',p.display_name),text('div',p.role+' · '+p.city+', '+p.state,'meta'));const tags=document.createElement('div');tags.className='chipline';for(const s of specialtiesOf(p).slice(0,4))tags.append(text('span',s));body.append(tags);if(p.hourly_rate!==null)body.append(text('div','From $'+p.hourly_rate+'/hr','rates'));const btn=text('button','View profile →','filter');btn.onclick=()=>openProfile(p.id);body.append(btn);const premiumBadge=text('span','','v121-discover-badge');premiumBadge.hidden=true;body.insertBefore(premiumBadge,btn);client.rpc('public_creator_premium_tier',{creator_uuid:p.id}).then(({data})=>{if(data==='pro'||data==='studio'){premiumBadge.textContent=data==='studio'?'✦ STUDIO MEMBER':'♛ PRO CREATOR';premiumBadge.hidden=false}}).catch(()=>{});if(p.id!==user?.id){const save=text('button',v111SavedIds.has(p.id)?'♥ Saved':'♡ Save creator','v111-save-btn');save.type='button';save.onclick=()=>v111ToggleSaved(p.id);body.append(save)}item.append(image,body);out.append(item)}}
async function openProfile(id){if(!id)return;let p=creatorCache.get(id);if(!p){const {data,error}=await client.from('profiles').select('*').eq('id',id).maybeSingle();if(error||!data){alert('Profile unavailable or not published.');return}p=data}if(p.is_public===false&&id!==user?.id){alert('This profile is private.');return}viewed=p;go('publicprofile');$('pubName').textContent=p.display_name||'Creative';$('pubSubtitle').textContent=[p.role,p.city,p.state].filter(Boolean).join(' · ');$('pubBio').textContent=p.bio||'This creator is still writing their story.';$('pubCover').style.backgroundImage=validLink(p.cover_url)?'linear-gradient(0deg,#08171979,#08171912),url("'+CSS.escape(p.cover_url)+'")':'';const a=$('pubAvatar');a.replaceChildren();if(validLink(p.avatar_url)){const img=document.createElement('img');img.alt='Creator photo';img.src=p.avatar_url;a.append(img)}else a.textContent=(p.display_name||'SH').slice(0,2).toUpperCase();const specials=$('pubSpecialties');specials.replaceChildren();for(const s of specialtiesOf(p))specials.append(text('span',s));if(!specials.childElementCount)specials.append(text('span','Specialties not set yet'));$('pubDetails').replaceChildren();if(p.hourly_rate!==null)$('pubDetails').append(text('p','Starting from $'+p.hourly_rate+'/hour'));if(p.available_for_second_shooting)$('pubDetails').append(text('p','✓ Available for second shooting'));$('pubDetails').append(text('p',p.city+', '+p.state));const links=$('pubLinks');links.replaceChildren();for(const [title,url] of [['Website',p.portfolio_url],['Instagram',p.instagram_url]]){const safe=validLink(url);if(safe){const a=document.createElement('a');a.href=safe;a.target='_blank';a.rel='noopener noreferrer';a.textContent=title+' ↗';links.append(a)}}v111UpdateSaveButton(id);$('inquireBtn').onclick=()=>startInquiry(p);$('inquireBtn').disabled=id===user?.id;const {data,error}=await client.from('portfolio_media').select('id,media_type,media_url,title,caption,thumbnail_url').eq('user_id',id).order('sort_order').limit(60);v5Media=data||[];v101PhotoItems=v5Media.filter(m=>m.media_type==='image');v5Filter='video';$('pubMediaEmpty').textContent=error?'Gallery unavailable: '+error.message:!v5Media.length?'This creator hasn’t added portfolio work yet.':'';renderV5Feed();await v111ShowFeatured(id);await v12ApplyPublicProfile(id);}
const v103PortfolioTabs=$('v5PortfolioTabs');
if(v103PortfolioTabs){v103PortfolioTabs.addEventListener('click',event=>{const button=event.target.closest('button[data-v5-filter]');if(!button||!v103PortfolioTabs.contains(button))return;event.preventDefault();v5Filter=button.dataset.v5Filter;renderV5Feed();});}

function renderV5Feed(){const gal=$('pubMedia');gal.replaceChildren();gal.classList.toggle('photos-mode',v5Filter==='image');document.querySelectorAll('[data-v5-filter]').forEach(b=>b.classList.toggle('active',b.dataset.v5Filter===v5Filter));const items=v5Media.filter(m=>v5Filter==='all'||m.media_type===v5Filter);if(v5Media.length&&!items.length)$('pubMediaEmpty').textContent=v5Filter==='video'?'No videos yet. Try Photos or All work.':'No photos yet. Try Videos or All work.';else if(v5Media.length)$('pubMediaEmpty').textContent='';for(const m of items){const figure=document.createElement('figure');figure.className=m.media_type==='video'?'film':'';const media=document.createElement(m.media_type==='video'?'video':'img');media.src=m.media_url;if(m.media_type==='video'){media.controls=!!m.thumbnail_url;media.playsInline=true;media.preload='metadata';if(m.thumbnail_url)media.poster=m.thumbnail_url}else{media.loading='lazy';media.alt=m.title||'Portfolio photo';media.onerror=()=>{media.alt='Photo could not load — please refresh and try again';};}media.ondblclick=()=>expandV5(m);if(m.media_type==='image'){media.onclick=()=>expandV5(m);media.tabIndex=0;media.setAttribute('role','button');media.setAttribute('aria-label','Open photo full size');media.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();expandV5(m)}}}let cover=null;if(m.media_type==='video'&&m.thumbnail_url){media.removeAttribute('src');media.controls=false;media.preload='none';cover=document.createElement('button');cover.className='v7-video-cover';cover.type='button';cover.setAttribute('aria-label','Play '+(m.caption||m.title||'wedding film'));const poster=document.createElement('img');poster.src=m.thumbnail_url;poster.alt='Video cover for '+(m.caption||m.title||'film');poster.loading='lazy';const play=text('span','▶','v7-play');cover.append(poster,play);cover.onclick=()=>expandV5(m);media.replaceWith(cover)}const caption=text('figcaption',m.caption||m.title||'Selected work');const actions=document.createElement('div');actions.className='v5-actions';const like=text('button','♡ Like');const comments=text('button','💬 Comments');const expand=text('button',m.media_type==='image'?'⛶ View photo':'⛶ Expand');const commentArea=document.createElement('div');commentArea.className='v5-comments hidden';expand.onclick=()=>expandV5(m);actions.append(like,comments,expand);figure.append(m.media_type==='video'&&m.thumbnail_url?cover:media,caption,actions,commentArea);gal.append(figure);initV5Social(m,like,comments,commentArea);}}
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
  $('v5ExpandedCaption').textContent=m.caption||m.title||'';
  $('v8PlayerTitle').textContent=m.title||'Selected work';
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

async function initV5Social(m,like,comments,area){const {data:likes,error}=await client.from('portfolio_likes').select('user_id').eq('media_id',m.id).limit(1000);if(error){like.title='Run the V5 database migration to enable likes';comments.title='Run the V5 database migration to enable comments';like.disabled=true;comments.disabled=true;return}let myLike=(likes||[]).some(l=>l.user_id===user?.id);let count=(likes||[]).length;const refresh=()=>{like.textContent=(myLike?'♥':'♡')+' '+count;like.classList.toggle('liked',myLike)};refresh();like.onclick=async()=>{if(!user){alert('Sign in to like this post.');return}like.disabled=true;const result=myLike?await client.from('portfolio_likes').delete().eq('media_id',m.id).eq('user_id',user.id):await client.from('portfolio_likes').insert({media_id:m.id,user_id:user.id});like.disabled=false;if(result.error){alert(result.error.message);return}count+=myLike?-1:1;myLike=!myLike;refresh()};comments.onclick=async()=>{area.classList.toggle('hidden');if(area.classList.contains('hidden'))return;await loadV5Comments(m,area)}}
async function loadV5Comments(m,area){area.replaceChildren();const {data,error}=await client.from('portfolio_comments').select('id,user_id,body,created_at').eq('media_id',m.id).order('created_at',{ascending:false}).limit(40);if(error){area.append(text('p','Comments unavailable: '+error.message));return}for(const c of data||[])area.append(text('div',(c.user_id===user?.id?'You: ':'Member: ')+c.body,'v5-comment-item'));if(!user){area.append(text('small','Sign in to leave a comment.'));return}const form=document.createElement('form');const inp=document.createElement('input');inp.placeholder='Write a respectful comment…';inp.maxLength=500;inp.required=true;const submit=text('button','Post');submit.type='submit';form.append(inp,submit);form.onsubmit=async e=>{e.preventDefault();submit.disabled=true;const {error}=await client.from('portfolio_comments').insert({media_id:m.id,user_id:user.id,body:inp.value.trim()});submit.disabled=false;if(error){alert(error.message);return}await loadV5Comments(m,area)};area.append(form)}

function startInquiry(p){if(!user){go('account');say('Sign in or create a free account to send a project inquiry.');return}if(!p||p.id===user.id)return;viewed=p;$('inquiryTo').textContent='To '+p.display_name;$('inquiryFormStatus').textContent='';$('inquiryModal').classList.remove('hidden')}
$('closeInquiry').onclick=()=>$('inquiryModal').classList.add('hidden');$('inquiryModal').addEventListener('click',e=>{if(e.target===$('inquiryModal'))$('inquiryModal').classList.add('hidden')});
$('inquiryForm').addEventListener('submit',async e=>{e.preventDefault();if(!user||!viewed||viewed.id===user.id)return;const f=new FormData(e.target);const row={sender_id:user.id,recipient_id:viewed.id,subject:String(f.get('subject')).trim(),message:String(f.get('message')).trim(),event_date:f.get('event_date')||null,budget:f.get('budget')?Number(f.get('budget')):null};$('inquiryFormStatus').textContent='Sending…';const {error}=await client.from('inquiries').insert(row);if(error){$('inquiryFormStatus').textContent='Could not send: '+error.message;return}$('inquiryForm').reset();$('inquiryModal').classList.add('hidden');alert('Your inquiry was sent! See it in Inquiries → Sent.');go('inquiries');mode='sent';await loadInquiries()});
$('receivedTab').onclick=()=>{mode='received';loadInquiries()};$('sentTab').onclick=()=>{mode='sent';loadInquiries()};
async function loadInquiries(){if(!user)return;$('receivedTab').classList.toggle('on',mode==='received');$('sentTab').classList.toggle('on',mode==='sent');const key=mode==='received'?'recipient_id':'sender_id';const {data,error}=await client.from('inquiries').select('*').eq(key,user.id).order('created_at',{ascending:false}).limit(100);const out=$('inquiryList');out.replaceChildren();$('inquiryStatus').textContent=error?'Inbox unavailable: '+error.message:!(data||[]).length?'No '+mode+' inquiries yet.':`${data.length} ${mode} inquiries`;if(error)return;await updateInquiryBadge();for(const i of data||[]){const d=document.createElement('article');d.className='inquiry-card';const top=document.createElement('header');top.append(text('h3',i.subject),text('span',i.status||'new','tag'));const when=i.event_date?' · Project date '+i.event_date:'';d.append(top,text('small',new Date(i.created_at).toLocaleString()+when),text('p',i.message));if(i.budget!==null)d.append(text('p','Budget: $'+i.budget));if(mode==='received'&&i.status==='new'){const btn=text('button','Mark reviewed','filter');btn.onclick=async()=>{const {error}=await client.from('inquiries').update({status:'reviewed'}).eq('id',i.id).eq('recipient_id',user.id);if(error)alert(error.message);else loadInquiries()};d.append(btn)}out.append(d)}}
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
 const video=document.createElement('video');video.src=film.media_url;video.controls=true;video.playsInline=true;video.preload='metadata';if(film.thumbnail_url)video.poster=film.thumbnail_url;
 out.append(video);$('v111FeaturedCaption').textContent=film.caption||film.title||'Featured film';area.classList.remove('hidden');
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
$('v12TourNext')?.addEventListener('click',async()=>{if(v12TourIndex<3){v12TourIndex++;v12TourDisplay()}else{await v12CloseTour();go('studio');$('v12ThemePanel')?.scrollIntoView({behavior:'smooth',block:'center'})}});
$('v12TourSkip')?.addEventListener('click',v12CloseTour);
$('v12ReplayTour')?.addEventListener('click',v12StartTour);
$('v12PreviewTheme')?.addEventListener('click',()=>{if(user)openProfile(user.id)});
$('v12SaveTheme')?.addEventListener('click',async()=>{if(!user||!['pro','studio'].includes(v12Tier))return;const button=$('v12SaveTheme');button.disabled=true;$('v12ThemeStatus').textContent='Saving your theme…';const {error}=await client.from('creator_profile_experiences').upsert({user_id:user.id,theme:v12ThemeForTier(v12Tier,v12Theme)},{onConflict:'user_id'});button.disabled=false;$('v12ThemeStatus').textContent=error?'Could not save: '+error.message:'Saved! Visitors will now see your new cinematic profile.'});
async function v12LoadMyExperience(){if(!user){v12Tier='free';$('v12ThemePanel').hidden=true;return}const {data:membership,error:membershipError}=await client.from('creator_memberships').select('tier,status').eq('user_id',user.id).maybeSingle();if(membershipError){console.warn('Membership query failed:',membershipError.message);$('v12ThemePanel').hidden=true;return}v12Tier=membership?.status==='active'&&['pro','studio'].includes(membership?.tier)?membership.tier:'free';$('v12ThemePanel').hidden=v12Tier==='free';if(v12Tier==='free')return;const {data:settings,error}=await client.from('creator_profile_experiences').select('theme,onboarding_done').eq('user_id',user.id).maybeSingle();if(error){$('v12ThemeStatus').textContent='Install V12_PROFILE_EXPERIENCES.sql to enable themes.';return}v12Theme=v12ThemeForTier(v12Tier,settings?.theme);v12Onboarded=!!settings?.onboarding_done;v12RenderChoices();$('v12ThemeStatus').textContent=v12Tier==='studio'?'Studio collection unlocked · Choose your production house aesthetic.':'Pro collection unlocked · Choose your cinematic aesthetic.';if(!v12Onboarded&&!recoveryAuthorized&&!pendingRecoverySession?.user)v12StartTour()}
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
async function v12ApplyPublicProfile(id){
 const root=$('publicprofile');v121PublicId=id;
 root.querySelector('.v12-hero-kicker')?.remove();root.querySelector('.v12-tag')?.remove();root.querySelector('.v121-premium-badge')?.remove();
 const editor=$('v121OwnerEditor');editor.hidden=true;v121PaintTheme('free','');
 const {data:publicTier,error}=await client.rpc('public_creator_premium_tier',{creator_uuid:id});
 if(error||!['pro','studio'].includes(publicTier))return;
 if(viewed?.id!==id)return;
 const tier=publicTier;
 const result=await client.from('creator_profile_experiences').select('theme').eq('user_id',id).maybeSingle();
 const theme=v12ThemeForTier(tier,result.data?.theme);v121PaintTheme(tier,theme);
 const heading=$('pubName');
 const badge=text('div',tier==='studio'?'✦ SHUTTERHUNTERS STUDIO MEMBER':'♛ SHUTTERHUNTERS PRO CREATOR','v121-premium-badge');
 const kicker=text('div',tier==='studio'?'A CREATIVE HOUSE FOR BIG IDEAS':theme==='golden'?'CHASING THE GOLDEN LIGHT':theme==='editorial'?'THE ART OF SEEING DIFFERENTLY':'EVERY FRAME TELLS A STORY','v12-hero-kicker');
 heading.before(badge,kicker);
 if(user?.id===id){v121OwnerTier=tier;v121SavedTheme=theme;v121DraftTheme=theme;editor.hidden=false;v121EditorChoices();$('v121EditorStatus').textContent='Your visitors are viewing your published design.'}
}
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
   card.append(media,text('p',(m.media_type==='video'?'🎬 ':'📷 ')+(m.caption||m.title||'Untitled')));out.append(card)
 }
}
const v121OriginalStudioTab=studioTab;
studioTab=function(tab){v121OriginalStudioTab(tab);if(tab==='details')v121LoadDetailsMedia()};


// A verified PASSWORD_RECOVERY event may have arrived before the form was created.
recoveryUiReady=true;
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
})();
