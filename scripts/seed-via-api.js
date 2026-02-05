/**
 * Script de seed : remplit la base via les endpoints de l'API.
 * Crée de nombreuses données pour chaque ressource (users, groups, events, threads, albums, polls, tickets, shopping, carpool).
 * Prérequis : l'API doit être lancée (npm run dev ou npm start).
 *
 * Usage : node scripts/seed-via-api.js
 * Option : SEED_BASE_URL=http://localhost:3000 node scripts/seed-via-api.js
 */

require('dotenv').config();

const BASE_URL = process.env.SEED_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';
const API = `${BASE_URL}/api`;

const users = []; // liste des users créés ou connectés (id, email, etc.)
let tokens = {};  // email -> accessToken pour les appels authentifiés

async function request(method, path, body = null, token = null) {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  if (body && (method === 'POST' || method === 'PATCH')) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${path}: ${data?.error || text || res.statusText}`);
  }
  return data;
}

// Les réponses API peuvent renvoyer id ou _id selon le modèle
function id(obj) {
  if (!obj) return null;
  return obj.id ?? obj._id ?? null;
}

async function register(email, password, firstName, lastName) {
  const data = await request('POST', '/auth/register', {
    email,
    password,
    firstName,
    lastName,
  });
  users.push({ id: id(data), email, password, firstName, lastName });
  return data;
}

/** Inscription ou réutilisation si l'email existe déjà (409). */
async function registerOrLogin(email, password, firstName, lastName) {
  try {
    const data = await register(email, password, firstName, lastName);
    return data;
  } catch (err) {
    if (err.message.includes('409') && err.message.includes('Email already in use')) {
      const data = await request('POST', '/auth/login', { email, password });
      tokens[email] = data.accessToken;
      const uid = data.user?.id ?? data.user?._id ?? null;
      users.push({ id: uid, email, password, firstName, lastName });
      return data.user || data;
    }
    throw err;
  }
}

async function login(email, password) {
  const data = await request('POST', '/auth/login', { email, password });
  tokens[email] = data.accessToken;
  return data;
}

function token(email) {
  return tokens[email] || null;
}

function userId(email) {
  return users.find((u) => u.email === email)?.id ?? null;
}

async function main() {
  console.log('Seed via API — base URL:', API);
  console.log('');

  const now = new Date();
  const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
  const addHours = (date, h) => new Date(date.getTime() + h * 60 * 60 * 1000);

  try {
    // ——— 1. Utilisateurs (8) : inscription ou connexion si déjà existants ———
    console.log('1. Utilisateurs (inscription ou connexion si déjà existants)…');
    const userData = [
      ['alice@example.com', 'Alice', 'Martin'],
      ['bob@example.com', 'Bob', 'Dupont'],
      ['charlie@example.com', 'Charlie', 'Bernard'],
      ['diana@example.com', 'Diana', 'Petit'],
      ['eve@example.com', 'Eve', 'Leroy'],
      ['frank@example.com', 'Frank', 'Moreau'],
      ['grace@example.com', 'Grace', 'Simon'],
      ['henry@example.com', 'Henry', 'Laurent'],
    ];
    for (const [email, firstName, lastName] of userData) {
      await registerOrLogin(email, 'Password123!', firstName, lastName);
    }
    // Tokens pour ceux qui viennent d'être inscrits (registerOrLogin en 409 a déjà mis le token)
    console.log('2. Connexion…');
    for (const [email] of userData) {
      if (!tokens[email]) await login(email, 'Password123!');
    }
    console.log('   → 8 utilisateurs prêts, tokens récupérés.');

    // ——— 3. Groupes (5) + membres ———
    console.log('3. Création des groupes…');
    const group1 = await request('POST', '/groups', {
      name: 'Sorties Paris',
      description: 'Organisation de sorties entre amis à Paris. Événements réguliers.',
      type: 'public',
      allowMembersToPost: true,
      allowMembersToCreateEvents: true,
    }, token('alice@example.com'));

    const group2 = await request('POST', '/groups', {
      name: 'Équipe projet API',
      description: 'Groupe privé du projet web.',
      type: 'private',
      allowMembersToPost: true,
      allowMembersToCreateEvents: false,
    }, token('alice@example.com'));

    const group3 = await request('POST', '/groups', {
      name: 'Afterwork Lyon',
      description: 'Afterworks et apéros à Lyon. Groupe public.',
      type: 'public',
      allowMembersToPost: true,
      allowMembersToCreateEvents: true,
    }, token('eve@example.com'));

    const group4 = await request('POST', '/groups', {
      name: 'Colocation Villa Sud',
      description: 'Groupe secret de la colocation.',
      type: 'secret',
      allowMembersToPost: true,
      allowMembersToCreateEvents: true,
    }, token('diana@example.com'));

    const group5 = await request('POST', '/groups', {
      name: 'Festival 2025',
      description: 'Organisation du voyage festival été 2025.',
      type: 'private',
      allowMembersToPost: true,
      allowMembersToCreateEvents: true,
    }, token('frank@example.com'));

    // Membres des groupes
    await request('POST', `/groups/${id(group1)}/members`, { userId: userId('bob@example.com'), role: 'member' }, token('alice@example.com'));
    await request('POST', `/groups/${id(group1)}/members`, { userId: userId('charlie@example.com'), role: 'admin' }, token('alice@example.com'));
    await request('POST', `/groups/${id(group1)}/members`, { userId: userId('diana@example.com'), role: 'member' }, token('alice@example.com'));
    await request('POST', `/groups/${id(group1)}/members`, { userId: userId('eve@example.com'), role: 'member' }, token('alice@example.com'));

    await request('POST', `/groups/${id(group2)}/members`, { userId: userId('bob@example.com'), role: 'member' }, token('alice@example.com'));
    await request('POST', `/groups/${id(group2)}/members`, { userId: userId('charlie@example.com'), role: 'admin' }, token('alice@example.com'));

    await request('POST', `/groups/${id(group3)}/members`, { userId: userId('frank@example.com'), role: 'admin' }, token('eve@example.com'));
    await request('POST', `/groups/${id(group3)}/members`, { userId: userId('grace@example.com'), role: 'member' }, token('eve@example.com'));
    await request('POST', `/groups/${id(group3)}/members`, { userId: userId('henry@example.com'), role: 'member' }, token('eve@example.com'));

    await request('POST', `/groups/${id(group4)}/members`, { userId: userId('eve@example.com'), role: 'member' }, token('diana@example.com'));
    await request('POST', `/groups/${id(group4)}/members`, { userId: userId('frank@example.com'), role: 'admin' }, token('diana@example.com'));

    await request('POST', `/groups/${id(group5)}/members`, { userId: userId('grace@example.com'), role: 'admin' }, token('frank@example.com'));
    await request('POST', `/groups/${id(group5)}/members`, { userId: userId('henry@example.com'), role: 'member' }, token('frank@example.com'));
    await request('POST', `/groups/${id(group5)}/members`, { userId: userId('alice@example.com'), role: 'member' }, token('frank@example.com'));
    console.log('   → 5 groupes créés, membres ajoutés.');

    // ——— 4. Événements (6) + participants ———
    console.log('4. Création des événements…');
    const event1 = await request('POST', '/events', {
      name: 'Barbecue été 2025',
      description: 'Barbecue au parc, amène ton plat à partager. Inscription ouverte à tous.',
      startDate: addDays(7).toISOString(),
      endDate: addHours(addDays(7), 6).toISOString(),
      location: 'Parc de la Villette, Paris',
      visibility: 'public',
      settings: { shoppingListEnabled: true, carpoolingEnabled: true, ticketingEnabled: false },
    }, token('alice@example.com'));

    const event2 = await request('POST', '/events/groups/' + id(group1), {
      name: 'Soirée jeux de société',
      description: 'Soirée jeux au bar associatif. Apportez vos jeux !',
      startDate: addDays(14).toISOString(),
      endDate: addHours(addDays(14), 4).toISOString(),
      location: 'Bar Le Dernier Round, 75011 Paris',
      visibility: 'public',
      settings: { shoppingListEnabled: true, carpoolingEnabled: true, ticketingEnabled: true },
    }, token('charlie@example.com'));

    const event3 = await request('POST', '/events', {
      name: 'Concert jazz en plein air',
      description: 'Concert gratuit. Couverture recommandée en cas de pluie.',
      startDate: addDays(10).toISOString(),
      endDate: addHours(addDays(10), 3).toISOString(),
      location: 'Jardin du Luxembourg, Paris',
      visibility: 'public',
      settings: { shoppingListEnabled: false, carpoolingEnabled: true, ticketingEnabled: false },
    }, token('bob@example.com'));

    const event4 = await request('POST', '/events/groups/' + id(group3), {
      name: 'Afterwork vendredi',
      description: 'Apéro après le boulot. Premier verre offert.',
      startDate: addDays(3).toISOString(),
      endDate: addHours(addDays(3), 3).toISOString(),
      location: 'Le Sucre, Lyon',
      visibility: 'public',
      settings: { shoppingListEnabled: false, carpoolingEnabled: false, ticketingEnabled: true },
    }, token('eve@example.com'));

    const event5 = await request('POST', '/events', {
      name: 'Réunion projet API',
      description: 'Point d\'avancement et démo. Équipe uniquement.',
      startDate: addDays(2).toISOString(),
      endDate: addHours(addDays(2), 2).toISOString(),
      location: 'Salle 3.2, bâtiment A',
      visibility: 'private',
      settings: { shoppingListEnabled: false, carpoolingEnabled: true, ticketingEnabled: false },
    }, token('alice@example.com'));

    const event6 = await request('POST', '/events/groups/' + id(group5), {
      name: 'Week-end festival 2025',
      description: 'Voyage groupe au festival. Hébergement et billets à prévoir.',
      startDate: addDays(60).toISOString(),
      endDate: addDays(62).toISOString(),
      location: 'Eurockéennes, Belfort',
      visibility: 'private',
      settings: { shoppingListEnabled: true, carpoolingEnabled: true, ticketingEnabled: true },
    }, token('frank@example.com'));

    // Participants : chaque événement reçoit des participants ajoutés par son organisateur (créateur)
    await request('POST', `/events/${id(event1)}/participants`, { userId: userId('bob@example.com'), role: 'participant' }, token('alice@example.com'));
    await request('POST', `/events/${id(event1)}/participants`, { userId: userId('charlie@example.com'), role: 'participant' }, token('alice@example.com'));
    await request('POST', `/events/${id(event1)}/participants`, { userId: userId('diana@example.com'), role: 'organizer' }, token('alice@example.com'));
    await request('POST', `/events/${id(event1)}/participants`, { userId: userId('eve@example.com'), role: 'participant' }, token('alice@example.com'));

    await request('POST', `/events/${id(event2)}/participants`, { userId: userId('bob@example.com'), role: 'participant' }, token('charlie@example.com'));
    await request('POST', `/events/${id(event2)}/participants`, { userId: userId('diana@example.com'), role: 'participant' }, token('charlie@example.com'));
    await request('POST', `/events/${id(event2)}/participants`, { userId: userId('eve@example.com'), role: 'participant' }, token('charlie@example.com'));

    await request('POST', `/events/${id(event3)}/participants`, { userId: userId('alice@example.com'), role: 'participant' }, token('bob@example.com'));
    await request('POST', `/events/${id(event3)}/participants`, { userId: userId('charlie@example.com'), role: 'participant' }, token('bob@example.com'));

    await request('POST', `/events/${id(event4)}/participants`, { userId: userId('frank@example.com'), role: 'participant' }, token('eve@example.com'));
    await request('POST', `/events/${id(event4)}/participants`, { userId: userId('grace@example.com'), role: 'participant' }, token('eve@example.com'));
    await request('POST', `/events/${id(event4)}/participants`, { userId: userId('henry@example.com'), role: 'participant' }, token('eve@example.com'));

    await request('POST', `/events/${id(event5)}/participants`, { userId: userId('bob@example.com'), role: 'participant' }, token('alice@example.com'));
    await request('POST', `/events/${id(event5)}/participants`, { userId: userId('charlie@example.com'), role: 'organizer' }, token('alice@example.com'));

    await request('POST', `/events/${id(event6)}/participants`, { userId: userId('grace@example.com'), role: 'organizer' }, token('frank@example.com'));
    await request('POST', `/events/${id(event6)}/participants`, { userId: userId('henry@example.com'), role: 'participant' }, token('frank@example.com'));
    await request('POST', `/events/${id(event6)}/participants`, { userId: userId('alice@example.com'), role: 'participant' }, token('frank@example.com'));
    console.log('   → 6 événements créés, participants ajoutés.');

    // ——— 5. Fils de discussion et messages (nombreux) ———
    // Seuls les participants de l'événement peuvent poster dans ses threads.
    console.log('5. Fils de discussion et messages…');
    const eventThreadsData = [
      { event: event1, tokenUser: 'alice@example.com', participants: ['alice@example.com', 'bob@example.com', 'charlie@example.com', 'diana@example.com', 'eve@example.com'], threads: [
        { title: 'Organisation', messages: ['Qui amène les charbons ?', 'Moi je peux prendre la viande.', 'J\'amène les salades.', 'Parfait !'] },
        { title: 'Covoiturage', messages: ['Qui part de Paris ?', 'Moi depuis Gare du Nord.', 'Je peux prendre 2 personnes.', 'Super merci !'] },
      ]},
      { event: event2, tokenUser: 'charlie@example.com', participants: ['charlie@example.com', 'bob@example.com', 'diana@example.com', 'eve@example.com'], threads: [
        { title: 'Menu soirée jeux', messages: ['Pizza ou tacos ?', 'Pizza !', 'Tacos pour moi', 'On commande les deux'] },
      ]},
      { event: event3, tokenUser: 'bob@example.com', participants: ['bob@example.com', 'alice@example.com', 'charlie@example.com'], threads: [
        { title: 'Concert jazz', messages: ['RDV à 18h devant l\'entrée.', 'OK'] },
      ]},
      { event: event5, tokenUser: 'alice@example.com', participants: ['alice@example.com', 'bob@example.com', 'charlie@example.com'], threads: [
        { title: 'Rappel', messages: ['N\'oubliez pas vos maillots pour la piscine.', 'C\'est noté.'] },
      ]},
      { event: event6, tokenUser: 'frank@example.com', participants: ['frank@example.com', 'grace@example.com', 'henry@example.com', 'alice@example.com'], threads: [
        { title: 'Logistique festival', messages: ['Départ prévu à 8h.', 'OK je suis prêt.', 'On fait des pauses ?'] },
      ]},
    ];
    for (const { event, tokenUser, participants, threads } of eventThreadsData) {
      const eid = id(event);
      for (const { title, messages } of threads) {
        const thread = await request('POST', `/events/${eid}/threads`, { title }, token(tokenUser));
        for (let j = 0; j < messages.length; j++) {
          const author = participants[j % participants.length];
          await request('POST', `/threads/${id(thread)}/messages`, { content: messages[j] }, token(author));
        }
      }
    }
    // Threads de groupe
    const gt1 = await request('POST', `/groups/${id(group1)}/threads`, { title: 'Prochaine sortie' }, token('charlie@example.com'));
    await request('POST', `/threads/${id(gt1)}/messages`, { content: 'On fait quoi la prochaine fois ?' }, token('charlie@example.com'));
    await request('POST', `/threads/${id(gt1)}/messages`, { content: 'Bowling ?' }, token('bob@example.com'));
    await request('POST', `/threads/${id(gt1)}/messages`, { content: 'Ou escape game', }, token('diana@example.com'));
    const gt2 = await request('POST', `/groups/${id(group3)}/threads`, { title: 'Idées afterwork' }, token('eve@example.com'));
    await request('POST', `/threads/${id(gt2)}/messages`, { content: 'Prochain lieu ?' }, token('eve@example.com'));
    await request('POST', `/threads/${id(gt2)}/messages`, { content: 'Le rooftop ?' }, token('frank@example.com'));
    const gt3 = await request('POST', `/groups/${id(group5)}/threads`, { title: 'Festival 2025' }, token('frank@example.com'));
    await request('POST', `/threads/${id(gt3)}/messages`, { content: 'Qui réserve l\'hébergement ?' }, token('frank@example.com'));
    console.log('   → Nombreux threads et messages créés.');

    // ——— 6. Albums, photos, commentaires (plusieurs par événement) ———
    console.log('6. Albums et photos…');
    const photoUrls = [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    ];
    const albumsToCreate = [
      { event: event1, name: 'Photos du dernier BBQ', desc: 'Souvenirs du parc.', count: 3, tokenUser: 'alice@example.com', participants: ['alice@example.com', 'bob@example.com', 'charlie@example.com', 'diana@example.com', 'eve@example.com'] },
      { event: event1, name: 'Ambiance', desc: 'Quelques shots.', count: 2, tokenUser: 'bob@example.com', participants: ['alice@example.com', 'bob@example.com', 'charlie@example.com', 'diana@example.com', 'eve@example.com'] },
      { event: event2, name: 'Soirée jeux', desc: 'Photos de la soirée.', count: 2, tokenUser: 'charlie@example.com', participants: ['charlie@example.com', 'bob@example.com', 'diana@example.com', 'eve@example.com'] },
      { event: event3, name: 'Concert jazz', desc: 'Plein air.', count: 2, tokenUser: 'bob@example.com', participants: ['bob@example.com', 'alice@example.com', 'charlie@example.com'] },
    ];
    const commentTexts = ['Super moment !', 'Merci à tous', 'Trop bien', 'La prochaine je suis là', 'Magnifique'];
    for (const { event, name, desc, count, tokenUser, participants } of albumsToCreate) {
      const album = await request('POST', `/events/${id(event)}/albums`, { name, description: desc }, token(tokenUser));
      let firstPhotoId = null;
      for (let i = 0; i < count; i++) {
        const photo = await request('POST', `/albums/${id(album)}/photos`, {
          url: photoUrls[i % photoUrls.length],
          caption: i === 0 ? 'Première photo' : `Photo ${i + 1}`,
        }, token(tokenUser));
        if (!firstPhotoId) firstPhotoId = id(photo);
      }
      if (firstPhotoId) {
        for (let c = 0; c < 3; c++) {
          const author = participants[c % participants.length];
          await request('POST', `/photos/${firstPhotoId}/comments`, { content: commentTexts[c % commentTexts.length] }, token(author));
        }
      }
    }
    console.log('   → Plusieurs albums, photos et commentaires créés.');

    // ——— 7. Sondages (plusieurs par événement, plusieurs questions/options, votes) ———
    console.log('7. Sondages…');
    const pollConfigs = [
      { event: event1, title: 'Date du prochain BBQ', questions: [{ text: 'Quel jour vous arrange ?', options: ['Samedi', 'Dimanche', 'Les deux'] }], tokenUser: 'alice@example.com', voters: ['bob@example.com', 'charlie@example.com', 'diana@example.com', 'eve@example.com'] },
      { event: event1, title: 'Menu préféré', questions: [{ text: 'Viande ou poisson ?', options: ['Viande', 'Poisson', 'Végé'] }], tokenUser: 'alice@example.com', voters: ['bob@example.com', 'charlie@example.com', 'diana@example.com'] },
      { event: event2, title: 'Jeux à prévoir', questions: [{ text: 'Quel type de jeux ?', options: ['Stratégie', 'Ambiance', 'Party'] }, { text: 'Durée ?', options: ['Court', 'Long'] }], tokenUser: 'charlie@example.com', voters: ['bob@example.com', 'diana@example.com', 'eve@example.com'] },
      { event: event4, title: 'Lieu afterwork', questions: [{ text: 'Où pour le prochain ?', options: ['Rooftop', 'Terrasse', 'Bar'] }], tokenUser: 'eve@example.com', voters: ['frank@example.com', 'grace@example.com', 'henry@example.com'] },
      { event: event6, title: 'Transport festival', questions: [{ text: 'Comment on y va ?', options: ['Voiture', 'Train', 'Covoit'] }], tokenUser: 'frank@example.com', voters: ['grace@example.com', 'henry@example.com', 'alice@example.com'] },
    ];
    for (const { event, title, questions, tokenUser, voters } of pollConfigs) {
      const poll = await request('POST', `/events/${id(event)}/polls`, { title }, token(tokenUser));
      for (let qi = 0; qi < questions.length; qi++) {
        const q = questions[qi];
        const qDoc = await request('POST', `/polls/${id(poll)}/questions`, { text: q.text, order: qi }, token(tokenUser));
        let optIds = [];
        for (let oi = 0; oi < q.options.length; oi++) {
          const opt = await request('POST', `/questions/${id(qDoc)}/options`, { text: q.options[oi], order: oi }, token(tokenUser));
          optIds.push(id(opt));
        }
        for (let v = 0; v < Math.min(3, voters.length); v++) {
          await request('POST', `/questions/${id(qDoc)}/votes`, { optionId: optIds[v % optIds.length] }, token(voters[v]));
        }
      }
    }
    console.log('   → Plusieurs sondages, questions, options et votes créés.');

    // ——— 8. Billetterie (plusieurs types et achats) ———
    console.log('8. Billetterie…');
    const eventsWithTicketing = [event2, event4, event6];
    const ticketTypesConfig = [
      { event: event2, types: [{ name: 'Entrée soirée', price: 5, qty: 20 }, { name: 'Place assise', price: 10, qty: 10 }], tokenUser: 'charlie@example.com' },
      { event: event4, types: [{ name: 'Apéro', price: 0, qty: 30 }, { name: 'Consos 2h', price: 15, qty: 20 }], tokenUser: 'eve@example.com' },
      { event: event6, types: [{ name: 'Pass 2 jours', price: 80, qty: 15 }, { name: 'Pass 1 jour', price: 45, qty: 20 }], tokenUser: 'frank@example.com' },
    ];
    const purchases = [
      { event: event2, buyer: 'diana@example.com', typeIndex: 0 },
      { event: event2, buyer: 'bob@example.com', typeIndex: 0 },
      { event: event2, buyer: 'eve@example.com', typeIndex: 1 },
      { event: event4, buyer: 'frank@example.com', typeIndex: 0 },
      { event: event4, buyer: 'grace@example.com', typeIndex: 1 },
      { event: event4, buyer: 'henry@example.com', typeIndex: 1 },
      { event: event6, buyer: 'grace@example.com', typeIndex: 0 },
      { event: event6, buyer: 'henry@example.com', typeIndex: 0 },
      { event: event6, buyer: 'alice@example.com', typeIndex: 1 },
    ];
    const ticketTypesByEvent = {};
    for (const { event, types, tokenUser } of ticketTypesConfig) {
      const eid = id(event);
      ticketTypesByEvent[eid] = [];
      for (const t of types) {
        const tt = await request('POST', `/events/${eid}/ticket-types`, {
          name: t.name,
          price: t.price,
          currency: 'EUR',
          quantity: t.qty,
        }, token(tokenUser));
        ticketTypesByEvent[eid].push(tt);
      }
    }
    const address = { street: '12 rue Example', city: 'Paris', zip: '75001', country: 'France' };
    for (const { event, buyer, typeIndex } of purchases) {
      const eid = id(event);
      const u = users.find((x) => x.email === buyer);
      const tt = ticketTypesByEvent[eid][typeIndex];
      if (tt && u) {
        await request('POST', `/events/${eid}/tickets/purchase`, {
          ticketTypeId: id(tt),
          buyerEmail: u.email,
          buyerFirstName: u.firstName,
          buyerLastName: u.lastName,
          buyerAddress: address,
        }, token(buyer));
      }
    }
    console.log('   → Plusieurs types de billets et achats créés.');

    // ——— 9. Liste de courses (nombreux items) ———
    console.log('9. Liste de courses…');
    const shoppingEvents = [event1, event2, event6];
    const items = [
      { event: event1, tokenUser: 'alice@example.com', items: [{ name: 'Charbons', qty: 2 }, { name: 'Pain', qty: 3 }, { name: 'Saucisses', qty: 4 }, { name: 'Boissons', qty: 6 }, { name: 'Salade', qty: 2 }] },
      { event: event2, tokenUser: 'charlie@example.com', items: [{ name: 'Chips', qty: 2 }, { name: 'Bière', qty: 6 }, { name: 'Pizza', qty: 2 }] },
      { event: event6, tokenUser: 'frank@example.com', items: [{ name: 'Tente', qty: 1 }, { name: 'Glacière', qty: 2 }, { name: 'Eau', qty: 12 }] },
    ];
    const eventStarts = { [id(event1)]: addDays(7), [id(event2)]: addDays(14), [id(event6)]: addDays(60) };
    for (const { event, tokenUser, items: list } of items) {
      const eid = id(event);
      const start = eventStarts[eid] || addDays(7);
      for (const it of list) {
        await request('POST', `/events/${eid}/shopping-items`, {
          name: it.name,
          quantity: it.qty,
          arrivalTime: start.toISOString(),
        }, token(tokenUser));
      }
    }
    console.log('   → Nombreux items de liste de courses créés.');

    // ——— 10. Covoiturage (plusieurs trajets et réservations) ———
    console.log('10. Covoiturage…');
    const rideConfigs = [
      { event: event1, place: 'Gare du Nord, Paris', time: addDays(7), seats: 3, tokenUser: 'alice@example.com', passengers: ['bob@example.com', 'charlie@example.com'] },
      { event: event1, place: 'Place de la République', time: addDays(7), seats: 2, tokenUser: 'diana@example.com', passengers: ['eve@example.com'] },
      { event: event3, place: 'Métro Odéon', time: addDays(10), seats: 4, tokenUser: 'bob@example.com', passengers: ['alice@example.com', 'charlie@example.com'] },
      { event: event5, place: 'Parking bâtiment A', time: addDays(2), seats: 3, tokenUser: 'alice@example.com', passengers: ['bob@example.com'] },
      { event: event6, place: 'Lyon Part-Dieu', time: addDays(60), seats: 4, tokenUser: 'frank@example.com', passengers: ['grace@example.com', 'henry@example.com', 'alice@example.com'] },
    ];
    for (const { event, place, time, seats, tokenUser, passengers } of rideConfigs) {
      const ride = await request('POST', `/events/${id(event)}/rides`, {
        departurePlace: place,
        departureTime: time.toISOString(),
        price: 0,
        currency: 'EUR',
        seatsAvailable: seats,
        maxDetourMinutes: 15,
      }, token(tokenUser));
      for (const email of passengers) {
        await request('POST', `/rides/${id(ride)}/bookings`, null, token(email));
      }
    }
    console.log('   → Plusieurs trajets et réservations créés.');

    console.log('');
    console.log('✅ Seed terminé avec succès.');
    console.log('');
    console.log('Récapitulatif : 8 users, 5 groupes, 6 événements, nombreux threads/messages,');
    console.log('albums/photos/commentaires, sondages, types de billets & achats,');
    console.log('liste de courses, covoiturage.');
    console.log('');
    console.log('Comptes (mot de passe pour tous : Password123!) :');
    userData.forEach(([email, firstName]) => console.log(`  - ${email} (${firstName})`));
    console.log('');
    console.log('Connexion : POST /api/auth/login avec email + password.');
  } catch (err) {
    console.error('Erreur seed:', err.message);
    process.exitCode = 1;
  }
}

main();
