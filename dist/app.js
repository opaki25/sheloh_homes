'use strict';
const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => [...root.querySelectorAll(s)];
const booking = $('#booking-dialog'), form = $('#booking-form'), media = $('#media-dialog');
let step = 0, activeGallery = 0, message = '';
const field = name => form.elements.namedItem(name);
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Kampala',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function addDay(value){const d=new Date(value+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10);}
function nights(a,b){return Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);}
function pretty(value){return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));}
function openDialog(dialog){dialog.showModal();document.body.classList.add('modal-open');}
function closeDialog(dialog){dialog.close();}
$$('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');if(dialog===media){const v=$('video',media);if(v)v.pause();}});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog);}});});
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
function showStep(n){step=n;$$('.form-step').forEach((el,i)=>el.hidden=i!==n);$$('.step-indicator span').forEach((el,i)=>el.classList.toggle('active',i<=n));booking.scrollTop=0;const title=$('h2',$(`.form-step[data-step="${n}"]`));title.tabIndex=-1;title.focus({preventScroll:true});}
function openBooking(preference){if(media.open)media.close();if(preference)field('preference').value=preference;showStep(0);setDates();openDialog(booking);}
$$('[data-book]').forEach(b=>b.addEventListener('click',()=>openBooking()));
function setDates(){const min=today();field('checkin').min=min;$('#quick-in').min=min;field('checkout').min=field('checkin').value?addDay(field('checkin').value):addDay(min);$('#quick-out').min=$('#quick-in').value?addDay($('#quick-in').value):addDay(min);updateNights();}
function updateNights(){const a=field('checkin').value,b=field('checkout').value;const n=nights(a,b);$('#night-count').textContent=a&&b&&n>0?`${n} night${n===1?'':'s'} · Kyanja, Kampala`:'Your dates, your pace.';}
field('checkin').addEventListener('change',()=>{if(field('checkout').value&&field('checkout').value<=field('checkin').value)field('checkout').value='';setDates();});
field('checkout').addEventListener('change',updateNights);
$('#quick-in').addEventListener('change',()=>{if($('#quick-out').value&&$('#quick-out').value<=$('#quick-in').value)$('#quick-out').value='';setDates();});
function validateStay(){setDates();for(const name of ['checkin','checkout'])if(!field(name).reportValidity())return false;const a=field('checkin').value,b=field('checkout').value;if(a<today()||b<=a){$('#date-error').textContent='Please choose a future check-in date and a later check-out date.';return false;}$('#date-error').textContent='';return true;}
$('#quick-book').addEventListener('submit',e=>{e.preventDefault();field('checkin').value=$('#quick-in').value;field('checkout').value=$('#quick-out').value;field('adults').value=$('#quick-guests').value==='6'?'6+':$('#quick-guests').value;openBooking();if(validateStay())showStep(1);});
$('#stay-next').addEventListener('click',()=>{if(validateStay())showStep(1);});
function buildMessage(){const a=field('checkin').value,b=field('checkout').value;return `Hello Sheloh Homes! 👋\nI'd like to enquire about a stay.\n\n*STAY DETAILS*\nCheck-in: ${pretty(a)}\nCheck-out: ${pretty(b)}\nDuration: ${nights(a,b)} night${nights(a,b)===1?'':'s'}\nAdults: ${field('adults').value}\nChildren: ${field('children').value}\nVisit: ${field('occasion').value}\nPreference: ${field('preference').value}\n\n*GUEST DETAILS*\nName: ${field('guestname').value.trim()}${field('phone').value.trim()?'\nPhone: '+field('phone').value.trim():''}${field('notes').value.trim()?'\n\n*SPECIAL REQUESTS*\n'+field('notes').value.trim():''}\n\nPlease confirm the available home, total price, check-in/out times, payment and cancellation terms.\n\nThank you!\nEnquiry via the Sheloh Homes website.`;}
$('#guest-next').addEventListener('click',()=>{field('guestname').value=field('guestname').value.trim();if(!field('guestname').reportValidity())return;if(!validateStay()){showStep(0);return;}message=buildMessage();$('#enquiry-preview').textContent=message;$('#send-enquiry').href='https://wa.me/256777157159?text='+encodeURIComponent(message);$('#send-status').textContent='';$('#copy-message').textContent='Copy message instead';showStep(2);});
$$('[data-back]').forEach(b=>b.addEventListener('click',()=>showStep(step-1)));
form.addEventListener('submit',e=>{e.preventDefault();if(step===0)$('#stay-next').click();else if(step===1)$('#guest-next').click();});
$('#send-enquiry').addEventListener('click',()=>{$('#send-status').textContent='Finish by pressing send in WhatsApp. Your stay is confirmed only when the host confirms it with you.';});
$('#copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message);$('#copy-message').textContent='Message copied ✓';}catch{$('#send-status').textContent='Select and copy the message above, then paste it into WhatsApp.';}});
const gallery=[['living.webp','Make yourself comfortable.','A sitting room made for slowing down.'],['bedroom.webp','Slow mornings, please.','Warm light and a space to rest.'],['warm-living.webp','A taste of home.','Everyday moments in the kitchen.'],['dining.webp','Gather around.','A little time at the table.'],['bathroom.webp','The finishing touches.','A closer look at the bathroom.'],['balcony.webp','A breath of fresh air.','A glimpse of the balcony.'],['romance.webp','Make a moment of it.','Special occasion styling, by enquiry.'],['cozy.webp','Settle right in.','Your cozy corner.']];
function displayGallery(){const [src,title,alt]=gallery[activeGallery];const im=new Image();im.src='assets/'+src;im.alt=alt;$('#media-content').replaceChildren(im);$('#media-title').textContent=title;$('#media-kicker').textContent='INSIDE SHELOH HOMES';$('.gallery-controls').hidden=false;$('#gallery-count').textContent=`${activeGallery+1} / ${gallery.length}`;$('#media-enquire').dataset.preference='Help me choose';}
$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{activeGallery=Number(b.dataset.gallery);displayGallery();openDialog(media);}));
function moveGallery(dir){activeGallery=(activeGallery+dir+gallery.length)%gallery.length;displayGallery();}
$('#gallery-prev').addEventListener('click',()=>moveGallery(-1));$('#gallery-next').addEventListener('click',()=>moveGallery(1));media.addEventListener('keydown',e=>{if($('.gallery-controls').hidden)return;if(e.key==='ArrowLeft'){e.preventDefault();moveGallery(-1);}if(e.key==='ArrowRight'){e.preventDefault();moveGallery(1);}});
const tours={home:['Your first look inside','living.webp','The first-look walkthrough'],details:['Comfort in the details','cozy.webp','Comfort in the details tour'],romance:['Make a moment of it','romance.webp','The special occasion setup'],kitchen:['Everyday, made lovely','kitchen.webp','Everyday, made lovely tour']};
$$('[data-tour]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.tour,[title,poster,preference]=tours[key];const v=document.createElement('video');v.src=`assets/tour-${key}.mp4`;v.poster='assets/'+poster;v.controls=true;v.playsInline=true;v.muted=true;v.autoplay=true;v.setAttribute('aria-label',title+' — silent property walkthrough');$('#media-content').replaceChildren(v);$('#media-title').textContent=title;$('#media-kicker').textContent='A SILENT TOUR OF SHELOH HOMES';$('.gallery-controls').hidden=true;$('#media-enquire').dataset.preference=preference;openDialog(media);v.play().catch(()=>{});}));
$('#media-enquire').addEventListener('click',()=>openBooking($('#media-enquire').dataset.preference));
$('#privacy-open').addEventListener('click',()=>openDialog($('#privacy-dialog')));
const menu=$('.menu-toggle');menu.addEventListener('click',()=>{const opened=$('#navigation').classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));menu.setAttribute('aria-label',opened?'Close navigation':'Open navigation');});
$$('#navigation a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#navigation').classList.remove('open');menu.setAttribute('aria-expanded','false');}});
$('#year').textContent=new Date().getFullYear();setDates();

// Silent loops play only while visible; visitors can pause motion at any time.
const ambientVideos = $$('.ambient-video');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let heroPaused = reducedMotion.matches, toursPaused = reducedMotion.matches;
const visibleVideos = new Set();
function syncAmbient(){
  for(const video of ambientVideos){
    const paused = video.classList.contains('hero-video') ? heroPaused : toursPaused;
    if(paused || document.hidden || document.querySelector('dialog[open]') || !visibleVideos.has(video)) video.pause();
    else {video.muted=true;video.play().catch(()=>{});}
  }
  const heroPlaying=!$('.hero-video').paused;
  $('#hero-motion').innerHTML=heroPlaying?'Ⅱ <span>Pause video</span>':'▷ <span>Play video</span>';
  $('#hero-motion').setAttribute('aria-label',heroPlaying?'Pause background video':'Play background video');
  $('#tour-motion').textContent=toursPaused?'▷ Play previews':'Ⅱ Pause previews';
  $('#tour-motion').setAttribute('aria-label',toursPaused?'Play tour previews':'Pause tour previews');
}
const videoObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)visibleVideos.add(entry.target);else visibleVideos.delete(entry.target);}syncAmbient();},{threshold:.1});
ambientVideos.forEach(video=>{video.muted=true;if(reducedMotion.matches)video.pause();videoObserver.observe(video);});
$('.hero-video').addEventListener('play',()=>{$('#hero-motion').innerHTML='Ⅱ <span>Pause video</span>';$('#hero-motion').setAttribute('aria-label','Pause background video');});
$('#hero-motion').addEventListener('click',()=>{heroPaused=!$('.hero-video').paused;syncAmbient();});
$('#tour-motion').addEventListener('click',()=>{toursPaused=!toursPaused;syncAmbient();});
document.addEventListener('visibilitychange',syncAmbient);
reducedMotion.addEventListener('change',e=>{heroPaused=e.matches;toursPaused=e.matches;syncAmbient();});
$$('dialog').forEach(dialog=>new MutationObserver(syncAmbient).observe(dialog,{attributes:true,attributeFilter:['open']}));
