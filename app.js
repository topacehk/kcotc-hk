const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const root = document.getElementById("events");

// Create / load anonymous token
let token = localStorage.getItem("kcotc_token");

if (!token) {
  token = crypto.randomUUID();
  localStorage.setItem("kcotc_token", token);
}

// Format date nicely with weekday
function formatDate(dateStr) {
  const date = new Date(dateStr);

  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Load and render events
async function load() {
  const events = await fetch("events.json").then(r => r.json());

  root.innerHTML = "";

  for (const ev of events) {

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

    // If user already joined
    if (mine) {
      btn.textContent = "Cancel Attendance";
      btn.className = "cancel";
      btn.onclick = () => cancel(ev.id);

    // If full (still enforced even if hidden in UI)
    } else if (count >= ev.max) {
      btn.textContent = "Full";
      btn.className = "full";
      btn.disabled = true;

    // Join option
    } else {
      btn.textContent = "Join";
      btn.className = "join";
      btn.onclick = () => join(ev.id);
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
