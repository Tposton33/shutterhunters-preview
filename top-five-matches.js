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
  // Match real subscriber accounts to the *requested service* first.
  // Do not invent availability, travel distances, rates or subscriber status.
  let score=0;
  const category=String(brief.category||'').toLowerCase();
  const service=String(brief.service||'').toLowerCase();
  const location=String(brief.location||'').toLowerCase().trim();
  const city=location.split(',')[0].trim();
  const keywords=[c.specialty,c.style,c.bio,...(c.skills||[]),...(c.types||[])].join(' ').toLowerCase();
  const isVideo=/video|film|cinema|filmmak|motion/.test(keywords);
  const isPhoto=/photo|portrait|still|image/.test(keywords);
  if(category && keywords.includes(category))score+=45;
  if(service==='videographer')score+=isVideo?90:-45;
  else if(service==='photographer')score+=isPhoto?90:-45;
  else if(service==='both')score+=(isVideo?40:0)+(isPhoto?40:0)-(isVideo||isPhoto?0:30);
  const creatorLocation=String(c.region||'').toLowerCase();
  if(city && creatorLocation.includes(city))score+=50;
  else if(location.includes('ca') && /\bca\b|california/.test(creatorLocation))score+=12; // same state, not a mileage claim
  const description=String(brief.details||'').toLowerCase();
  for(const word of ['cinematic','vintage','documentary','editorial','film','photo','video','brand','wedding','event','portrait']){
    if(description.includes(word)&&keywords.includes(word))score+=4;
  }
  const budget=Number(String(brief.budget||'').replace(/[$,]/g,''));
  const rate=Number(c.rate);
  if(Number.isFinite(budget)&&budget>0 && Number.isFinite(rate)&&rate>0){
    // An hourly rate isn't the same as a whole project quote: use only a modest signal.
    if(rate<=budget)score+=5;
  }
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
if(stage==='matches'&&!list.length)return shell(`<div class="match-head"><h1>Meet Your Top 5 Matches</h1></div><div class="brief"><h2>No eligible creators yet</h2><p>No eligible Pro or Studio creator profiles were returned for this search. Check that their memberships are active, their profiles are public, and the creator directory can read them. Availability and exact travel radius are not yet verified by this matching preview. Your job has been published.</p><div class="actions"><button class="primary" data-action="all">Explore All Creators ↗</button><button class="secondary" data-action="exit">Back to ShutterHunters</button></div></div>`);
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

/* V18: relocated filters require standalone styling because original rules were #jobs-scoped. */
#shFindV14,#shFindV14 *{box-sizing:border-box}
#shFindV14 .sh-find-shell{width:100%;max-width:1080px}
#shFindV14 .sh-find-content>*{min-width:0}
#shFindV14 #sh82Search{width:100%;padding:clamp(20px,4vw,32px)!important;overflow:visible}
#shFindV14 #sh82Search .sh82-search-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-bottom:23px}
#shFindV14 #sh82Search .sh82-search-head>div{flex:1 1 260px;min-width:0}
#shFindV14 #sh82Search .sh77-kicker{display:block;font:800 11px/1.5 system-ui,sans-serif;letter-spacing:.18em;color:#e7ba85!important}
#shFindV14 #sh82Search h2{font:400 clamp(27px,4vw,39px)/1.14 Georgia,serif;color:#fff!important;margin:10px 0 12px}
#shFindV14 #sh82Search .sh82-search-head p{font-size:14px;line-height:1.6;color:#b9cddd!important;margin:0}
#shFindV14 #sh82Clear{appearance:none;border:1px solid #66849a;background:#15384f;color:#e9f5fd;border-radius:11px;padding:12px 15px;min-height:45px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap}
#shFindV14 #sh82Search .sh82-fields{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:18px!important;margin:0}
#shFindV14 #sh82Search .sh82-fields>label,#shFindV14 #sh82Search .sh82-search-foot>label{display:flex!important;flex-direction:column;align-items:stretch;gap:9px;color:#deebf5!important;font:700 12px/1.35 system-ui,sans-serif;letter-spacing:.045em;text-transform:uppercase;min-width:0;width:auto}
#shFindV14 #sh82Search .sh82-fields>label[hidden]{display:none!important}
#shFindV14 #sh82Search input:not([type=checkbox]),#shFindV14 #sh82Search select{appearance:auto;display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;min-height:51px;height:51px;padding:12px 14px;border:1px solid #8babc1;border-radius:11px;background:#f5f8fa!important;color:#102c40!important;font:500 16px/1.2 system-ui,sans-serif;box-shadow:none;opacity:1}
#shFindV14 #sh82Search input::placeholder{color:#667c8b;opacity:1}
#shFindV14 #sh82Search input:focus-visible,#shFindV14 #sh82Search select:focus-visible,#shFindV14 #sh82Search button:focus-visible{outline:3px solid #f0ba7f;outline-offset:2px}
#shFindV14 #sh82Search .sh82-tools{display:flex!important;gap:10px;align-items:center;flex-wrap:wrap;margin:22px 0!important}
#shFindV14 #sh82Search .sh82-tools>button{min-height:44px;border:1px solid #6e95ae;border-radius:12px;background:#1d4762;color:#f2f7fd;padding:11px 15px;font:700 13px/1.3 system-ui,sans-serif;cursor:pointer;white-space:normal}
#shFindV14 #sh82Search .sh82-toggle{display:flex!important;align-items:center;gap:10px;color:#dcebf6!important;font:500 14px/1.5 system-ui,sans-serif;letter-spacing:0;text-transform:none;cursor:pointer;width:100%}
#shFindV14 #sh82Available{appearance:auto;display:inline-block!important;flex:0 0 20px;width:20px!important;height:20px!important;margin:0;accent-color:#dfb47e}
#shFindV14 #sh82Search .sh82-search-foot{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:end;gap:14px;margin:20px 0 0}
#shFindV14 #sh82Search .sh82-search-button{width:100%;min-height:51px;border:none;border-radius:11px;background:#e4ba82!important;color:#132b3b!important;font:800 15px/1.3 system-ui,sans-serif;padding:13px 16px;cursor:pointer}
#shFindV14 #sh82GeoNote{margin:16px 0 0;color:#a9c6d9!important;font-size:12px;line-height:1.6}
#shFindV14 .sh-find-list{min-width:0}
#shFindV14 .sh-find-top{padding-top:4px}
@media(max-width:680px){
 #shFindV14{padding:calc(env(safe-area-inset-top) + 12px) 12px calc(env(safe-area-inset-bottom) + 24px)!important}
 #shFindV14 .sh-find-shell{padding:0 0 40px}
 #shFindV14 .sh-find-brand{font-size:10px;letter-spacing:.14em;line-height:1.5}
 #shFindV14 .sh-find-close{min-height:42px;flex-shrink:0}
 #shFindV14 .sh-find-hero{padding:25px 2px 20px}
 #shFindV14 h1{font-size:clamp(37px,10.5vw,52px);line-height:1.06}
 #shFindV14 .sh-find-hero p{font-size:14px;line-height:1.65}
 #shFindV14 #sh82Search{padding:20px 16px!important;border-radius:18px!important}
 #shFindV14 #sh82Search .sh82-search-head{gap:16px;margin-bottom:21px}
 #shFindV14 #sh82Clear{width:100%;text-align:center}
 #shFindV14 #sh82Search .sh82-fields{grid-template-columns:minmax(0,1fr)!important;gap:17px!important}
 #shFindV14 #sh82Search .sh82-tools{display:grid!important;grid-template-columns:1fr 1fr;gap:10px;margin:19px 0!important}
 #shFindV14 #sh82Search .sh82-tools>button{width:100%;min-width:0;padding:11px 8px;font-size:12px}
 #shFindV14 #sh82Search .sh82-toggle{grid-column:1/-1;align-items:flex-start}
 #shFindV14 #sh82Search .sh82-search-foot{grid-template-columns:minmax(0,1fr)!important;gap:16px;margin-top:18px}
 #shFindV14 .sh-find-list{padding:21px 16px;border-radius:18px}
 #shFindV14 .sh-find-list h2{font-size:30px}
}

#sh82DemoMarketplace,#jobslist,#sh80DemoLaunch{display:none!important}
`;
const style=document.createElement('style');style.id='shFindV14Styles';style.textContent=css;document.head.append(style);
let overlay=null,search=null,list=null,status=null,anchors=[],lastFocus=null,checking=false;
// Find Jobs lives in its own IIFE, so it needs its own scoped database accessor.
let findJobsDb=null;
function getBridge(){
 if(findJobsDb)return findJobsDb;
 const cfg=window.SHUTTERHUNTERS_CONFIG||{};
 if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase?.createClient)return null;
 findJobsDb=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 return findJobsDb;
}

function lockScreen(message){let el=document.getElementById('shFindV15Lock');if(!el){el=document.createElement('div');el.id='shFindV15Lock';el.hidden=true;el.innerHTML='<div class="sh15-lock-inner" role="dialog" aria-modal="true" aria-labelledby="sh15-title"><span style="letter-spacing:.19em;color:#dfb886;font-size:12px">SHUTTERHUNTERS / MEMBER ACCESS</span><h2 id="sh15-title">Find Jobs is for members.</h2><p id="sh15-lock-msg"></p><div><button type="button" data-sh15="upgrade">Explore memberships ↗</button><button type="button" data-sh15="close" class="sh15-secondary">Close</button></div></div>';document.body.appendChild(el);el.addEventListener('click',e=>{const a=e.target.closest('[data-sh15]')?.dataset.sh15;if(!a)return;el.hidden=true;if(a==='upgrade'&&typeof window.go==='function')window.go('membership')});}el.querySelector('#sh15-lock-msg').textContent=message;el.hidden=false;}
async function hasFindJobsAccess(){
 const db=getBridge();
 if(!db)return {allowed:false,message:'Membership services are not available. Refresh the page and sign in again.'};
 try{
  const {data:sessionData,error:authError}=await db.auth.getUser();
  const user=sessionData?.user;
  if(authError||!user)return {allowed:false,message:'Sign in to your account to access Find Jobs.'};
  // Use the same single-record membership lookup as studio.js.
  const {data:membership,error}=await db.from('creator_memberships').select('tier,status').eq('user_id',user.id).maybeSingle();
  if(error)return {allowed:false,message:'Could not verify your subscription: '+error.message};
  const allowed=membership?.status==='active'&&['pro','studio'].includes(String(membership?.tier||'').toLowerCase());
  return {allowed,message:allowed?'':'Find Jobs requires an active Pro or Studio membership. Your account currently shows '+(membership?.tier||'no membership')+' ('+(membership?.status||'inactive')+').'};
 }catch(err){return {allowed:false,message:'Membership verification failed: '+(err?.message||'Please try again.')};}
}

function anchor(node){const mark=document.createComment('sh-v14-original-position');node.parentNode.insertBefore(mark,node);anchors.push([node,mark]);return node}
function restore(){for(const [node,mark] of anchors){if(mark.parentNode){mark.parentNode.insertBefore(node,mark);mark.remove()}}anchors=[]}
function close(){if(!overlay||overlay.hidden)return;overlay.hidden=true;document.body.classList.remove('sh-find14-open');restore();if(lastFocus?.focus)lastFocus.focus()}
async function open(){
 if(checking)return;
 checking=true;
 try{
  const jobs=document.getElementById('jobs');
  if(!jobs){lockScreen('Could not find the Jobs section. Please refresh ShutterHunters.');return;}
  const access=await hasFindJobsAccess();
  if(!access.allowed){lockScreen(access.message);return;}
  lastFocus=document.activeElement;
  if(typeof window.go==='function')window.go('jobs');
  else {document.querySelectorAll('main').forEach(m=>m.classList.toggle('hidden',m.id!=='jobs'));}
  if(!overlay){
   overlay=document.createElement('section');overlay.id='shFindV14';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Find Jobs');overlay.hidden=true;
   overlay.innerHTML='<div class="sh-find-shell"><div class="sh-find-top"><strong class="sh-find-brand">SHUTTERHUNTERS / OPPORTUNITIES</strong><button type="button" class="sh-find-close">Close ×</button></div><div class="sh-find-hero"><div class="sh-find-kicker">Discover / Find Jobs</div><h1>Find work worth<br>creating for.</h1><p>Real opportunities from real clients. Find the right shoot by location, travel distance, budget and availability.</p></div><div class="sh-find-content"><div id="shFindFilters"></div><section class="sh-find-list"><span class="sh-find-kicker">AVAILABLE OPPORTUNITIES</span><h2>Open projects.</h2><p class="sh-find-desc">Browse live projects, save your favorites and explore the details.</p><div id="shFindStatus"></div><div id="shFindResults"></div></section></div></div>';
   // Attach to document.body so Jobs-section visibility rules cannot hide the workspace.
   document.body.appendChild(overlay);
   overlay.querySelector('.sh-find-close').addEventListener('click',close);
   overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}});
  }
  search=document.getElementById('sh82Search');list=document.getElementById('shLiveJobsList');status=document.getElementById('shLiveJobsStatus');
  if(!search||!list||!status){lockScreen('The Find Jobs filters have not loaded. Refresh the website.');return;}
  if(search.parentElement!==overlay.querySelector('#shFindFilters'))overlay.querySelector('#shFindFilters').append(anchor(search));
  if(list.parentElement!==overlay.querySelector('#shFindResults'))overlay.querySelector('#shFindResults').append(anchor(list));
  if(status.parentElement!==overlay.querySelector('#shFindStatus'))overlay.querySelector('#shFindStatus').append(anchor(status));
  const heading=search.querySelector('.sh82-search-head p');if(heading)heading.textContent='Filter real ShutterHunters opportunities by location, pay, shoot type and availability.';
  overlay.hidden=false;document.body.classList.add('sh-find14-open');overlay.scrollTop=0;
  overlay.querySelector('.sh-find-close').focus({preventScroll:true});
  const runButton=search.querySelector('#sh82Run');if(runButton&&!runButton.dataset.shFindScroll){runButton.dataset.shFindScroll='1';runButton.addEventListener('click',()=>{if(overlay&&!overlay.hidden)requestAnimationFrame(()=>overlay.querySelector('.sh-find-list')?.scrollIntoView({behavior:'smooth',block:'start'}));});}
  if(typeof window.shLoadRealJobs==='function')Promise.resolve(window.shLoadRealJobs()).catch(err=>console.warn('Find Jobs load:',err));
 }catch(err){console.error('Find Jobs navigation:',err);lockScreen('Unable to open Find Jobs: '+(err?.message||'Please refresh and try again.'));}
 finally{checking=false;}
}

function isFind(e){const t=e.target.closest('button,a');if(!t||t.closest('#shFindV14'))return false;if(t.classList.contains('sh79-find'))return true;const h=(t.getAttribute('onclick')||'').toLowerCase();const label=(t.innerText||t.textContent||'').trim().toLowerCase();return (h.includes("go('jobs')")||h.includes('sh79findjobs'))&&(label.includes('find jobs')||label.includes('find work'))}
document.addEventListener('click',e=>{if(isFind(e)){e.preventDefault();e.stopImmediatePropagation();open()}},true);
// Existing inline navigation and Find Jobs tabs also enter the same live experience.
function init(){window.sh79FindJobs=()=>{open()};const demo=document.getElementById('sh82DemoMarketplace');if(demo)demo.hidden=true;const p=document.querySelector('#sh82Search .sh82-search-head p');if(p)p.textContent='Search current ShutterHunters member opportunities.';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.ShutterHuntersFindJobs={open,close};
})();


/* V21: Non-destructive creator tabs and native Discovery arrows. */
(()=>{'use strict';
const CSS=`
#directory .sh21-tabs{display:flex;gap:10px;padding:7px;margin:22px 0 25px;background:#e8e0d3;border:1px solid #c6bbab;border-radius:17px;max-width:560px}
#directory .sh21-tabs button{flex:1;min-width:0;border:0;border-radius:12px;background:transparent;color:#223732;padding:15px 8px;min-height:50px;font:700 14px system-ui,sans-serif;cursor:pointer}
#directory .sh21-tabs button[aria-selected="true"]{background:#163935;color:white}
#directory .sh21-job-info{background:#0c253b;border-radius:18px;padding:23px;color:#edf5fa;margin:16px 0 22px}
#directory .sh21-job-info button{display:block;width:100%;background:#e4b77a;border:0;padding:16px;color:#0c253b;border-radius:12px;font:700 15px system-ui;cursor:pointer}
#directory .sh21-job-info[hidden]{display:none!important}
#discover .sh21-cta-chevron{margin-left:8px;display:inline-block;vertical-align:middle;flex-shrink:0;color:currentColor}
#jobs .sh79-choice .sh21-choice-chevron{display:grid;place-items:center;margin-left:auto;min-width:35px;width:35px;height:35px;border:1px solid #dbbd8d77;border-radius:50%;font:300 28px/1 Arial,sans-serif;color:#e8bf89}
@media(max-width:600px){#directory .sh21-tabs button{font-size:13px}#discover .sh21-cta-chevron{margin-left:5px}}
`;
function normalizeButton(button){
 if(!button||button.dataset.sh21Arrow)return;
 // Replace only the text node containing an arrow; do not touch the labels in <small> or event handlers.
 for(const n of Array.from(button.childNodes))if(n.nodeType===Node.TEXT_NODE&&/[↗➡→]/.test(n.textContent||''))n.textContent=n.textContent.replace(/[↗➡→]/g,'').replace(/\s+$/,' ');
 const c=document.createElement('span');c.className='sh21-cta-chevron';c.setAttribute('aria-hidden','true');c.textContent='›';
 const small=button.querySelector('small');if(small)button.insertBefore(c,small);else button.append(c);
 button.dataset.sh21Arrow='1';
}
function init(){
 if(!document.getElementById('sh21-style')){const st=document.createElement('style');st.id='sh21-style';st.textContent=CSS;document.head.appendChild(st)}
 const discovery=document.getElementById('discover');
 if(discovery){discovery.querySelectorAll('button').forEach(b=>{const v=(b.getAttribute('onclick')||'')+' '+b.textContent;if((/go\('post'\)|go\('jobs'\)|sh79FindJobs/.test(v))&&/post a job|find jobs/i.test(v))normalizeButton(b)});}
 document.querySelectorAll('#jobs .sh79-choice').forEach(b=>{
  const last=b.lastElementChild;
  if(last&&!last.classList.contains('sh21-choice-chevron')&&/[↗➡→›]/.test(last.textContent||'')){last.textContent='';last.style.display='none'}
  if(!b.querySelector('.sh21-choice-chevron')){const c=document.createElement('span');c.className='sh21-choice-chevron';c.setAttribute('aria-hidden','true');c.textContent='›';b.appendChild(c)}
 });
 const directory=document.getElementById('directory');if(!directory||document.getElementById('sh21-tabs'))return;
 // Remove the V19 tab shell if already present; it must not relocate or duplicate the directory.
 const old=document.getElementById('sh19-tabs');if(old)old.remove();
 const oldPane=document.getElementById('sh19-jobs-content');if(oldPane)oldPane.remove();
 const priorWrap=document.getElementById('sh19-creators-content');if(priorWrap){while(priorWrap.firstChild)directory.appendChild(priorWrap.firstChild);priorWrap.remove()}
 const tabs=document.createElement('div');tabs.id='sh21-tabs';tabs.className='sh21-tabs';tabs.setAttribute('role','tablist');
 tabs.innerHTML='<button type="button" role="tab" aria-selected="true" id="sh21-creators">Find Creators</button><button type="button" role="tab" aria-selected="false" id="sh21-jobs">Available Jobs</button>';
 const info=document.createElement('div');info.className='sh21-job-info';info.hidden=true;info.innerHTML='<h2>Available Jobs</h2><p>Open the live creative opportunities browser to search and save projects.</p><button type="button">Explore Available Jobs ›</button>';
 const title=directory.querySelector('.sh-dir-intro')||directory.querySelector('h1');if(title)title.after(tabs,info);else directory.prepend(tabs,info);
 const buttons=tabs.querySelectorAll('button');
 const showCreators=()=>{info.hidden=true;buttons[0].setAttribute('aria-selected','true');buttons[1].setAttribute('aria-selected','false')};
 const openJobs=()=>{buttons[0].setAttribute('aria-selected','false');buttons[1].setAttribute('aria-selected','true');info.hidden=false;const fn=window.ShutterHuntersFindJobs?.open||window.sh79FindJobs;if(typeof fn==='function'){Promise.resolve(fn()).catch(console.error)}else{info.querySelector('p').textContent='Find Jobs is not ready. Refresh this page and try again.'}};
 buttons[0].addEventListener('click',showCreators);buttons[1].addEventListener('click',openJobs);
 info.querySelector('button').addEventListener('click',openJobs);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* V20: Saved Creators + Saved Jobs panels, kept separate from hiring Top 5. */
(()=>{'use strict';
const STYLE=`
#sh20-saved{margin:20px 0 25px;background:#fffaf0;border:1px solid #d7cbb8;border-radius:18px;padding:18px;color:#1c3332}
#sh20-saved h3{font:400 25px/1.2 Georgia,serif;margin:0 0 12px;color:#19322e}
#sh20-saved .sh20-entry{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px 0;border-top:1px solid #e5dccd}
#sh20-saved button,#sh20-saved a{border:1px solid #b5a58d;border-radius:9px;padding:10px 12px;background:#fff;color:#1b3734;font:600 13px system-ui,sans-serif;cursor:pointer}
#sh20-saved p{color:#63716c;line-height:1.6}
#shFindV14 .sh20-job-save{border:1px solid #92afc4!important;border-radius:10px!important;background:#173b54!important;color:#e7f2fc!important;padding:9px 14px!important;min-height:40px;cursor:pointer;margin:10px 0}
.sh79-choice .sh20-chevron{font:300 28px/1 Arial,sans-serif!important;color:#e5bf8d}
@media(max-width:600px){#sh20-saved{padding:15px}#sh20-saved .sh20-entry{align-items:flex-start;flex-direction:column}}
`;
function read(k){try{const a=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
function write(k,a){localStorage.setItem(k,JSON.stringify(a))}
function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
const CREATOR_KEY='sh5_saved_creators', JOB_KEY='sh20_saved_jobs';
function renderSaved(){
 const root=document.getElementById('sh20-saved');if(!root)return;
 const creators=read(CREATOR_KEY),jobs=read(JOB_KEY);
 root.innerHTML='<h3>Saved Candidates ('+creators.length+')</h3>'+(creators.length?creators.map(id=>'<div class="sh20-entry"><span>Saved creator profile</span><button data-saved-creator="'+escapeHTML(id)+'">View profile ↗</button><button data-remove-creator="'+escapeHTML(id)+'">Remove</button></div>').join(''):'<p>No saved creators yet. Save a candidate from their profile to see them here.</p>')+'<h3 style="margin-top:20px">Saved Jobs ('+jobs.length+')</h3>'+(jobs.length?jobs.map(j=>'<div class="sh20-entry"><div><strong>'+escapeHTML(j.title)+'</strong><p style="margin:3px 0">'+escapeHTML(j.location||'')+'</p></div><button data-open-saved-job="'+escapeHTML(j.id)+'">View job ↗</button><button data-remove-job="'+escapeHTML(j.id)+'">Remove</button></div>').join(''):'<p>No saved jobs yet. Save projects from Find Jobs to see them here.</p>');
}
function init(){
 if(document.getElementById('sh20-style'))return;
 const s=document.createElement('style');s.id='sh20-style';s.textContent=STYLE;document.head.append(s);
 const pane=document.getElementById('sh19-creators-content'),directory=document.getElementById('directory');
 if(pane||directory){const saved=document.createElement('section');saved.id='sh20-saved';(pane||directory).prepend(saved);renderSaved();}
 // Never reroute a Find Jobs save action through the Top 5 hiring shortlist.
 document.addEventListener('click',e=>{
 const b=e.target.closest('[data-remove-creator],[data-saved-creator],[data-remove-job],[data-open-saved-job]');if(!b)return;
 if(b.dataset.removeCreator){write(CREATOR_KEY,read(CREATOR_KEY).filter(v=>String(v)!==b.dataset.removeCreator));renderSaved();return}
 if(b.dataset.removeJob){write(JOB_KEY,read(JOB_KEY).filter(v=>String(v.id)!==b.dataset.removeJob));renderSaved();return}
 if(b.dataset.savedCreator){const id=b.dataset.savedCreator;if(typeof window.shTop5OpenProfile==='function')window.shTop5OpenProfile(id);else alert('Open this creator from the creator directory.');return}
 if(b.dataset.openSavedJob){window.ShutterHuntersFindJobs?.open?.();return}
 });
 // Job results are rendered asynchronously; attach a Save Job action once per real listing.
 const container=document.getElementById('shLiveJobsList');
 function addSaveActions(){if(!container)return;const jobs=container.querySelectorAll('.job');
 jobs.forEach(card=>{if(card.querySelector('.sh20-job-save')||card.classList.contains('sh-job-demo'))return;
 const title=card.querySelector('h3')?.textContent?.trim();if(!title)return;
 const id=card.dataset.jobId||card.dataset.id||card.getAttribute('data-job-id')||title;
 const btn=document.createElement('button');btn.type='button';btn.className='sh20-job-save';btn.textContent=read(JOB_KEY).some(x=>String(x.id)===String(id))?'✓ Saved Job':'☆ Save Job';
 btn.addEventListener('click',()=>{let list=read(JOB_KEY);if(!list.some(x=>String(x.id)===String(id)))list.push({id,title,location:card.querySelector('.location')?.textContent?.trim()||''});write(JOB_KEY,list);btn.textContent='✓ Saved Job';renderSaved()});card.append(btn);
 });}
 if(container){addSaveActions();let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;addSaveActions()})}).observe(container,{childList:true,subtree:false});}
 const observer=new MutationObserver(()=>renderSaved()); // no DOM-list observer on inbox; avoid the prior freeze regression.
 document.addEventListener('click',e=>{if(e.target.closest('[data-action="save"]'))setTimeout(renderSaved,0)});
 document.querySelectorAll('#jobs .sh79-choice').forEach(b=>{const c=b.querySelector('span:last-child');if(c&&/↗|➡|→/.test(c.textContent||''))c.textContent='›'});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();


/* V22: Creators > Available Jobs is an inline tab; Discovery/Jobs retain blue full-screen browser. */
(()=>{'use strict';
const css=`
#directory .sh22-inline-jobs{background:#0d2639;color:#eff6fc;border-radius:21px;padding:clamp(16px,4vw,30px);margin:16px 0 25px;min-width:0;box-sizing:border-box}
#directory .sh22-inline-jobs[hidden]{display:none!important}
#directory .sh22-inline-jobs h2{font:400 clamp(27px,5vw,39px)/1.15 Georgia,serif;color:#fff;margin:10px 0}
#directory .sh22-inline-jobs p{color:#bbcedd;line-height:1.6}
#directory .sh22-inline-jobs .sh22-job-list{display:grid;gap:14px;min-width:0}
#directory .sh22-inline-jobs .job{background:#f8f8f4;color:#183449;border-radius:14px;padding:18px;min-width:0;overflow-wrap:anywhere}
#directory .sh22-inline-jobs .job h3{color:#15384e}
#directory .sh22-inline-jobs .sh22-refresh{background:#dcb47d;color:#173448;border:0;border-radius:10px;padding:12px 17px;font-weight:700;cursor:pointer;min-height:44px}
#directory .sh22-inline-jobs button:focus-visible{outline:3px solid #ebbd80;outline-offset:3px}
#directory.sh22-show-jobs > :not(#sh21-tabs):not(#sh22-inline-jobs):not(#sh20-saved){display:none!important}
#directory.sh22-show-jobs #sh20-saved{display:block!important}
#directory.sh22-show-jobs .sh21-tabs{display:flex!important}
#directory .sh21-job-info{display:none!important}
@media(max-width:640px){#directory .sh22-inline-jobs{padding:17px 13px}#directory .sh22-inline-jobs .job{padding:15px}}
`;
function init(){
 const dir=document.getElementById('directory'), tabs=document.getElementById('sh21-tabs');if(!dir||!tabs||document.getElementById('sh22-inline-jobs'))return;
 const style=document.createElement('style');style.id='sh22-style';style.textContent=css;document.head.append(style);
 const jobsTab=document.getElementById('sh21-jobs'),creatorsTab=document.getElementById('sh21-creators');if(!jobsTab||!creatorsTab)return;
 // Replace just the Jobs tab to remove the previous redirect click listener.
 const newJobsTab=jobsTab.cloneNode(true);jobsTab.replaceWith(newJobsTab);
 const pane=document.createElement('section');pane.id='sh22-inline-jobs';pane.className='sh22-inline-jobs';pane.hidden=true;
 pane.innerHTML='<span style="font:700 11px system-ui;letter-spacing:.15em;color:#eac28b">SHUTTERHUNTERS / AVAILABLE JOBS</span><h2>Creative opportunities.</h2><p>Browse open projects here without leaving Creators. Save a job to find it in Saved Jobs below.</p><button type="button" class="sh22-refresh">Refresh jobs</button><p class="sh22-status" role="status">Loading real opportunities…</p><div class="sh22-job-list"></div>';
 tabs.after(pane);
 // Keep the real results node, including existing save-button handlers and render updates.
 const results=document.getElementById('shLiveJobsList');
 let marker=null;
 function bringResults(){
  if(!results)return;
  if(!marker){marker=document.createComment('sh22-original-jobs-list');results.parentNode?.insertBefore(marker,results)}
  if(results.parentNode!==pane.querySelector('.sh22-job-list'))pane.querySelector('.sh22-job-list').append(results);
  results.style.display='';
 }
 function restoreResults(){if(marker?.parentNode&&results&&results.parentNode!==marker.parentNode)marker.parentNode.insertBefore(results,marker)}
 function showCreators(){dir.classList.remove('sh22-show-jobs');pane.hidden=true;restoreResults();newJobsTab.setAttribute('aria-selected','false');creatorsTab.setAttribute('aria-selected','true')}
 function showJobs(){
  dir.classList.add('sh22-show-jobs');pane.hidden=false;creatorsTab.setAttribute('aria-selected','false');newJobsTab.setAttribute('aria-selected','true');
  bringResults();
  const status=pane.querySelector('.sh22-status');
  if(!results){status.textContent='Job listings are unavailable. Please refresh the page.';return}
  status.textContent='Loading available jobs…';
  if(typeof window.shLoadRealJobs==='function')Promise.resolve(window.shLoadRealJobs()).then(()=>{status.textContent=results.querySelector('.job')?'Current member projects':'No published jobs are available yet.'}).catch(err=>{status.textContent='Unable to load jobs: '+(err?.message||'Try again.')});
  else status.textContent=results.querySelector('.job')?'Current member projects':'No published jobs are available yet.';
 }
 newJobsTab.addEventListener('click',e=>{e.preventDefault();showJobs()});
 // Original Find Creators listener still works; this additionally restores inline UI state.
 creatorsTab.addEventListener('click',showCreators);
 pane.querySelector('.sh22-refresh').addEventListener('click',showJobs);
 // If visitor opens full-screen Find Jobs elsewhere, restore the listing to its native location first.
 document.addEventListener('click',e=>{if(e.target.closest('#discover button,#jobs .sh79-choice')){if(!pane.hidden)showCreators()}},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* V23 — compact in-place job cards; native job/proposal functions are preserved. */
(()=>{'use strict';
const CSS23=`
#directory .sh22-inline-jobs{background:linear-gradient(155deg,#0c283c,#09202f);}
#directory .sh22-inline-jobs .sh22-job-list{gap:16px}
#directory .sh22-inline-jobs .job.sh23-job{background:#f9f7f2!important;border:1px solid #deccaf!important;border-radius:20px!important;box-shadow:0 12px 25px #0002!important;padding:20px!important;color:#142b35!important}
#directory .sh23-job .sh23-head{display:flex;align-items:center;gap:12px;margin-bottom:17px;min-width:0}
#directory .sh23-avatar{height:54px;width:54px;flex:0 0 54px;object-fit:cover;border-radius:50%;background:#dbdacd;border:2px solid #d5b184}
#directory .sh23-identity{min-width:0;flex:1}
#directory .sh23-identity strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#153345;font-size:16px}
#directory .sh23-identity small{display:block;color:#60747c;font-size:12px;margin-top:2px}
#directory .sh23-job .sh23-namebadge{color:#8c6742;background:#f2e7d6;border-radius:16px;padding:5px 9px;font-size:11px;font-weight:700;white-space:nowrap}
#directory .sh23-job .sh23-title{font:500 clamp(25px,5vw,34px)/1.1 Georgia,serif;color:#102f3e;margin:4px 0 14px}
#directory .sh23-job .sh23-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
#directory .sh23-job .sh23-fact{background:#ebeae3;border-radius:12px;padding:10px 11px;min-width:0}
#directory .sh23-job .sh23-fact small{display:block;color:#576e75;font-size:11px;margin-bottom:4px}
#directory .sh23-job .sh23-fact strong{font-size:13px;color:#14384c;overflow-wrap:anywhere}
#directory .sh23-job .sh23-desc{font:14px/1.6 system-ui,sans-serif;color:#40585e;margin:10px 0 16px;overflow-wrap:anywhere}
#directory .sh23-job .sh23-actions{display:grid;grid-template-columns:1fr auto;gap:9px;align-items:center}
#directory .sh23-job .sh23-apply{border:0;border-radius:11px;background:#c99f6d;color:#0e2736;font:750 14px system-ui;padding:14px 12px;min-height:48px;cursor:pointer}
#directory .sh23-job .sh23-save{border:1px solid #a4b4b1;border-radius:11px;color:#173647;background:transparent;font:600 13px system-ui;padding:12px;min-height:48px;cursor:pointer}
#directory .sh23-job .sh23-state{color:#4b646c;font-size:12px;margin:8px 0 0}
#directory .sh23-job.sh23-enhanced > :not(.sh23-shell):not(.sh-proposal-box){display:none!important}
#directory .sh23-job.sh23-enhanced .sh-proposal-box{display:block!important;margin:14px 0 0;max-width:100%}
#directory .sh23-job.sh23-enhanced .sh23-shell{display:block!important}
#directory .sh23-job .sh23-manage{margin-top:12px;border:1px solid #d7c9b5;border-radius:12px;padding:12px}
#directory .sh23-job .sh23-manage summary{font-size:13px;font-weight:700;cursor:pointer;color:#183d49}
#directory .sh23-job .sh23-manage .sh-job-controls{display:flex!important;flex-wrap:wrap!important;gap:6px;margin-top:10px}
#directory .sh23-job .sh23-manage button{font-size:12px!important;padding:10px!important;min-height:38px!important}
#discover .sh25-discovery-band{display:grid;grid-template-columns:1.2fr .8fr;gap:18px;margin:28px auto 50px;max-width:1080px;width:calc(100% - 42px);position:relative;z-index:1;align-items:stretch}
#discover .sh25-discovery-lead,#discover .sh25-discovery-notes{background:linear-gradient(135deg,#142b31d4,#081e26e2);border:1px solid #e4c09240;border-radius:18px;backdrop-filter:blur(10px)}
#discover .sh25-discovery-lead{padding:24px 24px 22px;color:#edf2ee;box-shadow:0 20px 50px #00000022}
#discover .sh25-kicker{display:block;font:700 11px system-ui;letter-spacing:.18em;color:#e1b781;text-transform:uppercase;margin-bottom:10px}
#discover .sh25-discovery-lead strong{display:block;font:normal clamp(24px,3vw,34px)/1.1 Georgia,serif;margin:0 0 10px;color:#fff9ef}
#discover .sh25-discovery-lead p{margin:0;color:#c6d7d4;font:14px/1.65 system-ui}
#discover .sh25-discovery-notes{display:grid;grid-template-columns:1fr;gap:0;padding:10px 0}
#discover .sh25-note{padding:14px 18px;color:#eff4ef}
#discover .sh25-note + .sh25-note{border-top:1px solid #ffffff14}
#discover .sh25-note strong{display:block;font:600 15px/1.35 system-ui;margin-bottom:4px;color:#f6e4c2}
#discover .sh25-note p{margin:0;color:#c8d5d3;font:13px/1.55 system-ui}
@media(max-width:640px){#directory .sh22-inline-jobs .job.sh23-job{padding:15px!important}#directory .sh23-job .sh23-meta{gap:7px}#directory .sh23-job .sh23-actions{grid-template-columns:1fr auto}#discover .sh25-discovery-band{grid-template-columns:1fr;gap:10px;margin:16px auto 34px;width:calc(100% - 28px)}#discover .sh25-discovery-lead{padding:18px 18px 16px}#discover .sh25-discovery-lead strong{font-size:24px}#discover .sh25-note{padding:13px 16px}}
`;
const $=s=>document.querySelector(s);
function d(tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e}
function config(){const c=window.SHUTTERHUNTERS_CONFIG||{};return c}
let db=null;
function api(){if(db)return db;const c=config();if(c.supabaseUrl&&c.supabaseAnonKey&&window.supabase?.createClient)db=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});return db}
let jobs=[];let people=new Map();let me=null;let loading=false;
async function loadExtra(){if(loading)return;loading=true;try{const client=api();if(!client)return;const auth=await client.auth.getUser();me=auth.data?.user?.id||null;const res=await client.from('sh_job_posts').select('id,client_id,title,location,budget,event_date,specialty,details,status').eq('status','open').order('created_at',{ascending:false}).limit(100);if(res.error)return;jobs=res.data||[];const ids=[...new Set(jobs.map(j=>j.client_id).filter(Boolean))];if(!ids.length)return;const q=await client.from('profiles').select('id,display_name,avatar_url,city,state,is_public').in('id',ids);if(!q.error)people=new Map((q.data||[]).map(p=>[p.id,p]));}catch(err){console.warn('Job card profiles:',err)}finally{loading=false;draw()}}
function findJob(card){const title=card.querySelector('.sh-job-top h3, h3')?.textContent?.trim()||'';const loc=card.querySelector('.sh-job-meta')?.textContent?.split(' · ')[0]?.trim()||'';return jobs.find(j=>j.title===title&&(!loc||String(j.location||'').trim()===loc))||null}
function val(v){return v==null||v===''?'Not specified':String(v)}
function fact(label,value){const el=d('div','sh23-fact');el.append(d('small','',label),d('strong','',value));return el}
function cleanCards(){document.querySelectorAll('#shLiveJobsList .sh23-enhanced').forEach(card=>{const shell=card.querySelector(':scope > .sh23-shell');const controls=shell?.querySelector('.sh23-manage .sh-job-controls');if(controls)card.append(controls);shell?.remove();card.classList.remove('sh23-job','sh23-enhanced');});}
function draw(){const parent=$('#sh22-inline-jobs #shLiveJobsList');if(!parent)return;for(const card of parent.querySelectorAll('.sh-job-live')){
 if(card.classList.contains('sh23-enhanced'))continue;
 const job=findJob(card);if(!job && !jobs.length)continue;
 const original=card.querySelector('.sh-job-controls');const isMine=!!(job&&me&&me===job.client_id);const profile=job?people.get(job.client_id):null;
 const shell=d('div','sh23-shell'),head=d('div','sh23-head');const avatar=d('img','sh23-avatar');avatar.alt='Client portrait';avatar.loading='lazy';avatar.src=profile?.avatar_url&&/^https:\/\//.test(profile.avatar_url)?profile.avatar_url:'creator1.webp';avatar.onerror=()=>{avatar.onerror=null;avatar.src='creator1.webp'};
 const identity=d('div','sh23-identity');identity.append(d('strong','',profile?.display_name||'ShutterHunters client'),d('small','',isMine?'Your listing':profile?'Client profile':'Client details unavailable'));
 head.append(avatar,identity,d('span','sh23-namebadge',isMine?'Your project':'Open project'));
 shell.append(head,d('h3','sh23-title',job?.title||card.querySelector('h3')?.textContent||'Creative opportunity'));
 const meta=d('div','sh23-meta');meta.append(fact('LOCATION',val(job?.location||card.querySelector('.sh-job-meta')?.textContent?.split(' · ')[0])),fact('PROJECT PAY',job?.budget!=null?'$'+Number(job.budget).toLocaleString():'Not listed'),fact('SHOOT DATE',job?.event_date?new Date(job.event_date+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):'Flexible'),fact('TYPE OF SHOOT',val(job?.specialty||card.querySelector('.sh-job-meta')?.textContent?.split(' · ')[1])));shell.append(meta);
 shell.append(d('p','sh23-desc',String(job?.details||card.querySelector('p')?.textContent||'').slice(0,200)));
 const actions=d('div','sh23-actions'),main=d('button','sh23-apply',isMine?'View Your Listing':'Message Client'),save=d('button','sh23-save','Save Job');main.type=save.type='button';
 main.addEventListener('click',async()=>{
  if(isMine){card.querySelector('.sh81-view-job')?.click();return}
  const apply=[...(original?.querySelectorAll('button')||[])].find(b=>/Send proposal|Unlock Pro/i.test(b.textContent));
  if(!apply){alert('Messaging is not available for this project.');return}
  if(/Unlock Pro/i.test(apply.textContent)){apply.click();return}
  if(!me){alert('Please sign in to message this client.');return}
  const existing=card.querySelector('.sh-proposal-box');
  if(!existing)apply.click();
  const form=card.querySelector('.sh-proposal-box');
  const field=form?.querySelector('textarea');
  if(!form||!field){alert('Could not open the inquiry form. Please try again.');return}
  if(!field.value.trim()){
   let myName='';try{const result=await api()?.from('profiles').select('display_name,is_public').eq('id',me).maybeSingle();myName=result?.data?.display_name||''}catch(e){}
   field.value=`Hi! ${myName?'I’m '+myName+', and I’m':'I’m'} interested in your ${job?.title||'creative'} project${job?.event_date?' on '+job.event_date:''}. I’d love to be considered. You can view my ShutterHunters creator profile and portfolio through my account here. I look forward to hearing more about the project!`;
  }
  const send=form.querySelector('button[type="submit"]');
  if(!send){form.scrollIntoView({behavior:'smooth',block:'nearest'});return}
  // A tap on Message Client deliberately sends the prepared message through the site's existing job proposal RPC.
  // Avoid double sending while the asynchronous submission runs.
  if(main.disabled)return;
  main.disabled=true;main.textContent='Sending message…';
  form.requestSubmit(send);
  setTimeout(()=>{const feedback=form.querySelector('.sh-job-status')?.textContent||'';if(/sent|submitted/i.test(feedback)){main.textContent='Message Sent';main.disabled=true;}else{main.textContent='Message Client';main.disabled=false;if(feedback&&/error|failed|permission|denied/i.test(feedback))alert(feedback)}},1300);
 });
 const nativeSave=[...(original?.querySelectorAll('button')||[])].find(b=>/Save Job/i.test(b.textContent));save.addEventListener('click',()=>{const alternate=card.querySelector('.sh20-job-save');(nativeSave||alternate)?.click();save.textContent='Saved ✓'});
 actions.append(main,save);shell.append(actions);
 const note=d('p','sh23-state',isMine?'This is your listing. Applicants can contact you through Inquiries.':'Message Client sends an automatic introduction with your ShutterHunters account attached through the existing inquiry system.');shell.append(note);
 // Keep native job controls in the DOM for existing handlers, but do not display Manage This Listing in the card.

 card.prepend(shell);card.classList.add('sh23-job','sh23-enhanced');
 }}
function addDiscovery(){const section=$('#discover');if(!section||$('#sh25-discovery-band'))return;const band=d('section','sh25-discovery-band');band.id='sh25-discovery-band';const lead=d('div','sh25-discovery-lead');lead.append(d('span','sh25-kicker','Why ShutterHunters'),d('strong','',"A smoother way to book talent or land your next project."),d('p','',"Browse opportunities, connect with creatives, and keep everything organized in one clean place."));const notes=d('div','sh25-discovery-notes');[['Post a Job','Tell creators exactly what you need and meet the best matches fast.'],['Find Jobs','Discover real projects from clients looking for creative professionals.'],['Built for creators','Save profiles, save jobs, and keep your inbox and bookings together.']].forEach(([t,s])=>{const item=d('div','sh25-note');item.append(d('strong','',t),d('p','',s));notes.append(item)});band.append(lead,notes);const hero=section.querySelector('.hero,.sh79-hero')||section.firstElementChild;if(hero?.parentNode===section)hero.after(band);else section.append(band)}
function init(){if($('#sh23-style'))return;const s=d('style');s.id='sh23-style';s.textContent=CSS23;document.head.append(s);addDiscovery();const list=$('#shLiveJobsList');if(list){let frame=false;const observer=new MutationObserver(()=>{if(frame)return;frame=true;requestAnimationFrame(()=>{frame=false;draw()})});observer.observe(list,{childList:true});draw()};document.addEventListener('click',e=>{if(e.target.closest('#sh21-jobs,.sh22-refresh')){loadExtra();setTimeout(draw,180)}if(e.target.closest('#sh21-creators,#discover button,#jobs .sh79-choice,#shFindV14'))cleanCards();},true);loadExtra();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();


/* V26 — My Job Postings. Separate from Find Jobs and Top Five. */
(()=>{
'use strict';
const style=document.createElement('style');style.id='sh26-myjobs-style';style.textContent=`
#sh26-myjobs{max-width:960px;margin:25px 0 30px;color:#f5f5ef;font-family:system-ui,sans-serif}
#sh26-myjobs button{cursor:pointer}
#sh26-myjobs .sh26-toggle{width:100%;min-height:67px;text-align:left;padding:18px 21px;background:linear-gradient(120deg,#173c43,#102b36);color:#f5f5f1;border:1px solid #dbb47b72;border-radius:16px;display:flex;align-items:center;justify-content:space-between;gap:15px}
#sh26-myjobs .sh26-toggle span{font:500 clamp(21px,3vw,29px) Georgia,serif}
#sh26-myjobs .sh26-toggle small{font:600 12px system-ui;color:#e7c08a}
#sh26-myjobs .sh26-panel{padding:18px 0}
#sh26-myjobs .sh26-panel[hidden]{display:none!important}
#sh26-myjobs .sh26-intro{font:14px/1.5 system-ui;color:#c6d8d5;margin:0 0 16px}
#sh26-myjobs .sh26-card{padding:20px;margin:12px 0;background:#17383b;border:1px solid #6d918b77;border-radius:15px}
#sh26-myjobs .sh26-card h3{font:500 25px/1.2 Georgia,serif;margin:0 0 8px;color:#fff}
#sh26-myjobs .sh26-meta{font:13px/1.6 system-ui;color:#c7dbd8;overflow-wrap:anywhere}
#sh26-myjobs .sh26-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:17px}
#sh26-myjobs .sh26-actions button,#sh26-myjobs .sh26-refresh{min-height:43px;border-radius:10px;padding:10px 17px;border:1px solid #dfb983;color:#faefe1;background:#25464a;font:650 13px system-ui}
#sh26-myjobs .sh26-actions .sh26-delete{border-color:#d59a91;color:#fff0ed;background:#643b39}
#sh26-myjobs .sh26-message{color:#e6bc87;font:13px/1.5 system-ui;margin-top:10px}
@media(max-width:650px){#sh26-myjobs{margin:18px 0}#sh26-myjobs .sh26-toggle{padding:16px}#sh26-myjobs .sh26-actions button{flex:1}}
`;document.head.append(style);
let db=null;function client(){if(db)return db;const c=window.SHUTTERHUNTERS_CONFIG||{};if(!window.supabase?.createClient||!c.supabaseUrl||!c.supabaseAnonKey)return null;db=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});return db;}
const el=(tag,cl,txt)=>{const e=document.createElement(tag);if(cl)e.className=cl;if(txt!=null)e.textContent=txt;return e};
function mount(){if(document.getElementById('sh26-myjobs'))return;const target=document.querySelector('#jobs .sh79-choices');if(!target)return;const root=el('section');root.id='sh26-myjobs';const toggle=el('button','sh26-toggle');toggle.type='button';toggle.setAttribute('aria-expanded','false');toggle.append(el('span','', 'My Job Postings'),el('small','', 'View my posts  ›'));const panel=el('div','sh26-panel');panel.hidden=true;root.append(toggle,panel);target.after(root);toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)load(panel)};}
async function load(panel){panel.replaceChildren(el('p','sh26-intro','Your published jobs, their status, and a shortcut to applicant messages.'));const note=el('p','sh26-message','Loading your postings…');panel.append(note);const api=client();if(!api){note.textContent='Unable to connect to your account. Refresh and try again.';return}const {data:auth,error:ae}=await api.auth.getUser();if(ae||!auth?.user){note.textContent='Sign in to view your job postings.';return}const uid=auth.user.id;const {data:jobs,error}=await api.from('sh_job_posts').select('id,title,location,budget,event_date,status,created_at').eq('client_id',uid).order('created_at',{ascending:false}).limit(100);if(error){note.textContent='Unable to load your job postings: '+error.message;return}note.textContent=jobs?.length?`${jobs.length} posting${jobs.length===1?'':'s'}`:'You have not published any jobs yet.';for(const job of jobs||[]){const card=el('article','sh26-card');card.append(el('h3','',job.title||'Untitled job'));const meta=el('div','sh26-meta',[(job.location||'Location not listed'),job.event_date?`Shoot date: ${job.event_date}`:null,job.budget!=null?`Budget: $${Number(job.budget).toLocaleString()}`:null,`Status: ${job.status||'Unknown'}`].filter(Boolean).join(' · '));card.append(meta);card.append(el('p','sh26-meta','Likes / saves: Count unavailable until job engagement data is connected.'));const actions=el('div','sh26-actions');const inbox=el('button','','Messages · Inbox');inbox.type='button';inbox.onclick=()=>{if(typeof window.go==='function'){window.go('inbox');const nav=document.querySelector('[data-tab="inbox"]');nav?.click()}else{document.querySelector('#inbox')?.scrollIntoView({behavior:'smooth'})}};const del=el('button','sh26-delete','Delete Post');del.type='button';del.onclick=async()=>{if(!confirm(`Permanently delete “${job.title}”? This cannot be undone. Existing applicant conversations may be affected. Cancel to keep it.`))return;del.disabled=true;const {error:de}=await api.from('sh_job_posts').delete().eq('id',job.id).eq('client_id',uid);if(de){alert('Unable to delete this post: '+de.message);del.disabled=false;return}await load(panel);if(typeof window.shLoadRealJobs==='function')window.shLoadRealJobs().catch(()=>{})};actions.append(inbox,del);card.append(actions);panel.append(card)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();

/* V27: clearer introduction CTA. Trial entitlements must come from the server, not this UI. */
(()=>{
 function setupIntro(){
  const btn=document.getElementById('sh72Next');if(!btn||btn.dataset.sh27Intro)return;
  btn.dataset.sh27Intro='1';
  const observer=new MutationObserver(()=>{
    const current=document.getElementById('sh72Step')?.textContent||'';
    if(current.includes('03')){
      btn.textContent='Create my creator profile →';
      const body=document.getElementById('sh72WelcomeBody');
      if(body)body.textContent='Build your creator profile now. A seven-day Pro trial will be offered once it is enabled for your account; no trial begins until the membership system confirms it.';
    }
  });
  observer.observe(document.getElementById('sh72Welcome')||btn,{subtree:true,childList:true,characterData:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupIntro,{once:true});else setupIntro();
})();
