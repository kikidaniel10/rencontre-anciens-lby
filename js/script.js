const inscrits = [];
const ADMIN_PASSWORD = "lby2026";

const form = document.getElementById('formInscription');
const nom = document.getElementById('nom');
const sexe = document.getElementById('sexe');
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

function afficherMessage(texte, type) {
    msg.innerHTML = `<div class="message-${type}">${texte}</div>`;
    setTimeout(() => { msg.innerHTML = ''; }, 4000);
}

function mettreAJourListe() {
    if (inscrits.length === 0) {
        liste.innerHTML = '<span class="empty-message">◈ Aucun inscrit pour l\'instant ◈</span>';
        compteur.textContent = '0 inscrits';
        return;
    }
    liste.innerHTML = inscrits.map((p, i) => 
        `<span class="tag-dossard">#${p.dossard} · ${p.nom} ${p.sexe === 'Homme' ? '🧑' : '👩'}</span>`
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

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = nom.value.trim();
    const s = sexe.value;
    const d = dossard.value.trim();

    if (!n || !s || !d) {
        afficherMessage('◈ Tous les champs sont obligatoires ◈', 'erreur');
        return;
    }

    if (s === 'Homme' && inscrits.some(p => p.dossard === d && p.sexe === 'Homme')) {
        afficherMessage(`◈ Dossard #${d} déjà pris par un homme ◈`, 'erreur');
        return;
    }

    inscrits.push({ nom: n, sexe: s, dossard: d });
    afficherMessage(`✦ ${n} inscrit avec le dossard #${d} ✦`, 'succes');
    nom.value = '';
    sexe.value = '';
    dossard.value = '';
    nom.focus();
    mettreAJourListe();
});

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
    inscrits.splice(idx, 1);
    afficherMessage(`✦ ${supprime.nom} supprimé ✦`, 'succes');
    mettreAJourListe();
});

mettreAJourListe();
console.log('✦ Système GALAXIE initialisé ✦');