const SUPABASE_URL = "https://valyxoinmhaxjnysbabx.supabase.co";
const SUPABASE_KEY = "sb_publishable_p_zRMQCt548aRQHxy6JugA_RrT9kmAj";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const root = document.getElementById("events");

// Create / load anonymous token
let token = localStorage.getItem("kcotc_token");

if (!token) {
  token = crypto.randomUUID();
  localStorage.setItem("kcotc_token", token);
}

// Format date nicely
function formatDate(dateStr) {
  const date = new Date(dateStr);

  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Return YYYY-MM-DD for today (local time)
function todayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Load and render events
async function load() {
  const events = await fetch("events.json").then(r => r.json());

  root.innerHTML = "";

  const today = todayString();

  // Keep only today + future events
  const visibleEvents = events.filter(ev => ev.date >= today);

  if (visibleEvents.length === 0) {
    root.innerHTML = "<p>No upcoming events.</p>";
    return;
  }

  for (const ev of visibleEvents) {

    const { data: rsvps } = await sb
      .from("rsvps")
      .select("*")
      .eq("event_id", ev.id)
      .eq("status", "yes");

    const count = rsvps ? rsvps.length : 0;
    const mine = rsvps ? rsvps.find(x => x.token === token) : null;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${formatDate(ev.date)}</h3>
      <p>${ev.time}</p>
      <p>${count} attending</p>
    `;

    const btn = document.createElement("button");

    // RSVP allowed ONLY for today
    if (ev.date === today) {

      if (mine) {
        btn.textContent = "Cancel Attendance";
        btn.className = "cancel";
        btn.onclick = () => cancel(ev.id);

      } else if (count >= ev.max) {
        btn.textContent = "Full";
        btn.className = "full";
        btn.disabled = true;

      } else {
        btn.textContent = "Join";
        btn.className = "join";
        btn.onclick = () => join(ev.id);
      }

    } else {
      // Future events view only
      btn.textContent = "View Only";
      btn.className = "full";
      btn.disabled = true;
    }

    card.appendChild(btn);
    root.appendChild(card);
  }
}

// Join event
async function join(eventId) {
  await sb.from("rsvps").insert({
    event_id: eventId,
    token: token,
    status: "yes"
  });

  load();
}

// Cancel RSVP
async function cancel(eventId) {
  await sb
    .from("rsvps")
    .delete()
    .eq("event_id", eventId)
    .eq("token", token);

  load();
}

// Initial load
load();
