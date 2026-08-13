// ✦ SYSTÈME GALAXIE - Firebase ✦

const ADMIN_PASSWORD = "lby2026";

// 🔥 VOTRE CONFIGURATION FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCLmLjdSU2b07QAPxj0yMUHS_CQ9WWSJDI",
    authDomain: "galaxie-anciens-Lby.firebaseapp.com",
    projectId: "galaxie-anciens-Lby",
    storageBucket: "galaxie-anciens-Lby.firebasestorage.app",
    messagingSenderId: "366912186594",
    appId: "1:366912186594:web:b06b5bd4296c3ddb9a196bb"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Éléments DOM
const form = document.getElementById('formInscription');
const nom = document.getElementById('nom');
const sexe = document.getElementById('sexe');
const taille = document.getElementById('taille');
const dossard = document.getElementById('dossard');
const liste = document.getElementById('listeInscrits');
const compteur = document.getElementById('compteur');
const msg = document.getElementById('messageContainer');
const btnAdmin = document.getElementById('btnAdmin');
const adminPanel = document.getElementById('adminPanel');
const adminPass = document.getElementById('adminPassword');
const btnSuppr = document.getElementById('btnSupprimer');
const selectSuppr = document.getElementById('selectSuppression');

let adminMode = false;
let inscrits = [];

// 📥 CHARGER LES DONNÉES DEPUIS FIREBASE
function chargerInscrits() {
    db.collection('inscrits').orderBy('dossard').get()
        .then((snapshot) => {
            inscrits = [];
            snapshot.forEach((doc) => {
                inscrits.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            mettreAJourListe();
            console.log(`✦ ${inscrits.length} inscrits chargés depuis Firebase ✦`);
        })
        .catch((erreur) => {
            console.error('❌ Erreur chargement:', erreur);
            afficherMessage('◈ Erreur de chargement des données ◈', 'erreur');
        });
}

// 💾 AJOUTER À FIREBASE
function ajouterInscrit(n, s, t, d) {
    db.collection('inscrits').add({
        nom: n,
        sexe: s,
        taille: t,
        dossard: d,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        inscrits.push({ id: docRef.id, nom: n, sexe: s, taille: t, dossard: d });
        mettreAJourListe();
        afficherMessage(`✦ ${n} inscrit avec le dossard "${d}" ✦`, 'succes');
        nom.value = '';
        sexe.value = '';
        taille.value = '';
        dossard.value = '';
        nom.focus();
    })
    .catch((erreur) => {
        console.error('❌ Erreur ajout:', erreur);
        afficherMessage('◈ Erreur lors de l\'inscription ◈', 'erreur');
    });
}

// 🗑️ SUPPRIMER DE FIREBASE
function supprimerInscrit(id, nom) {
    db.collection('inscrits').doc(id).delete()
        .then(() => {
            inscrits = inscrits.filter(p => p.id !== id);
            mettreAJourListe();
            afficherMessage(`✦ ${nom} supprimé ✦`, 'succes');
        })
        .catch((erreur) => {
            console.error('❌ Erreur suppression:', erreur);
            afficherMessage('◈ Erreur lors de la suppression ◈', 'erreur');
        });
}

// AFFICHER MESSAGE
function afficherMessage(texte, type) {
    msg.innerHTML = `<div class="message-${type}">${texte}</div>`;
    setTimeout(() => { msg.innerHTML = ''; }, 4000);
}

// METTRE À JOUR LA LISTE
function mettreAJourListe() {
    if (inscrits.length === 0) {
        liste.innerHTML = '<span class="empty-message">◈ Aucun inscrit pour l\'instant ◈</span>';
        compteur.textContent = '0 inscrits';
        return;
    }
    liste.innerHTML = inscrits.map((p) => 
        `<span class="tag-dossard">#${p.dossard} · ${p.nom} ${p.sexe === 'Homme' ? '🧑' : '👩'} · ${p.taille || 'M'}</span>`
    ).join('');
    compteur.textContent = `${inscrits.length} inscrit${inscrits.length > 1 ? 's' : ''}`;
    mettreAJourSelect();
}

function mettreAJourSelect() {
    selectSuppr.innerHTML = '<option value="">Sélectionner un inscrit</option>';
    inscrits.forEach((p, i) => {
        selectSuppr.innerHTML += `<option value="${i}">#${p.dossard} · ${p.nom}</option>`;
    });
}

// 📝 SOUMISSION FORMULAIRE
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = nom.value.trim();
    const s = sexe.value;
    const t = taille.value;
    const d = dossard.value.trim();

    if (!n || !s || !t || !d) {
        afficherMessage('◈ Tous les champs sont obligatoires ◈', 'erreur');
        return;
    }

    if (s === 'Homme' && inscrits.some(p => p.dossard === d && p.sexe === 'Homme')) {
        afficherMessage(`◈ Dossard "${d}" déjà pris par un homme ◈`, 'erreur');
        return;
    }

    ajouterInscrit(n, s, t, d);
});

// 🔐 ADMIN
btnAdmin.addEventListener('click', () => {
    adminMode = !adminMode;
    adminPanel.style.display = adminMode ? 'block' : 'none';
    btnAdmin.innerHTML = adminMode ? 
        '<i class="fas fa-user-shield"></i> Quitter Admin' : 
        '<i class="fas fa-user-shield"></i> Mode Admin';
    if (adminMode) adminPass.value = '';
});

btnSuppr.addEventListener('click', () => {
    if (!adminMode) return;
    if (adminPass.value !== ADMIN_PASSWORD) {
        afficherMessage('◈ Mot de passe incorrect ◈', 'erreur');
        return;
    }
    const idx = parseInt(selectSuppr.value);
    if (isNaN(idx) || idx < 0 || idx >= inscrits.length) {
        afficherMessage('◈ Sélectionnez un inscrit ◈', 'erreur');
        return;
    }
    const supprime = inscrits[idx];
    supprimerInscrit(supprime.id, supprime.nom);
});

// 🚀 INITIALISATION
chargerInscrits();
console.log('✦ Système GALAXIE avec Firebase initialisé ✦');
