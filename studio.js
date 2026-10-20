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
const text=(tag,value,cls)=>{const n=document.createElement(tag);if(cls)n.className=cls;n.textContent=value??'';return n};
const validLink=s=>{try{const u=new URL(s);return /^https?:$/.test(u.protocol)?u.href:null}catch{return null}};
function updateMenu(){ $('studioGuest').classList.toggle('hidden',!!user);$('studioMember').classList.toggle('hidden',!user);$('inquiryGuest').classList.toggle('hidden',!!user);$('inquiryMember').classList.toggle('hidden',!user);if(user)loadMyMedia();}
function buildChoices(){const container=$('specialtyChoices');for(const c of choices){const lbl=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';cb.value=c;cb.name='extraSpecialty';lbl.append(cb,document.createTextNode(c));container.append(lbl)}}
buildChoices();
function studioTab(tab){for(const t of ['posts','details','reviews']){const el=$(t==='posts'?'studioPostsTab':t==='details'?'studioDetailsTab':'studioReviewsTab');el.classList.toggle('hidden',t!==tab)}document.querySelectorAll('[data-studio-tab]').forEach(b=>b.classList.toggle('on',b.dataset.studioTab===tab))}
document.querySelectorAll('[data-studio-tab]').forEach(b=>b.addEventListener('click',()=>studioTab(b.dataset.studioTab)));
$('postMediaForm').querySelectorAll('input[name="postType"]').forEach(r=>r.addEventListener('change',()=>{$('postMediaFile').accept=r.value==='video'?'video/mp4,video/webm,video/quicktime,.mov,.mp4,.webm':'image/jpeg,image/png,image/webp';$('postMediaFile').value=''}));

function specialtiesOf(p){return [...new Set([p.specialty,...(Array.isArray(p.specialties)?p.specialties:[])].filter(Boolean))]}
function primaryAndSelected(f){const primary=String(f.get('specialty')||'Weddings');return [primary,...[...$('specialtyChoices').querySelectorAll('input:checked')].map(x=>x.value).filter(x=>x!==primary)]}
function fillForm(p){const f=$('onlineProfileForm');for(const [key,val] of Object.entries(p)){const el=f.elements.namedItem(key);if(!el||key==='specialties')continue;if(el.type==='checkbox')el.checked=!!val;else el.value=val??''}const set=new Set(p.specialties||[]);$('specialtyChoices').querySelectorAll('input').forEach(x=>x.checked=set.has(x.value));}
function showStudio(){if(!user)return;$('studioProfileSummary').replaceChildren();const p=profile;const summary=$('studioProfileSummary');if(!p){summary.append(text('p','First, add your name, location, main specialty and rate in My Account. Then upload your creative work below.'));return}summary.append(text('h3',p.display_name),text('p',p.role+' · '+p.city+', '+p.state),text('p',specialtiesOf(p).join('  ·  ')));if(!p.is_public)summary.append(text('p','Private profile — turn on Publish in My Account when ready.'))}
async function updateAuth(){const {data,error}=await client.auth.getUser();const before=user?.id;user=error?null:data.user;guest.classList.toggle('hidden',!!user);member.classList.toggle('hidden',!user);updateMenu();if(!user){profile=null;return}$('signedInAs').textContent=user.email||'Signed in';if(before!==user.id||!profile){const q=await client.from('profiles').select('*').eq('id',user.id).maybeSingle();if(q.error){say('Could not load your profile: '+q.error.message);return}profile=q.data; if(profile)fillForm(profile);showStudio();await updateInquiryBadge()}}
async function refreshProfile(){if(!user)return;const {data,error}=await client.from('profiles').select('*').eq('id',user.id).maybeSingle();if(!error){profile=data;if(profile)fillForm(profile);showStudio();await updateInquiryBadge()}}
const forms=[$('signupForm'),$('loginForm')];
if(!ready){forms.forEach(f=>f.querySelectorAll('input,button').forEach(x=>x.disabled=true));notice.textContent='Account configuration is missing. Upload config.js containing only your public Supabase project URL and publishable key.';return}
client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
notice.textContent='Connected to ShutterHunters accounts. Create your studio, upload work, and manage inquiries.';
forms[0].addEventListener('submit',async e=>{e.preventDefault();say('Creating your account…');const f=new FormData(e.target);const {error}=await client.auth.signUp({email:String(f.get('email')),password:String(f.get('password')),options:{emailRedirectTo:location.origin+location.pathname}});say(error?error.message:'Account requested. Check your inbox for a confirmation email if required.');if(!error)await updateAuth()});
forms[1].addEventListener('submit',async e=>{e.preventDefault();say('Signing in…');const f=new FormData(e.target);const {error}=await client.auth.signInWithPassword({email:String(f.get('email')),password:String(f.get('password'))});say(error?error.message:'Signed in! Your creator studio is ready.');if(!error){await updateAuth();go('studio')}});
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
async function uploadOnePortfolio(file,kind,caption=''){
 if(!user||!profile)throw Error('Save your creator profile before publishing.');
 const {data,error}=await client.from('portfolio_media').select('media_type').eq('user_id',user.id);
 if(error)throw Error('Could not read portfolio: '+error.message);
 const count=(data||[]).filter(m=>m.media_type===kind).length, max=kind==='video'?3:12;
 if(count>=max)throw Error('Your '+(kind==='video'?'3-video':'12-photo')+' limit is reached. Remove an old item to post a new one.');
 const res=await uploadToStorage(file,kind);
 const {error:dbErr}=await client.from('portfolio_media').insert({user_id:user.id,media_type:kind,storage_path:res.path,media_url:res.url,title:file.name.slice(0,100),caption:String(caption||'').trim().slice(0,500),sort_order:count});
 if(dbErr){await client.storage.from('creator-media').remove([res.path]);throw Error(dbErr.message+' — check that PROFILE_HUB_v4.sql has run.');}
 return true;
}
$('postMediaForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget,file=$('postMediaFile').files?.[0],kind=String(new FormData(f).get('postType')||'image'),caption=String(new FormData(f).get('caption')||'').trim(),status=$('postMediaStatus'),btn=$('publishPostBtn');if(!file||!caption){status.textContent='Choose a file and add its description.';return}if(kind==='video'&&!file.type.startsWith('video/')&&!/\.(mov|mp4|webm)$/i.test(file.name)){status.textContent='Choose a video for a video post.';return}if(kind==='image'&&!file.type.startsWith('image/')){status.textContent='Choose a photo for a photo post.';return}btn.disabled=true;status.textContent='Uploading your post… Larger videos may take a while. Please keep this page open.';try{await uploadOnePortfolio(file,kind,caption);status.textContent='Published! View it below or on your public profile.';f.reset();$('postMediaFile').accept='image/jpeg,image/png,image/webp';await loadMyMedia()}catch(err){status.textContent='Could not publish: '+err.message}finally{btn.disabled=false}});
async function loadMyMedia(){if(!user||!profile)return;const out=$('manageMedia');const {data,error}=await client.from('portfolio_media').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(25);out.replaceChildren();if(error){out.append(text('p','Portfolio unavailable: '+error.message));return}if(!(data||[]).length){out.append(text('p','No posts yet — upload your first photo or film above.'));return}for(const m of data||[]){const item=document.createElement('div');item.className='gallery-item';const media=document.createElement(m.media_type==='video'?'video':'img');media.src=m.media_url;if(m.media_type==='video'){media.controls=true;media.preload='metadata';media.playsInline=true}else{media.loading='lazy';media.alt=m.caption||m.title||'My portfolio post'};const foot=text('div',m.media_type==='video'?'🎬 Video':'📷 Photo','gallery-foot'),caption=text('div',m.caption||'No caption yet','gallery-caption'),tools=document.createElement('div');tools.className='gallery-tools';const edit=text('button','Edit caption','edit-caption');edit.onclick=async()=>{const value=prompt('Write a description for this post (500 characters maximum):',m.caption||'');if(value===null)return;if(value.length>500)return alert('Descriptions must be 500 characters or fewer.');const {error}=await client.from('portfolio_media').update({caption:value}).eq('id',m.id).eq('user_id',user.id);if(error)return alert('Could not save description: '+error.message);await loadMyMedia()};const del=text('button','Delete');del.onclick=async()=>{if(!confirm('Permanently remove this portfolio item?'))return;const {error:dbErr}=await client.from('portfolio_media').delete().eq('id',m.id).eq('user_id',user.id);if(dbErr)return alert(dbErr.message);await client.storage.from('creator-media').remove([m.storage_path]);await loadMyMedia()};tools.append(edit,del);item.append(media,foot,caption,tools);out.append(item)}}
$('viewMine').onclick=()=>openProfile(user?.id);$('hubViewProfile').onclick=()=>openProfile(user?.id);$('hubRefreshPosts').onclick=()=>loadMyMedia();
async function loadCreators(){const {data,error}=await client.from('profiles').select('id,display_name,city,state,role,specialty,specialties,hourly_rate,avatar_url,cover_url,bio,portfolio_url,instagram_url,available_for_second_shooting,is_public').eq('is_public',true).order('created_at',{ascending:false}).limit(100);if(error){console.warn('Public profiles:',error.message);return}publicList=data||[];for(const p of publicList)creatorCache.set(p.id,p);showCreators=renderCreators;renderCreators()}
function renderCreators(){const out=$('creators');out.replaceChildren();const query=$('search').value.trim().toLowerCase(),place=$('location').value.trim().toLowerCase();const matches=publicList.filter(p=>(current==='All'||specialtiesOf(p).includes(current))&&(!query||[p.display_name,p.role,...specialtiesOf(p)].join(' ').toLowerCase().includes(query))&&(!place||[p.city,p.state].join(' ').toLowerCase().includes(place)));if(!matches.length){out.append(text('div','No public creators match your search yet.','empty'));return}for(const p of matches){const item=document.createElement('article');item.className='creator';const image=document.createElement('img');image.alt='Creator portrait';image.loading='lazy';image.src=validLink(p.avatar_url)||IMAGES.creator1;const body=document.createElement('div');body.className='creatorcontent';body.append(text('h3',p.display_name),text('div',p.role+' · '+p.city+', '+p.state,'meta'));const tags=document.createElement('div');tags.className='chipline';for(const s of specialtiesOf(p).slice(0,4))tags.append(text('span',s));body.append(tags);if(p.hourly_rate!==null)body.append(text('div','From $'+p.hourly_rate+'/hr','rates'));const btn=text('button','View profile →','filter');btn.onclick=()=>openProfile(p.id);body.append(btn);item.append(image,body);out.append(item)}}
async function openProfile(id){if(!id)return;let p=creatorCache.get(id);if(!p){const {data,error}=await client.from('profiles').select('*').eq('id',id).maybeSingle();if(error||!data){alert('Profile unavailable or not published.');return}p=data}if(p.is_public===false&&id!==user?.id){alert('This profile is private.');return}viewed=p;go('publicprofile');$('pubName').textContent=p.display_name||'Creative';$('pubSubtitle').textContent=[p.role,p.city,p.state].filter(Boolean).join(' · ');$('pubBio').textContent=p.bio||'This creator is still writing their story.';$('pubCover').style.backgroundImage=validLink(p.cover_url)?'linear-gradient(0deg,#08171979,#08171912),url("'+CSS.escape(p.cover_url)+'")':'';const a=$('pubAvatar');a.replaceChildren();if(validLink(p.avatar_url)){const img=document.createElement('img');img.alt='Creator photo';img.src=p.avatar_url;a.append(img)}else a.textContent=(p.display_name||'SH').slice(0,2).toUpperCase();const specials=$('pubSpecialties');specials.replaceChildren();for(const s of specialtiesOf(p))specials.append(text('span',s));$('pubDetails').replaceChildren();if(p.hourly_rate!==null)$('pubDetails').append(text('p','Starting from $'+p.hourly_rate+'/hour'));if(p.available_for_second_shooting)$('pubDetails').append(text('p','✓ Available for second shooting'));$('pubDetails').append(text('p',p.city+', '+p.state));const links=$('pubLinks');links.replaceChildren();for(const [title,url] of [['Website',p.portfolio_url],['Instagram',p.instagram_url]]){const safe=validLink(url);if(safe){const a=document.createElement('a');a.href=safe;a.target='_blank';a.rel='noopener noreferrer';a.textContent=title+' ↗';links.append(a)}}$('inquireBtn').onclick=()=>startInquiry(p);$('inquireBtn').disabled=id===user?.id;const {data,error}=await client.from('portfolio_media').select('id,media_type,media_url,title,caption').eq('user_id',id).order('sort_order').limit(60);v5Media=data||[];v5Filter='video';$('pubMediaEmpty').textContent=error?'Gallery unavailable: '+error.message:!v5Media.length?'This creator hasn’t added portfolio work yet.':'';renderV5Feed();}
function renderV5Feed(){const gal=$('pubMedia');gal.replaceChildren();gal.classList.toggle('photos-mode',v5Filter==='image');document.querySelectorAll('[data-v5-filter]').forEach(b=>b.classList.toggle('active',b.dataset.v5Filter===v5Filter));const items=v5Media.filter(m=>v5Filter==='all'||m.media_type===v5Filter);if(v5Media.length&&!items.length)$('pubMediaEmpty').textContent=v5Filter==='video'?'No videos yet. Try Photos or All work.':'No photos yet. Try Videos or All work.';else if(v5Media.length)$('pubMediaEmpty').textContent='';for(const m of items){const figure=document.createElement('figure');figure.className=m.media_type==='video'?'film':'';const media=document.createElement(m.media_type==='video'?'video':'img');media.src=m.media_url;if(m.media_type==='video'){media.controls=true;media.playsInline=true;media.preload='metadata'}else{media.loading='lazy';media.alt=m.title||'Portfolio work'}media.ondblclick=()=>expandV5(m);const caption=text('figcaption',m.caption||m.title||'Selected work');const actions=document.createElement('div');actions.className='v5-actions';const like=text('button','♡ Like');const comments=text('button','💬 Comments');const expand=text('button','⛶ Expand');const commentArea=document.createElement('div');commentArea.className='v5-comments hidden';expand.onclick=()=>expandV5(m);actions.append(like,comments,expand);figure.append(media,caption,actions,commentArea);gal.append(figure);initV5Social(m,like,comments,commentArea);}}
function expandV5(m){const root=$('v5Lightbox'),area=$('v5Expanded');area.replaceChildren();const el=document.createElement(m.media_type==='video'?'video':'img');el.src=m.media_url;if(m.media_type==='video'){el.controls=true;el.autoplay=true;el.playsInline=true}else el.alt=m.title||'Portfolio photo';area.append(el);$('v5ExpandedCaption').textContent=m.caption||'';root.hidden=false;document.body.style.overflow='hidden'}
function closeV5(){const video=$('v5Expanded').querySelector('video');if(video)video.pause();$('v5Lightbox').hidden=true;document.body.style.overflow=''}
$('v5Close').onclick=closeV5;$('v5Lightbox').addEventListener('click',e=>{if(e.target===$('v5Lightbox'))closeV5()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeV5()});
document.querySelectorAll('[data-v5-filter]').forEach(b=>b.onclick=()=>{v5Filter=b.dataset.v5Filter;renderV5Feed()});
async function initV5Social(m,like,comments,area){const {data:likes,error}=await client.from('portfolio_likes').select('user_id').eq('media_id',m.id).limit(1000);if(error){like.title='Run the V5 database migration to enable likes';comments.title='Run the V5 database migration to enable comments';like.disabled=true;comments.disabled=true;return}let myLike=(likes||[]).some(l=>l.user_id===user?.id);let count=(likes||[]).length;const refresh=()=>{like.textContent=(myLike?'♥':'♡')+' '+count;like.classList.toggle('liked',myLike)};refresh();like.onclick=async()=>{if(!user){alert('Sign in to like this post.');return}like.disabled=true;const result=myLike?await client.from('portfolio_likes').delete().eq('media_id',m.id).eq('user_id',user.id):await client.from('portfolio_likes').insert({media_id:m.id,user_id:user.id});like.disabled=false;if(result.error){alert(result.error.message);return}count+=myLike?-1:1;myLike=!myLike;refresh()};comments.onclick=async()=>{area.classList.toggle('hidden');if(area.classList.contains('hidden'))return;await loadV5Comments(m,area)}}
async function loadV5Comments(m,area){area.replaceChildren();const {data,error}=await client.from('portfolio_comments').select('id,user_id,body,created_at').eq('media_id',m.id).order('created_at',{ascending:false}).limit(40);if(error){area.append(text('p','Comments unavailable: '+error.message));return}for(const c of data||[])area.append(text('div',(c.user_id===user?.id?'You: ':'Member: ')+c.body,'v5-comment-item'));if(!user){area.append(text('small','Sign in to leave a comment.'));return}const form=document.createElement('form');const inp=document.createElement('input');inp.placeholder='Write a respectful comment…';inp.maxLength=500;inp.required=true;const submit=text('button','Post');submit.type='submit';form.append(inp,submit);form.onsubmit=async e=>{e.preventDefault();submit.disabled=true;const {error}=await client.from('portfolio_comments').insert({media_id:m.id,user_id:user.id,body:inp.value.trim()});submit.disabled=false;if(error){alert(error.message);return}await loadV5Comments(m,area)};area.append(form)}

function startInquiry(p){if(!user){go('account');say('Sign in or create a free account to send a project inquiry.');return}if(!p||p.id===user.id)return;viewed=p;$('inquiryTo').textContent='To '+p.display_name;$('inquiryFormStatus').textContent='';$('inquiryModal').classList.remove('hidden')}
$('closeInquiry').onclick=()=>$('inquiryModal').classList.add('hidden');$('inquiryModal').addEventListener('click',e=>{if(e.target===$('inquiryModal'))$('inquiryModal').classList.add('hidden')});
$('inquiryForm').addEventListener('submit',async e=>{e.preventDefault();if(!user||!viewed||viewed.id===user.id)return;const f=new FormData(e.target);const row={sender_id:user.id,recipient_id:viewed.id,subject:String(f.get('subject')).trim(),message:String(f.get('message')).trim(),event_date:f.get('event_date')||null,budget:f.get('budget')?Number(f.get('budget')):null};$('inquiryFormStatus').textContent='Sending…';const {error}=await client.from('inquiries').insert(row);if(error){$('inquiryFormStatus').textContent='Could not send: '+error.message;return}$('inquiryForm').reset();$('inquiryModal').classList.add('hidden');alert('Your inquiry was sent! See it in Inquiries → Sent.');go('inquiries');mode='sent';await loadInquiries()});
$('receivedTab').onclick=()=>{mode='received';loadInquiries()};$('sentTab').onclick=()=>{mode='sent';loadInquiries()};
async function loadInquiries(){if(!user)return;$('receivedTab').classList.toggle('on',mode==='received');$('sentTab').classList.toggle('on',mode==='sent');const key=mode==='received'?'recipient_id':'sender_id';const {data,error}=await client.from('inquiries').select('*').eq(key,user.id).order('created_at',{ascending:false}).limit(100);const out=$('inquiryList');out.replaceChildren();$('inquiryStatus').textContent=error?'Inbox unavailable: '+error.message:!(data||[]).length?'No '+mode+' inquiries yet.':`${data.length} ${mode} inquiries`;if(error)return;await updateInquiryBadge();for(const i of data||[]){const d=document.createElement('article');d.className='inquiry-card';const top=document.createElement('header');top.append(text('h3',i.subject),text('span',i.status||'new','tag'));const when=i.event_date?' · Project date '+i.event_date:'';d.append(top,text('small',new Date(i.created_at).toLocaleString()+when),text('p',i.message));if(i.budget!==null)d.append(text('p','Budget: $'+i.budget));if(mode==='received'&&i.status==='new'){const btn=text('button','Mark reviewed','filter');btn.onclick=async()=>{const {error}=await client.from('inquiries').update({status:'reviewed'}).eq('id',i.id).eq('recipient_id',user.id);if(error)alert(error.message);else loadInquiries()};d.append(btn)}out.append(d)}}
async function updateInquiryBadge(){if(!user)return;const {count,error}=await client.from('inquiries').select('id',{count:'exact',head:true}).eq('recipient_id',user.id).eq('status','new');if(error)return;const n=count||0;$('navInboxCount').textContent=n;$('navInboxCount').classList.toggle('hidden',!n);$('hubInboxCount').textContent=n?'('+n+' new)':''}
const oldGo=go;go=function(id){if(id==='profile')id='studio';oldGo(id);if(id==='studio')showStudio();if(id==='inquiries')loadInquiries()};
client.auth.onAuthStateChange(()=>{setTimeout(updateAuth,0)});
updateAuth();loadCreators();
})();
