const SUPABASE_URL='https://valyxoinmhaxjnysbabx.supabase.co';
const SUPABASE_KEY='sb_publishable_p_zRMQCt548aRQHxy6JugA_RrT9kmAj';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const root=document.getElementById('events');
let token=localStorage.getItem('kcotc_token');
if(!token){token=crypto.randomUUID();localStorage.setItem('kcotc_token',token);}
async function load(){
 const events=await fetch('events.json').then(r=>r.json());
 root.innerHTML='';
 for(const ev of events){
   const {data:rsvps}=await sb.from('rsvps').select('*').eq('event_id',ev.id).eq('status','yes');
   const count=rsvps.length;
   const mine=rsvps.find(x=>x.token===token);
   const card=document.createElement('div');card.className='card';
   card.innerHTML=`<h3>${ev.date}</h3><p>${ev.time}</p><p>${count} / ${ev.max} attending</p>`;
   const btn=document.createElement('button');
   if(mine){btn.textContent='Cancel Attendance';btn.className='cancel';btn.onclick=()=>cancel(ev.id);}
   else if(count>=ev.max){btn.textContent='Full';btn.className='full';btn.disabled=true;}
   else {btn.textContent='Join';btn.className='join';btn.onclick=()=>join(ev.id);}
   card.appendChild(btn);root.appendChild(card);
 }
}
async function join(id){await sb.from('rsvps').insert({event_id:id,token,status:'yes'});load();}
async function cancel(id){await sb.from('rsvps').delete().eq('event_id',id).eq('token',token);load();}
load();
