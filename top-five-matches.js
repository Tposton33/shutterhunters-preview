/* ShutterHunters — LIVE Post-a-Job -> cinematic Top Five creator matches (v10)
 * Additive: leaves the existing Jobs page, opportunities and live data untouched.
 * Demo inquiries are local to this browser; never reports a real delivery.
 */
(()=>{'use strict';if(window.__shTopFiveV5)return;window.__shTopFiveV5=true;
const css=`
#sh5-demo{position:fixed;inset:0;z-index:2147482000;background:#071e18;color:#f6f4e9;overflow-y:auto;font-family:Inter,Arial,sans-serif}#sh5-demo[hidden]{display:none!important}#sh5-demo *{box-sizing:border-box}#sh5-demo button,#sh5-demo input,#sh5-demo textarea,#sh5-demo select{font:inherit}#sh5-demo button{cursor:pointer}#sh5-demo .wrap{width:min(1180px,calc(100% - 38px));margin:auto}#sh5-demo .nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0;gap:12px;border-bottom:1px solid #ffffff21}#sh5-demo .logo{font:700 22px Georgia,serif;letter-spacing:-.5px}#sh5-demo .logo em{color:#d4ac72;font-style:normal}#sh5-demo .quiet{color:#b8c8c0;font-size:13px;line-height:1.6}#sh5-demo .textbtn{background:none;color:#f5e2bb;border:none;padding:8px}#sh5-demo .step{font-size:11px;text-transform:uppercase;letter-spacing:.22em;color:#d5af79;font-weight:700}#sh5-demo h1{font:500 clamp(36px,6vw,80px)/1.07 Georgia,serif;letter-spacing:-.035em;margin:17px 0}#sh5-demo h2{font:500 clamp(28px,4vw,46px)/1.12 Georgia,serif;margin:6px 0 12px}#sh5-demo p{line-height:1.65}#sh5-demo .shell{padding:32px 0 70px}#sh5-demo .brief{max-width:820px;margin:auto}#sh5-demo .fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:25px 0}#sh5-demo label{display:block;color:#eadfc9;font-size:13px;font-weight:600}#sh5-demo input,#sh5-demo textarea,#sh5-demo select{display:block;width:100%;margin-top:8px;border:1px solid #77918766;background:#12362b;color:white;border-radius:8px;padding:14px}#sh5-demo textarea{min-height:115px;resize:vertical}#sh5-demo input::placeholder,#sh5-demo textarea::placeholder{color:#a2b7ae}#sh5-demo .wide{grid-column:1/-1}#sh5-demo .primary{background:#dfb87e;color:#10291f;border:1px solid #dfb87e;border-radius:6px;padding:14px 23px;font-weight:800}#sh5-demo .secondary{border:1px solid #d4c7a5;background:transparent;color:#f5f0e2;border-radius:6px;padding:13px 19px;font-weight:700}#sh5-demo .actions{display:flex;gap:11px;flex-wrap:wrap;margin-top:20px}#sh5-demo .flag{display:inline-flex;align-items:center;border:1px solid #b99966;color:#f6d49e;border-radius:40px;padding:7px 13px;font-size:11px;letter-spacing:.05em}#sh5-demo .topline{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap}#sh5-demo .match-stage{position:relative;height:min(610px,65vw);min-height:480px;max-width:1060px;margin:30px auto 24px;touch-action:pan-y}#sh5-demo .match-card{position:absolute;inset:0;border:1px solid #5b7165;background:#19382c;border-radius:18px;display:grid;grid-template-columns:1.05fr 1fr;overflow:hidden;box-shadow:0 34px 65px #0007;transition:transform .55s cubic-bezier(.2,.7,.2,1),opacity .45s;user-select:none}#sh5-demo .photo{position:relative;background:#28493b;min-height:230px}#sh5-demo .photo img{display:block;width:100%;height:100%;position:absolute;inset:0;object-fit:cover}#sh5-demo .photo:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,#10271a70,transparent 45%);pointer-events:none}#sh5-demo .rank{position:absolute;top:24px;left:24px;z-index:1;background:#dfb87e;color:#10251c;padding:11px 16px;border-radius:5px;font-size:12px;font-weight:800;letter-spacing:.09em}#sh5-demo .info{display:flex;flex-direction:column;justify-content:center;padding:clamp(22px,4vw,53px)}#sh5-demo .info h2{font-size:clamp(36px,4.6vw,66px)}#sh5-demo .detail{color:#b2c9bd;font-size:14px}#sh5-demo .chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:15px}#sh5-demo .chips span{font-size:11px;padding:7px 10px;border:1px solid #8eac956e;border-radius:22px}#sh5-demo .controls{display:flex;gap:15px;justify-content:center;align-items:center;flex-wrap:wrap}#sh5-demo .circle{border:1px solid #b9c9b9;border-radius:50%;background:transparent;color:#fff;width:44px;height:44px;font-size:25px}#sh5-demo .dots{display:flex;gap:9px}#sh5-demo .dot{width:7px;height:7px;background:#6c8e79;border-radius:50%}#sh5-demo .dot.active{background:#dfb87e;width:21px;border-radius:6px}#sh5-demo .profile{max-width:980px;margin:30px auto;background:#133329;border:1px solid #476755;border-radius:15px;overflow:hidden}#sh5-demo .profile-hero{display:grid;grid-template-columns:1fr 1.15fr}#sh5-demo .profile-hero img{width:100%;height:360px;object-fit:cover}#sh5-demo .profile-copy{padding:32px}#sh5-demo .note{margin-top:16px;padding:12px 14px;background:#27443a;border-left:3px solid #dfb87e;color:#dde5dd;font-size:13px;line-height:1.55}#sh5-demo .portfolio{padding:0 30px 26px}#sh5-demo .portfolio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}#sh5-demo .portfolio-grid img{width:100%;height:155px;object-fit:cover;border-radius:8px}#sh5-demo .toast{margin-top:16px;color:#f6d197;font-size:14px}#sh5-demo .inbox{max-width:760px;margin:20px auto}#sh5-demo .inquiry{padding:17px;margin:10px 0;background:#173b2d;border:1px solid #50715b;border-radius:9px}#sh5-demo .inquiry small{color:#b2c8bd}#sh5-demo .inquiry textarea{min-height:70px}#sh5-demo .back{margin-bottom:12px}#sh5-demo .footer{font-size:12px;color:#a9beb0;text-align:center;padding:20px 0}#sh5-demo .publish-done{color:#d9bd87}#sh5-demo .profile-details{padding:20px 30px 32px;border-top:1px solid #ffffff21}#sh5-demo .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:14px 0 25px}#sh5-demo .stat{padding:17px;background:#0c271f;border:1px solid #54746266;border-radius:10px}#sh5-demo .stat strong{display:block;color:#edd2a0;font-size:21px;margin-bottom:4px}#sh5-demo .stat small{color:#b1c8be}#sh5-demo .alllink{display:flex;justify-content:center;gap:10px;margin:24px auto 0}#sh5-demo .sent-tag{color:#efd3a0;font-weight:700;font-size:12px;letter-spacing:.1em}#sh5-demo .profile-panels{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:18px}#sh5-demo .profile-panels>div{padding:20px;border:1px solid #50715b;border-radius:12px;background:#0d2921}#sh5-demo .profile-panels h3{font:normal 24px Georgia,serif;margin:0 0 8px}#sh5-demo .profile-panels p{margin:0;color:#c6d6cc}#sh5-demo .rate{color:#f2d0a0;font-size:17px;font-weight:750;margin:13px 0} @media(max-width:700px){#sh5-demo .stats{grid-template-columns:1fr 1fr}#sh5-demo .profile-panels{grid-template-columns:1fr}#sh5-demo .profile-details{padding:20px} }
@media(max-width:700px){#sh5-demo .fields{grid-template-columns:1fr}#sh5-demo .match-stage{height:660px;min-height:0}#sh5-demo .match-card{grid-template-columns:1fr;grid-template-rows:43% 57%}#sh5-demo .info{padding:19px}#sh5-demo .info h2{font-size:33px}#sh5-demo .photo{min-height:0}#sh5-demo .profile-hero{grid-template-columns:1fr}#sh5-demo .profile-hero img{height:250px}#sh5-demo .portfolio-grid{grid-template-columns:repeat(2,1fr)}#sh5-demo .portfolio-grid img{height:110px}#sh5-demo .shell{padding-top:23px}#sh5-demo h1{font-size:41px}}

/* V3 premium full-bleed stack */
#sh5-demo{background:radial-gradient(ellipse at 50% 42%,#214b3b 0%,#0c2921 48%,#041410 100%);overscroll-behavior:contain;padding-top:env(safe-area-inset-top)}
#sh5-demo .wrap{width:min(1180px,calc(100% - 34px))}
#sh5-demo .nav{border:0;padding:13px 0 7px}
#sh5-demo .shell{padding:10px 0 56px}
#sh5-demo .match-head{text-align:center;margin:8px auto 0}
#sh5-demo .match-head h1{font:normal clamp(37px,6vw,74px)/1.03 Georgia,serif;max-width:800px;margin:7px auto 4px;letter-spacing:-.045em}
#sh5-demo .match-stage{height:650px;margin:22px auto 22px;max-width:1000px;perspective:1500px;touch-action:pan-y;isolation:isolate}
#sh5-demo .match-card{border-radius:24px;border:1px solid #bbad8766;background:#152c26;box-shadow:0 38px 86px #000b;will-change:transform;cursor:grab;transition:transform .46s cubic-bezier(.18,.83,.19,1),opacity .36s;transform-origin:center center}
#sh5-demo .match-card:active{cursor:grabbing}
#sh5-demo .match-card.is-dragging{transition:none!important}
#sh5-demo .match-card.fly-left{transform:translate3d(-125vw,-16px,0) rotate(-14deg)!important;opacity:.1!important;transition:transform .42s cubic-bezier(.3,.7,.35,1),opacity .42s!important}
#sh5-demo .photo{background:linear-gradient(135deg,#385847,#0d211d)}
#sh5-demo .photo:after{background:linear-gradient(0deg,#0a1e18cc,transparent 52%)}
#sh5-demo .info{background:linear-gradient(145deg,#1a392e,#0c211b)}
#sh5-demo .info h2{font-size:clamp(39px,4.8vw,68px);letter-spacing:-.04em}
#sh5-demo .rank{background:#debb85;color:#132a22;box-shadow:0 9px 30px #0004}
#sh5-demo .match-footer{display:flex;align-items:center;justify-content:center;gap:19px;margin-top:8px}
#sh5-demo .swipe-hint{font-size:12px;color:#c9d9cc;text-align:center;letter-spacing:.04em}
#sh5-demo .profile .actions [data-action=invite]{background:#dfb87e;color:#10291f}
@media(max-width:700px){#sh5-demo .nav .logo{font-size:17px}#sh5-demo .nav .quiet{display:none}#sh5-demo .match-head h1{font-size:clamp(35px,9.5vw,52px);max-width:340px}#sh5-demo .match-stage{height:min(650px,71svh);min-height:510px;margin:31px auto 25px}#sh5-demo .match-card{grid-template-rows:48% 52%;border-radius:20px}#sh5-demo .info{padding:22px}#sh5-demo .info h2{font-size:clamp(32px,8vw,43px);margin:8px 0}#sh5-demo .info p{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px;margin:9px 0}#sh5-demo .info .chips{display:none}#sh5-demo .info .actions{margin-top:auto;gap:8px}#sh5-demo .info .actions button{flex:1;font-size:13px;padding:13px 6px}#sh5-demo .rank{top:15px;left:15px;font-size:10px;padding:9px 11px}#sh5-demo .photo img{object-position:center 30%}#sh5-demo .shell{padding-top:9px}#sh5-demo .footer{display:none}}
@media(max-width:370px){#sh5-demo .match-stage{height:560px}#sh5-demo .info{padding:14px}#sh5-demo .info h2{font-size:30px}}

/* V11 responsive fit: keeps the full-screen flow inside the visual viewport, even on iOS Safari. */
#sh5-demo{position:fixed!important;inset:0!important;left:0!important;right:0!important;top:0!important;bottom:0!important;width:100%!important;max-width:100vw!important;height:100dvh!important;max-height:100dvh!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch;touch-action:pan-y;contain:layout style;box-sizing:border-box!important;}
#sh5-demo,#sh5-demo *{box-sizing:border-box!important;max-width:100%;}
#sh5-demo .wrap{width:min(100% - 28px, 1180px)!important;max-width:1180px!important;margin-inline:auto!important;}
#sh5-demo .brief,#sh5-demo form,#sh5-demo .fields,#sh5-demo .profile{min-width:0!important;max-width:100%!important;}
#sh5-demo input,#sh5-demo select,#sh5-demo textarea{min-width:0!important;width:100%!important;font-size:16px!important;}
#sh5-demo .match-stage{width:100%!important;max-width:100%!important;min-width:0!important;}
#sh5-demo .match-card{min-width:0!important;max-width:100%!important;width:100%!important;}
#sh5-demo .photo,#sh5-demo .info{min-width:0!important;max-width:100%!important;}
#sh5-demo .info h2,#sh5-demo .info p,#sh5-demo .info .detail{overflow-wrap:anywhere;}
@media (max-width:700px){
#sh5-demo{padding-top:max(env(safe-area-inset-top), 8px)!important;padding-bottom:env(safe-area-inset-bottom)!important;}
#sh5-demo .wrap{width:calc(100% - 24px)!important;}
#sh5-demo .nav{flex-wrap:wrap;gap:4px;padding:6px 0!important;}
#sh5-demo .nav .logo{font-size:16px!important;}
#sh5-demo .nav .textbtn{padding:8px 4px!important;font-size:12px!important;}
#sh5-demo .fields{grid-template-columns:minmax(0,1fr)!important;gap:14px!important;}
#sh5-demo .match-head h1{font-size:clamp(29px,8vw,42px)!important;max-width:100%!important;}
#sh5-demo .match-stage{height:clamp(455px,68dvh,590px)!important;min-height:0!important;margin:22px auto 20px!important;}
#sh5-demo .match-card{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:42% 58%!important;}
#sh5-demo .info{padding:clamp(12px,3.5vw,20px)!important;overflow:hidden!important;}
#sh5-demo .info h2{font-size:clamp(25px,6.4vw,37px)!important;line-height:1.08!important;}
#sh5-demo .info .actions{gap:6px!important;display:flex!important;flex-wrap:nowrap!important;}
#sh5-demo .info .actions button{min-width:0!important;flex:1 1 0!important;font-size:clamp(10px,3vw,13px)!important;padding:11px 5px!important;white-space:normal!important;}
#sh5-demo .info .rate{font-size:14px!important;margin:6px 0!important;}
#sh5-demo .profile-hero{grid-template-columns:minmax(0,1fr)!important;}
#sh5-demo .profile-copy,#sh5-demo .portfolio{padding:18px!important;}
#sh5-demo .actions{max-width:100%!important;}
#sh5-demo .actions button{max-width:100%!important;}
}
@media (max-width:375px){#sh5-demo .match-stage{height:480px!important;}#sh5-demo .info p{display:none!important;}#sh5-demo .info h2{font-size:26px!important;}}


#sh5-demo .sh5-media-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));align-items:stretch;margin:14px 0 24px}
#sh5-demo .sh5-video-tile{min-width:0;background:#061811;border-radius:10px;overflow:hidden}
#sh5-demo .sh5-video-tile video{width:100%;height:280px;max-height:55vh;display:block;object-fit:contain;background:#061811}
#sh5-demo .sh5-media-grid img{width:100%;height:250px;object-fit:cover;border-radius:10px}
@media(max-width:700px){#sh5-demo .sh5-video-tile video{height:270px}#sh5-demo .sh5-media-grid img{height:195px}}
`;let style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const samples=[
{name:'Alex Carter',region:'Sacramento, CA',specialty:'Wedding filmmaker',types:['Wedding','Video','Event'],style:'Cinematic, documentary storytelling',bio:'Warm human stories, natural light and timeless motion. An editorial style rooted in authentic moments.',photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1100&fit=crop',skills:['Wedding films','Storytelling','Natural light']},
{name:'Maya Chen',region:'Elk Grove, CA',specialty:'Wedding photographer',types:['Wedding','Photo','Portrait'],style:'Vintage editorial and candid',bio:'Honest moments with an elegant vintage-inspired finish. Thoughtful, unscripted visual storytelling.',photo:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1100&fit=crop',skills:['Film-inspired','Weddings','Editorial']},
{name:'Jordan Brooks',region:'Roseville, CA',specialty:'Brand filmmaker',types:['Commercial','Video','Event'],style:'Bold commercial cinema',bio:'A refined approach to brand campaigns and promotional films with a beautiful cinematic finish.',photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1100&fit=crop',skills:['Brand stories','Video','Campaigns']},
{name:'Sophie Martin',region:'Folsom, CA',specialty:'Event photographer',types:['Event','Photo','Wedding'],style:'Natural documentary',bio:'Capturing all the meaningful in-between moments at celebrations, gatherings and milestone events.',photo:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1100&fit=crop',skills:['Events','Lifestyle','Candid']},
{name:'Chris Diaz',region:'Sacramento, CA',specialty:'Creative director / filmmaker',types:['Commercial','Video','Photo'],style:'Moody vintage cinema',bio:'Distinctive visual treatments, rich colors and bold concepts for artists and creative brands.',photo:'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=1100&fit=crop',skills:['Direction','Music','Vintage']}
].map((x,i)=>({...x,id:'sh5-demo-'+(i+1),subscriber:true,rate:[115,145,95,120,160][i],rateUnit:'hour',projects:[32,46,27,38,51][i],experience:[7,9,6,8,11][i]}));
let bridgeClient=null;
function getBridge(){
  if(bridgeClient)return bridgeClient;
  const cfg=window.SHUTTERHUNTERS_CONFIG||{};
  if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase?.createClient)return null;
  bridgeClient=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});
  return bridgeClient;
}
async function realPremiumMatches(){
  const db=getBridge();if(!db)return [];
  const {data:members,error:memberError}=await db.from('creator_memberships').select('user_id,tier,status').eq('status','active').in('tier',['pro','studio']).limit(100);
  if(memberError){console.warn('Premium matches unavailable:',memberError.message);return []}
  const ids=(members||[]).map(m=>m.user_id).filter(Boolean);
  if(!ids.length)return [];
  const {data:profiles,error}=await db.from('profiles').select('id,display_name,city,state,role,specialty,specialties,hourly_rate,avatar_url,cover_url,bio,is_public').eq('is_public',true).in('id',ids).limit(100);
  if(error){console.warn('Premium profile lookup unavailable:',error.message);return []}
  return (profiles||[]).map((p,i)=>({id:p.id,real:true,name:p.display_name||'Creative Professional',region:[p.city,p.state].filter(Boolean).join(', '),specialty:p.specialty||p.role||'Creative',types:[p.specialty,...(Array.isArray(p.specialties)?p.specialties:[])].filter(Boolean).flatMap(v=>{const x=String(v).toLowerCase();return [v,...(/wedding/.test(x)?['Wedding']:[]),...(/video|film/.test(x)?['Video']:[]),...(/photo/.test(x)?['Photo']:[]),...(/event/.test(x)?['Event']:[]),...(/commercial|brand/.test(x)?['Commercial']:[])]}),style:p.role||p.specialty||'Creative storytelling',bio:p.bio||'Explore this creator’s profile and portfolio.',photo:p.cover_url||p.avatar_url||samples[i%samples.length].photo,skills:(Array.isArray(p.specialties)&&p.specialties.length?p.specialties:[p.specialty||'Creative']),rate:p.hourly_rate??'Contact for rate',rateUnit:'hour',experience:'—',projects:'—',subscriber:true}));
}
function nativeInbox(){
  exit();
  const target=[...document.querySelectorAll('button,a,[role="button"]')].find(el=>{const t=(el.textContent||el.getAttribute('aria-label')||'').trim();return /^Inbox(?:\s*\d+)?$/i.test(t)||/^Inquiries$/i.test(t)});
  if(target)target.click();else {alert('Your inquiry was saved. Open Inbox, then Sent, from the ShutterHunters navigation.');return}
  setTimeout(()=>{document.getElementById('sentTab')?.click();renderDemoSentSoon()},180);
}
async function sendRealInquiry(creator,personalNote){
 const db=getBridge();if(!creator?.real||!db)throw Error('This is a fictional demo profile. To send a real inquiry, choose a real Premium creator account.');
 const {data:auth,error:authError}=await db.auth.getUser();const user=auth?.user;
 if(authError||!user)throw Error('Sign in to ShutterHunters before sending an inquiry.');
 if(user.id===creator.id)throw Error('You cannot invite your own account.');
 const rawBudget=String(brief.budget||'').replace(/,/g,'');const numBudget=/^\s*\$?\s*\d+(?:\.\d+)?\s*$/.test(rawBudget)?Number(rawBudget.replace('$','')):null;
 const detail=[brief.details,`Project location: ${brief.location||'Not specified'}`,`Creative category: ${brief.category||'Not specified'}`,`Requested service: ${brief.service==='both'?'Photographer and videographer':brief.service||'Photographer'}`,`Budget: ${brief.budget||'To discuss'}`,`Personal note: ${personalNote}`].filter(Boolean).join('\n\n');
 const {error}=await db.from('inquiries').insert({sender_id:user.id,recipient_id:creator.id,subject:String(brief.title||'Project inquiry').slice(0,110),message:detail,event_date:brief.date||null,budget:numBudget});
 if(error)throw Error(error.message);
}
// V13: portfolio preview is taken from published portfolio_media, not a repeated cover image.
function safeMediaUrl(url){try{const u=new URL(String(url||''),location.href);return u.protocol==='https:'||u.protocol==='http:'?u.href:''}catch{return ''}}
async function hydrateMatchMedia(matches){
 const ids=matches.map(p=>p.id).filter(Boolean);if(!ids.length)return;
 const client=getBridge();if(!client)return;
 const {data,error}=await client.from('portfolio_media').select('id,user_id,media_type,media_url,thumbnail_url,title,sort_order').in('user_id',ids).order('sort_order',{ascending:true}).limit(300);
 if(error){console.warn('Creator portfolio previews unavailable:',error.message);return}
 const groups=new Map();for(const m of data||[]){if(!groups.has(m.user_id))groups.set(m.user_id,[]);if(safeMediaUrl(m.media_url))groups.get(m.user_id).push(m)}
 for(const p of matches)p.media=groups.get(p.id)||[];
 // Respect the creator's chosen featured film when one has been saved.
 const {data:featured,error:featuredError}=await client.from('creator_featured_films').select('user_id,media_id').in('user_id',ids);
 if(!featuredError){for(const f of featured||[]){const p=matches.find(x=>x.id===f.user_id);if(p)p.featuredVideoId=f.media_id;}}

}
function preferredMedia(p){
 const media=p.media||[],service=String(brief.service||'').toLowerCase();
 const photos=media.filter(m=>m.media_type==='image'),videos=media.filter(m=>m.media_type==='video');
 if(service==='photographer')return photos.slice(0,8);
 if(p.featuredVideoId)videos.sort((a,b)=>Number(b.id===p.featuredVideoId)-Number(a.id===p.featuredVideoId));
 if(service==='videographer')return videos.slice(0,1);
 if(service==='both')return [...videos.slice(0,1),...photos.slice(0,5)];
 return [...videos.slice(0,2),...photos.slice(0,5)];
}
function portfolioMarkup(p){
 const items=preferredMedia(p);const service=String(brief.service||'').toLowerCase();
 const heading=service==='photographer'?'Featured Photography':service==='videographer'?'Featured Film':service==='both'?'Featured Film & Photography':'Featured Creative Work';
 if(!items.length)return `<h2>${heading}</h2><p class="quiet">This creator has not uploaded ${service==='videographer'?'videos':service==='photographer'?'photos':'work'} for this preview yet. View their full profile for everything they have shared.</p>`;
 return `<h2>${heading}</h2><div class="portfolio-grid sh5-media-grid">${items.map(m=>m.media_type==='video'?`<div class="sh5-video-tile"><video src="${esc(safeMediaUrl(m.media_url))}" poster="${esc(safeMediaUrl(m.thumbnail_url)||'')}" muted loop autoplay playsinline preload="metadata" controls aria-label="${esc(m.title||'Creator film preview')}"></video></div>`:`<img loading="lazy" src="${esc(safeMediaUrl(m.media_url))}" alt="${esc(m.title||'Creator photography')}"/>`).join('')}</div>`;
}
let stage='brief',brief={},list=[],active=0,selected=null,jobId=null,currentUserId=null,returnToProfile=false;
const root=document.createElement('div');root.id='sh5-demo';root.hidden=true;root.setAttribute('role','region');root.setAttribute('aria-label','ShutterHunters post a job and creator matching');document.body.appendChild(root);

function rank(c){
  let score=0;
  const cat=String(brief.category||'').toLowerCase(), city=String(brief.location||'').toLowerCase(),desc=(String(brief.details||'')+' '+String(brief.service||'')).toLowerCase();
  const types=(c.types||[]).join(' ').toLowerCase(), text=[c.style,c.specialty,c.bio,(c.skills||[]).join(' ')].join(' ').toLowerCase();
  if(cat&&(types.includes(cat)||text.includes(cat)))score+=55;
  const town=city.split(',')[0].trim();if(town&&c.region.toLowerCase().includes(town))score+=40;
  else if(city.includes('ca')&&/\bca\b|california/i.test(c.region))score+=8;
  for(const word of ['cinematic','vintage','documentary','editorial','film','photo','video','brand','wedding','event','portrait'])if(desc.includes(word)&&text.includes(word))score+=6;
  const budget=Number(String(brief.budget||'').replace(/[$,]/g,''));if(Number.isFinite(budget)&&budget>0&&Number(c.rate)>0){if(Number(c.rate)<=budget)score+=10;}
  return score;
}
async function publishAndMatch(form){
 const values=Object.fromEntries(new FormData(form).entries());brief=values;
 if(String(brief.title||'').trim().length<5||String(brief.location||'').trim().length<2||String(brief.details||'').trim().length<15)throw Error('Enter a job title (5+ characters), location and detailed brief (15+ characters).');
 const budgetText=String(brief.budget||'').trim();
 if(budgetText && !/^\$?[0-9]+(?:\.[0-9]{1,2})?$/.test(budgetText.replaceAll(',','')))throw Error('Enter one numeric project budget, for example 1500.');
 if(typeof window.shTop5PublishJob!=='function')throw Error('The site job service is not ready. Refresh the page and try again.');
 const job=await window.shTop5PublishJob({title:brief.title,location:brief.location,specialty:brief.category,details:[brief.details, 'Requested service: '+(brief.service==='both'?'Photographer and videographer':brief.service||'Photographer')].filter(Boolean).join('\n'),budget:budgetText?Number(budgetText.replace(/[$,]/g,'')):null,event_date:brief.date||null});
 jobId=job.id;currentUserId=job.client_id;
 if(typeof window.shTop5EligibleCreators!=='function')throw Error('Creator matching service is not available. Your job was saved.');
 const people=await window.shTop5EligibleCreators();
 list=people.map((p,i)=>({id:p.id,real:true,name:p.display_name||'Creator',region:[p.city,p.state].filter(Boolean).join(', '),specialty:p.specialty||p.role||'Creative',types:[p.specialty,...(Array.isArray(p.specialties)?p.specialties:[])].filter(Boolean).flatMap(v=>{const x=String(v).toLowerCase();return [v,...(/wedding/.test(x)?['Wedding']:[]),...(/video|film/.test(x)?['Video']:[]),...(/photo/.test(x)?['Photo']:[]),...(/event/.test(x)?['Event']:[]),...(/commercial|brand/.test(x)?['Commercial']:[])]}),style:p.role||p.specialty||'Creative professional',bio:p.bio||'Explore this creator’s work and profile.',photo:p.avatar_url||p.cover_url||'assets/creator1.webp',skills:Array.isArray(p.specialties)&&p.specialties.length?p.specialties:[p.specialty||'Creative'],rate:p.hourly_rate??null,rateUnit:'hour',experience:'—',projects:'—',subscriber:true})).sort((a,b)=>rank(b)-rank(a)).slice(0,5);
 await hydrateMatchMedia(list);
 active=0;stage='matches';draw();
}
function open(stageName='brief'){stage=stageName;root.hidden=false;document.body.style.overflow='hidden';draw();}function exit(){root.hidden=true;document.body.style.overflow='';}
function shell(body){root.innerHTML=`<div class="wrap"><div class="nav"><div class="logo">Shutter<em>Hunters.</em> <span class="quiet">/ Hire Creators</span></div><div><button class="textbtn" data-action="native-inbox">Inbox ↗</button><button class="textbtn" data-action="exit">✕ Close</button></div></div><div class="shell">${body}</div><div class="footer">Only active Pro and Studio creators with public profiles qualify for Top 5. Invitations are delivered only after the database confirms success.</div></div>`;root.scrollTop=0;if(stage==='profile')requestAnimationFrame(()=>{root.querySelectorAll('video[autoplay]').forEach(v=>v.play().catch(()=>{}))})}
function draw(){if(stage==='brief')return shell(`<div class="brief"><div class="step">01 / Tell us what you're creating</div><h1>Every great project starts with a vision.</h1><p class="quiet">Publish your project and discover up to five matching subscribed creators. Matches depend on real active membership and public profile details.</p><form id="sh5-form"><div class="fields"><label>Project title<input name="title" required maxlength="110" value="${esc(brief.title||'')}" placeholder="e.g. Vintage wedding film"></label><label>Type of creative<select name="category"><option>Wedding</option><option>Event</option><option>Commercial</option><option>Portrait</option><option>Real Estate</option><option>Engagement</option><option>Family</option><option>Graduation</option><option>Sports</option><option>Music Video</option><option>Product</option><option>Corporate</option><option>Other</option></select></label><label>Location<input name="location" required value="${esc(brief.location||'')}" placeholder="e.g. Sacramento, CA"></label><label>Project date<input type="date" name="date" value="${esc(brief.date||'')}"></label><label>Budget<input name="budget" placeholder="e.g. $1,500–$3,000" value="${esc(brief.budget||'')}"></label><label>What do you need?<select name="service"><option value="photographer" ${brief.service==='photographer'?'selected':''}>Photographer</option><option value="videographer" ${brief.service==='videographer'?'selected':''}>Videographer</option><option value="both" ${brief.service==='both'?'selected':''}>Photographer &amp; Videographer</option><option value="other" ${brief.service==='other'?'selected':''}>Other</option></select></label><label class="wide">Your creative brief<textarea name="details" required placeholder="What do you need? Describe your vision, deliverables and style.">${esc(brief.details||'')}</textarea></label></div><div class="actions"><button class="primary" type="submit">Publish Job & Find Matches →</button><button class="secondary" type="button" data-action="exit">Close</button></div></form></div>`);
if(stage==='matches'&&!list.length)return shell(`<div class="match-head"><h1>Meet Your Top 5 Matches</h1></div><div class="brief"><h2>No eligible creators yet</h2><p>There are currently no active Pro or Studio members with public profiles available to show. Your job has been published. As eligible creators join, matching will be available.</p><div class="actions"><button class="primary" data-action="all">Explore All Creators ↗</button><button class="secondary" data-action="exit">Back to ShutterHunters</button></div></div>`);
if(stage==='matches'){return shell(`<div class="match-head"><h1>Meet Your Top 5 Matches</h1></div><div class="match-stage" id="sh5-stack" aria-label="Swipe left to explore creator matches">${[...list].reverse().map(p=>{let index=list.indexOf(p),depth=(index-active+list.length)%list.length;let off=Math.min(depth,4),scale=1-off*.047,y=off*18;return `<article class="match-card" data-card="${index}" style="z-index:${20-depth};transform:translate3d(0,${y}px,0) scale(${scale});opacity:${depth===4?.82:1};pointer-events:${depth===0?'auto':'none'}"><div class="photo"><img draggable="false" src="${esc(p.photo)}" alt="Profile photo of ${esc(p.name)}"><span class="rank">${index===0?'✦ BEST MATCH · #1':'MATCH #'+(index+1)}</span></div><div class="info"><div class="step">${'Premium creator'} · ${esc(p.region)}</div><h2>${esc(p.name)}</h2><div class="detail">${esc(p.specialty)} · ${esc(p.style)}</div><div class="rate">${p.rate==null?"Rate upon request":"From $"+esc(p.rate)+"/"+esc(p.rateUnit)}</div><p>${esc(p.bio)}</p><div class="chips">${p.skills.map(s=>`<span>${esc(s)}</span>`).join('')}</div><div class="actions"><button class="primary" data-action="profile" data-index="${index}">View Profile</button><button class="secondary" data-action="invite" data-index="${index}">Invite to Project</button></div></div></article>`}).join('')}</div><div class="match-footer"><button class="circle" data-action="prev" aria-label="Previous match">‹</button><span class="quiet">${active+1} / ${list.length}</span><button class="circle" data-action="next" aria-label="Next match">›</button></div><p class="swipe-hint">← Swipe the entire card to reveal the next creator</p><div class="alllink"><button class="secondary" data-action="all">View All Candidates ↗</button><button class="secondary" data-action="native-inbox">Open Inbox ↗</button></div>`) }
if(stage==='profile'){const p=list[selected];let saved;try{saved=JSON.parse(localStorage.getItem('sh5_saved_creators')||'[]').includes(p.id)}catch{saved=false}return shell(`<button class="textbtn back" data-action="matches">← Back to your matches</button><div class="profile"><div class="profile-hero"><img src="${esc(p.photo)}" alt="Profile portrait of ${esc(p.name)}"><div class="profile-copy"><div class="step">Premium creator · Match #${selected+1}</div><h2>${esc(p.name)}</h2><div class="quiet">${esc(p.region)} · ${esc(p.specialty)}</div><div class="rate">${p.rate==null?"Rate upon request":"Starting at $"+esc(p.rate)+"/"+esc(p.rateUnit)}</div><p>${esc(p.bio)}</p><div class="chips">${p.skills.map(s=>`<span>${esc(s)}</span>`).join('')}</div><div class="actions"><button class="secondary" data-action="save">${saved?'✓ Saved Candidate':'☆ Save Candidate'}</button><button class="primary" data-action="invite" data-index="${selected}">Invite to Project</button></div></div></div><div class="portfolio">${portfolioMarkup(p)}<div class="profile-details"><h2>About ${esc(p.name)}</h2><p>${esc(p.bio)}</p><div class="actions"><button class="secondary" data-action="actual-profile">View Actual Profile ↗</button></div><div class="profile-panels"><div><h3>What I create</h3><p>${esc(p.specialty)} · ${esc(p.skills.join(', '))}</p></div><div><h3>Style & approach</h3><p>${esc(p.style)}. ${esc(p.bio)}</p></div></div><div class="actions"><button class="secondary" data-action="matches">← Back to Top 5</button><button class="primary" data-action="invite" data-index="${selected}">Invite to Project</button></div><div class="note">This is a match preview. Select View Actual Profile to explore the creator’s complete ShutterHunters page.</div></div></div></div>`)}
if(stage==='invite'){let p=list[selected];return shell(`<button class="textbtn back" data-action="profile" data-index="${selected}">← Back to ${esc(p.name)}'s profile</button><div class="brief"><div class="step">03 / Project inquiry</div><h1>Invite ${esc(p.name)}.</h1><p class="quiet">The project inquiry will be sent to this creator’s actual ShutterHunters Inbox.</p><div class="inquiry"><strong>${esc(brief.title)}</strong><p>${esc(brief.details)}</p><small>${esc(brief.location)} · ${esc(brief.date||'Date flexible')} · ${esc(brief.budget||'Budget to discuss')}</small></div><form id="sh5-invite-form"><label>Personal note<textarea name="note" required placeholder="Tell this creator why you love their work and what you'd like to discuss.">Hi ${esc(p.name)}, I think your creative style could be a great fit for my project. I'd love to discuss it with you.</textarea></label><div class="actions"><button class="primary">Send Project Inquiry →</button></div></form><div class="note">You will see confirmed deliveries under Message Center → Sent. You cannot invite your own account.</div></div>`)}

}
root.addEventListener('submit',async e=>{
 if(e.target.id==='sh5-form'){
   e.preventDefault();const btn=e.target.querySelector('button[type=submit]');if(btn){btn.disabled=true;btn.textContent='Publishing…'}
   try{await publishAndMatch(e.target)}catch(err){alert(err.message||'Could not publish.');if(btn){btn.disabled=false;btn.textContent='Publish Job & Find Matches →'}}
 } else if(e.target.id==='sh5-invite-form'){
   e.preventDefault();const p=list[selected],btn=e.target.querySelector('button');if(btn)btn.disabled=true;
   try{if(p.id===currentUserId)throw Error('You cannot send an inquiry to your own profile. Use a second test account to verify messaging.');
     if(typeof window.shTop5SendInquiry!=='function')throw Error('Inquiries service unavailable.');
     await window.shTop5SendInquiry({recipient_id:p.id,job_id:jobId,subject:brief.title,message:[brief.details,'Location: '+brief.location,'Requested service: '+(brief.service==='both'?'Photographer and videographer':brief.service||'Photographer'),'Project budget: '+(brief.budget||'To discuss'),'Personal note: '+String(new FormData(e.target).get('note')||'')].join('\n'),event_date:brief.date||null,budget:brief.budget?Number(String(brief.budget).replace(/[$,]/g,'')):null});
     nativeInbox();
   }catch(err){alert(err.message||'Inquiry was not sent.');if(btn)btn.disabled=false}
 }
});
root.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;if(a==='exit')return exit();if(a==='actual-profile'){let p=list[selected];if(p?.id&&typeof window.shTop5OpenProfile==='function'){exit();window.shTop5OpenProfile(p.id)}return;}if(a==='native-inbox')return nativeInbox();if(a==='all'){exit();const selectors=['[data-tab=creators]','#navCreators','[href*=creators]','[data-page=creators]'];let t=selectors.map(q=>document.querySelector(q)).find(Boolean);if(t){t.click();return}const candidate=[...document.querySelectorAll('button,a,[role=button]')].find(el=>/^(creators|explore creators|view creators)$/i.test((el.textContent||'').trim()));if(candidate){candidate.click();return}const section=document.querySelector('#creatorsection,#creators');if(section)section.scrollIntoView({behavior:'smooth'});return}if(a==='next'||a==='prev'){active=(active+(a==='next'?1:list.length-1))%list.length;return draw()}if(a==='matches'||a==='inbox'||a==='brief'){stage=a;return draw()}if(a==='profile'||a==='invite'){selected=Number(b.dataset.index??selected??active);stage=a;return draw()}if(a==='save'){const p=list[selected];let ids=[];try{ids=JSON.parse(localStorage.getItem('sh5_saved_creators')||'[]')}catch{}if(!ids.includes(p.id))ids.push(p.id);localStorage.setItem('sh5_saved_creators',JSON.stringify(ids));return draw()}});
// Follow the finger continuously, then fly the front card off screen to the back.
let gesture=null,blockClick=false;
root.addEventListener('pointerdown',e=>{if(stage!=='matches'||e.target.closest('button'))return;let card=e.target.closest('.match-card');if(!card||Number(card.dataset.card)!==active)return;gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,card,moving:false};},{passive:true});
root.addEventListener('pointermove',e=>{if(!gesture||e.pointerId!==gesture.id)return;let g=gesture,dx=e.clientX-g.x,dy=e.clientY-g.y;if(!g.moving&&Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.1){g.moving=true;g.card.classList.add('is-dragging');try{g.card.setPointerCapture(e.pointerId)}catch{}}if(g.moving){g.dx=dx;g.card.style.transform=`translate3d(${dx}px,${Math.min(26,Math.abs(dx)*.05)}px,0) rotate(${dx*.018}deg)`;g.card.style.opacity=String(Math.max(.55,1-Math.abs(dx)/1000))}},{passive:true});
function finishSwipe(e){if(!gesture||e.pointerId!==gesture.id)return;let g=gesture;gesture=null;if(!g.moving)return;blockClick=true;setTimeout(()=>blockClick=false,450);g.card.classList.remove('is-dragging');if(g.dx < -75){g.card.classList.add('fly-left');setTimeout(()=>{active=(active+1)%list.length;draw()},400)}else if(g.dx>75){g.card.style.transition='transform .38s ease,opacity .38s';g.card.style.transform='translate3d(115vw,-15px,0) rotate(12deg)';g.card.style.opacity='.05';setTimeout(()=>{active=(active+list.length-1)%list.length;draw()},390)}else{g.card.style.transform='translate3d(0,0,0) scale(1)';g.card.style.opacity='1'}}
root.addEventListener('pointerup',finishSwipe);root.addEventListener('pointercancel',finishSwipe);
root.addEventListener('click',e=>{if(blockClick){e.preventDefault();e.stopImmediatePropagation()}},true);
// Route both Discovery and Jobs-page Post a Job buttons to the same real flow.
// Capture before legacy inline onclick calls go('post').
document.addEventListener('click',e=>{
 if(!root.hidden)return;
 const target=e.target.closest('button,a,[role="button"]');if(!target)return;
 const label=(target.innerText||target.textContent||target.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().toLowerCase();
 const inline=target.getAttribute('onclick')||'';
 const action=/^post a job\b/.test(label)||/go\(['"]post['"]\)/.test(inline);
 if(!action)return;
 e.preventDefault();e.stopImmediatePropagation();open('brief');
},true);
// Remove the old Try a demo job CTA, but preserve the Jobs page and sample opportunities.
const oldDemoButton=document.getElementById('sh80DemoPost');if(oldDemoButton){const banner=oldDemoButton.closest('.sh80-post-demo');if(banner)banner.hidden=true;oldDemoButton.hidden=true}
window.ShutterHuntersTopFive={open:()=>open('brief'),showMatches:()=>open('matches'),showSent:nativeInbox,close:exit,refreshDemoSent:()=>{}};
})();


/* V15: cinematic two-action Jobs landing, preserves the V14 Find Jobs workspace. */
(()=>{const css=`
#jobs{background:radial-gradient(ellipse at 82% 0%,#1f3a3a 0%,transparent 48%),linear-gradient(150deg,#071819,#102d30 55%,#071b22)!important;min-height:calc(100svh - 90px);max-width:none!important;width:100%!important;padding:clamp(28px,6vw,85px) clamp(15px,5vw,72px)!important;box-sizing:border-box}
#jobs > :not(.sh79-hero):not(#shFindV14):not(#shFindV15Lock){display:none!important}
#jobs .sh79-hero{background:transparent!important;border:0!important;box-shadow:none!important;min-height:min(72svh,730px);display:flex;flex-direction:column;justify-content:center;max-width:1160px;margin:0 auto;padding:20px 0!important;color:#f3f1e9!important}
#jobs .sh79-hero .sh79-kicker{color:#e9bf8a!important;letter-spacing:.24em;font-weight:800}
#jobs .sh79-hero h1{font-family:Georgia,serif!important;font-weight:500!important;font-size:clamp(43px,7vw,97px)!important;line-height:1.06!important;color:#f6f6f0!important;margin:19px 0!important;letter-spacing:-.04em!important}
#jobs .sh79-hero h1 em{color:#cfa574!important}
#jobs .sh79-hero p{color:#c6d2d0!important;font-size:clamp(15px,2vw,19px)!important;line-height:1.65!important;max-width:630px}
#jobs .sh79-choices{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:18px!important;margin:34px 0 0!important;max-width:960px}
#jobs .sh79-choice{min-height:185px!important;border:1px solid #ffffff45!important;border-radius:18px!important;background:linear-gradient(155deg,#1a4040,#102a32)!important;color:#fff!important;padding:clamp(19px,3vw,32px)!important;box-shadow:0 22px 55px #0004;transition:transform .2s,box-shadow .2s!important;text-align:left}
#jobs .sh79-find{background:linear-gradient(145deg,#1c3b55,#0c243b)!important}
#jobs .sh79-choice:hover{transform:translateY(-4px);box-shadow:0 28px 66px #0007}
#jobs .sh79-choice strong{font-family:Georgia,serif;font-size:clamp(23px,3vw,32px)!important}
#jobs .sh79-choice small{color:#cdd9dd!important;font-size:13px!important;line-height:1.5!important}
#jobs .sh79-trust{display:none!important}
#shFindV15Lock{position:fixed;inset:0;z-index:2147483100;display:grid;place-items:center;padding:16px;background:#03131ed9;backdrop-filter:blur(10px);color:#f3f6fa}
#shFindV15Lock[hidden]{display:none!important}
#shFindV15Lock .sh15-lock-inner{width:min(100%,480px);border:1px solid #9dbed24d;border-radius:24px;padding:clamp(25px,5vw,42px);background:linear-gradient(145deg,#15354c,#091e30);box-shadow:0 35px 100px #0008;box-sizing:border-box}
#shFindV15Lock h2{color:white;font:500 clamp(31px,6vw,45px)/1.07 Georgia,serif;margin:15px 0}
#shFindV15Lock p{color:#c6d6e4;line-height:1.65}
#shFindV15Lock button{min-height:45px;margin:8px 8px 0 0;border-radius:10px;padding:10px 17px;background:#e4bb86;color:#172535;font-weight:800;border:0;cursor:pointer}
#shFindV15Lock button.sh15-secondary{background:transparent;border:1px solid #a5bbcb;color:white}
@media(max-width:650px){#jobs .sh79-choices{grid-template-columns:1fr!important}#jobs .sh79-choice{min-height:140px!important}#jobs .sh79-hero{min-height:70svh}#jobs{padding-top:28px!important}}
`;let el=document.getElementById('shFindV15Styles');if(!el){el=document.createElement('style');el.id='shFindV15Styles';document.head.appendChild(el)}el.textContent=css;})();
/* ShutterHunters V14 — Live Find Jobs workspace. Additive to preserved V13. */
(()=>{'use strict';if(window.__shFindJobsV14)return;window.__shFindJobsV14=true;
const css=`
#shFindV14{position:fixed;inset:0;z-index:2147483000;overflow:auto;overscroll-behavior:contain;background:radial-gradient(circle at 85% 3%,#183852 0%,transparent 42%),linear-gradient(155deg,#071726 0%,#0b2435 58%,#061522 100%);color:#f0f5f8;padding:env(safe-area-inset-top) max(12px,env(safe-area-inset-right)) env(safe-area-inset-bottom) max(12px,env(safe-area-inset-left));box-sizing:border-box}
#shFindV14[hidden]{display:none!important}body.sh-find14-open{overflow:hidden!important}
#shFindV14 .sh-find-shell{max-width:1120px;margin:auto;padding:22px 0 85px}
#shFindV14 .sh-find-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
#shFindV14 .sh-find-brand{font-size:13px;font-weight:800;letter-spacing:2px;color:#c3d7e6}
#shFindV14 .sh-find-close{border:1px solid #9ebbd066;background:#112e41;color:white;border-radius:999px;padding:12px 18px;cursor:pointer}
#shFindV14 .sh-find-hero{padding:clamp(20px,5vw,58px) 0 24px}
#shFindV14 .sh-find-kicker{font-size:11px;letter-spacing:3px;color:#a4cce0;text-transform:uppercase;font-weight:700}
#shFindV14 h1{font:500 clamp(40px,7vw,84px)/1.03 Georgia,serif;color:#fff;margin:13px 0 16px;letter-spacing:-.04em}
#shFindV14 .sh-find-hero p{font-size:clamp(14px,2vw,18px);max-width:640px;color:#bdd0df;line-height:1.65}
#shFindV14 .sh-find-content{display:grid;gap:18px}
#shFindV14 #sh82Search{display:block!important;background:#102b40!important;color:#eef6fc!important;border:1px solid #ffffff24!important;border-radius:22px!important;padding:clamp(16px,3vw,28px)!important;margin:0!important;box-shadow:0 24px 75px #0003;max-width:none!important}
#shFindV14 #sh82Search h2,#shFindV14 #sh82Search .sh77-kicker,#shFindV14 #sh82Search p,#shFindV14 #sh82Search label{color:#ecf5fd!important}
#shFindV14 #sh82Search input,#shFindV14 #sh82Search select{max-width:100%;min-width:0;box-sizing:border-box}
#shFindV14 .sh-find-list{background:#0c2233;border:1px solid #ffffff19;border-radius:22px;padding:clamp(15px,3vw,28px)}
#shFindV14 .sh-find-list h2{font:500 34px/1.1 Georgia,serif;margin:3px 0 9px;color:white}
#shFindV14 .sh-find-list .sh-find-desc{color:#abc3d3;margin:0 0 20px;font-size:14px}
#shFindV14 #shLiveJobsList{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:14px}
#shFindV14 #shLiveJobsList .job{background:#fff!important;color:#183043;border-radius:16px;padding:20px;margin:0;box-shadow:none}
#shFindV14 #shLiveJobsList .job h3{color:#16374b}
#shFindV14 #shLiveJobsStatus{color:#c4d8e5!important}
#shFindV14 .sh-find-empty{border:1px dashed #688da4;padding:24px;border-radius:15px;color:#c6d7e3;line-height:1.5}
@media(max-width:700px){#shFindV14 .sh-find-shell{padding-top:12px}#shFindV14 .sh-find-hero{padding:30px 4px 16px}#shFindV14 .sh-find-content{gap:12px}#shFindV14 #sh82Search .sh82-fields{grid-template-columns:1fr!important}#shFindV14 .sh-find-close{padding:10px 13px}#shFindV14 #sh82Search{width:100%!important}}
#sh82DemoMarketplace,#jobslist,#sh80DemoLaunch{display:none!important}
`;
const style=document.createElement('style');style.id='shFindV14Styles';style.textContent=css;document.head.append(style);
let overlay=null,search=null,list=null,status=null,anchors=[],lastFocus=null,checking=false;
function lockScreen(message){let el=document.getElementById('shFindV15Lock');if(!el){el=document.createElement('div');el.id='shFindV15Lock';el.hidden=true;el.innerHTML='<div class="sh15-lock-inner" role="dialog" aria-modal="true" aria-labelledby="sh15-title"><span style="letter-spacing:.19em;color:#dfb886;font-size:12px">SHUTTERHUNTERS / MEMBER ACCESS</span><h2 id="sh15-title">Find Jobs is for members.</h2><p id="sh15-lock-msg"></p><div><button type="button" data-sh15="upgrade">Explore memberships ↗</button><button type="button" data-sh15="close" class="sh15-secondary">Close</button></div></div>';document.body.appendChild(el);el.addEventListener('click',e=>{const a=e.target.closest('[data-sh15]')?.dataset.sh15;if(!a)return;el.hidden=true;if(a==='upgrade'&&typeof window.go==='function')window.go('membership')});}el.querySelector('#sh15-lock-msg').textContent=message;el.hidden=false;}
async function hasFindJobsAccess(){const db=getBridge();if(!db)return {allowed:false,message:'Sign in with an active Pro or Studio membership to access Find Jobs.'};try{const {data:{user},error:authError}=await db.auth.getUser();if(authError||!user)return {allowed:false,message:'Please sign in and activate a Pro or Studio membership to access Find Jobs.'};const {data,error}=await db.from('creator_memberships').select('tier,status').eq('user_id',user.id).eq('status','active').in('tier',['pro','studio']).limit(1);if(error){console.warn('Find Jobs membership check:',error.message);return {allowed:false,message:'We could not verify your membership right now. Please try again.'};}return {allowed:!!data?.length,message:'Find Jobs is available to active Pro and Studio subscribers. Upgrade to browse opportunities.'};}catch(err){console.warn('Find Jobs membership verification failed',err);return {allowed:false,message:'Membership verification is temporarily unavailable. Please try again.'}}}

function anchor(node){const mark=document.createComment('sh-v14-original-position');node.parentNode.insertBefore(mark,node);anchors.push([node,mark]);return node}
function restore(){for(const [node,mark] of anchors){if(mark.parentNode){mark.parentNode.insertBefore(node,mark);mark.remove()}}anchors=[]}
function close(){if(!overlay||overlay.hidden)return;overlay.hidden=true;document.body.classList.remove('sh-find14-open');restore();if(lastFocus?.focus)lastFocus.focus()}
async function open(){if(checking)return;if(!document.getElementById('jobs'))return;checking=true;let access;try{access=await hasFindJobsAccess()}finally{checking=false}if(!access.allowed){lockScreen(access.message);return;}lastFocus=document.activeElement; if(typeof window.go==='function')window.go('jobs');if(!overlay){overlay=document.createElement('section');overlay.id='shFindV14';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Find Jobs');overlay.hidden=true;overlay.innerHTML='<div class="sh-find-shell"><div class="sh-find-top"><strong class="sh-find-brand">SHUTTERHUNTERS / OPPORTUNITIES</strong><button type="button" class="sh-find-close">Close ×</button></div><div class="sh-find-hero"><div class="sh-find-kicker">Discover / Find Jobs</div><h1>Find work worth<br>creating for.</h1><p>Real opportunities from real clients. Find the right shoot by location, travel distance, budget and availability.</p></div><div class="sh-find-content"><div id="shFindFilters"></div><section class="sh-find-list"><span class="sh-find-kicker">AVAILABLE OPPORTUNITIES</span><h2>Open projects.</h2><p class="sh-find-desc">Browse live projects, save your favorites and explore the details.</p><div id="shFindStatus"></div><div id="shFindResults"></div></section></div></div>';document.getElementById('jobs').append(overlay);overlay.querySelector('.sh-find-close').addEventListener('click',close);overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}})}
search=document.getElementById('sh82Search');list=document.getElementById('shLiveJobsList');status=document.getElementById('shLiveJobsStatus');if(!search||!list||!status)return;
overlay.querySelector('#shFindFilters').append(anchor(search));overlay.querySelector('#shFindResults').append(anchor(list));overlay.querySelector('#shFindStatus').append(anchor(status));
const heading=search.querySelector('.sh82-search-head p');if(heading)heading.textContent='Filter real ShutterHunters opportunities by location, pay, shoot type and availability.';
overlay.hidden=false;document.body.classList.add('sh-find14-open');overlay.scrollTop=0;overlay.querySelector('.sh-find-close').focus({preventScroll:true});
if(typeof window.shLoadRealJobs==='function')Promise.resolve(window.shLoadRealJobs()).catch(()=>{});
}
function isFind(e){const t=e.target.closest('button,a');if(!t||t.closest('#shFindV14'))return false;if(t.classList.contains('sh79-find'))return true;const h=(t.getAttribute('onclick')||'').toLowerCase();const label=(t.innerText||t.textContent||'').trim().toLowerCase();return (h.includes("go('jobs')")||h.includes('sh79findjobs'))&&(label.includes('find jobs')||label.includes('find work'))}
document.addEventListener('click',e=>{if(isFind(e)){e.preventDefault();e.stopImmediatePropagation();open()}},true);
// Existing inline navigation and Find Jobs tabs also enter the same live experience.
function init(){window.sh79FindJobs=open;const demo=document.getElementById('sh82DemoMarketplace');if(demo)demo.hidden=true;const p=document.querySelector('#sh82Search .sh82-search-head p');if(p)p.textContent='Search current ShutterHunters member opportunities.';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.ShutterHuntersFindJobs={open,close};
})();
