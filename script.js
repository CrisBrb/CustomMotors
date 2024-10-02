const csvUrl = 'https://docs.google.com/spreadsheets/d/1M19pAtJYNnDCaKxhO5XjWIlxqT7p2zvk6FHqKYVBJ1g/export?format=csv&gid=869807012';

async function getCsvData() {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    return csvText;
}

function parseCsv(csvText) {
    const lines = csvText.split('\n');
    return lines.map(line => line.split(','));
}

function extractRelevantData(parsedData) {
    const relevantData = [];
    for (let i = 3; i <= 31; i++) {
        const row = parsedData[i];
        relevantData.push({
            grade: row[1],
            matricule: row[3],
            nom: row[4],
            nombreFacture: row[8],
            caTotal: row[9],
            craft: row[14],
            noteDeFrais: row[15],
            salaire: row[18],
            resteAPayer: row[19],
            totalSalaire: row[17]
        });
    }
    return relevantData;
}

function searchByMatricule(matricule, data) {
    return data.find(person => person.matricule === matricule);
}

// Fonction pour afficher uniquement le nom dans la barre de nom lors d'une recherche
function namebar(person) {
    return `<p class="self-name">${person.nom}</p>`;
}

// Fonction pour afficher les informations d'une seule personne
function displayPersonInfo(person) {
    return `
        <div class="person-info">
            <div class="person-id">
                <p class="self-grade">Grade: ${person.grade}</p>
                <p class="self-mat">Matricule: ${person.matricule}</p>
            </div>
            <div class="person-salary">
                <p class="self-salary">Salaire: ${person.salaire}</p>
                <p class="self-total-ca">CA: ${person.caTotal}</p>
                <p class="self-bills">Factures: ${person.nombreFacture}</p>
                <p class="self-amount-crafted">Craft: ${person.craft}</p>
                <p class="self-expense-report">Notes de frais: ${person.noteDeFrais}</p>
                <p class="self-remains-to-pay">Reste à payer: ${person.resteAPayer}</p>
            </div>
        </div>
    `;
}

// Fonction pour afficher les informations de tout le monde (sans mettre à jour la barre de nom)
function displayAllPersonInfo(person) {
    return `
        <div class="all-person-info">
            <div class="all-person-id">
                <p class="all-grade">Grade: ${person.grade}</p>
                <p class="all-name">${person.nom}</p>
                <p class="all-mat">Matricule: ${person.matricule}</p>
            </div>
            <div class="all-person-salary">
                <p class="all-salary">Salaire: ${person.salaire}</p>
                <p class="all-total-ca">CA: ${person.caTotal}</p>
                <p class="all-bills">Factures: ${person.nombreFacture}</p>
                <p class="all-amount-crafted">Craft: ${person.craft}</p>
                <p class="all-expense-report">Notes de frais: ${person.noteDeFrais}</p>
                <p class="all-remains-to-pay">Reste à payer: ${person.resteAPayer}</p>
            </div>
        </div>
    `;
}

// Fonction pour afficher tous les matricules (sans affecter la barre de nom)
function displayAllMatricules(relevantData) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';  // Vider le div avant d'afficher les résultats
    relevantData.forEach(person => {
        resultDiv.innerHTML += displayAllPersonInfo(person);
    });
}

// Fonction pour rechercher par matricule ou afficher tous si aucun matricule n'est saisi
async function handleSearch() {
    const matricule = document.getElementById('matriculeInput').value.trim();
    const csvText = await getCsvData();
    const parsedData = parseCsv(csvText);
    const relevantData = extractRelevantData(parsedData);
    const resultDiv = document.getElementById('result');
    const nameBarDiv = document.querySelector('.name-bar');

    if (matricule) {
        // Rechercher un matricule spécifique
        const person = searchByMatricule(matricule, relevantData);
        if (person) {
            resultDiv.innerHTML = displayPersonInfo(person);
            nameBarDiv.innerHTML = namebar(person);  // Afficher juste le nom dans la barre de nom
        } else {
            resultDiv.innerHTML = `<p>Aucune personne trouvée pour ce matricule</p>`;
            nameBarDiv.innerHTML = ''; // Vider la barre de noms si aucun résultat n'est trouvé
        }
    } else {
        // Si aucun matricule n'est fourni, afficher tous les résultats (sans affecter la barre de nom)
        displayAllMatricules(relevantData);
        nameBarDiv.innerHTML = '';  // Vider la barre de nom si on affiche tous les matricules
    }
}

// Ajouter un événement pour le clic sur le bouton "Rechercher"
document.getElementById('searchButton').addEventListener('click', handleSearch);

// Ajouter un événement pour la pression de la touche Enter dans le champ de saisie
document.getElementById('matriculeInput').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();  // Empêche le comportement par défaut
        handleSearch();  // Appeler la fonction de recherche
    }
});

// Charger les données et afficher tous les matricules par défaut au chargement de la page
window.addEventListener('load', async () => {
    const csvText = await getCsvData();
    const parsedData = parseCsv(csvText);
    const relevantData = extractRelevantData(parsedData);
    displayAllMatricules(relevantData);  // Affiche tous les résultats par défaut sans affecter la barre de nom
});