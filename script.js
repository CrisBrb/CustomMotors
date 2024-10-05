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
    for (let i = 3; i <= 35; i++) {
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
    return `<p class="self-name">${person.nom}  <i class="fa-solid fa-user"></i> </p>`;
}

// Fonction pour afficher les informations d'une seule personne
// Fonction pour afficher les informations d'une seule personne avec les cartes et positionnement souhaités
function displayPersonInfo(person) {
    return `
        <div class="person-info">
            <div class="person-info-container">
                <!-- Div contenant l'identifiant et la section des salaires -->
                <div class="person-id-self-money-container">
                    <div class="person-id card">
                        <div>
                            <p class="self-mat">Matricule: ${person.matricule}</p>
                        </div>
                        <div>
                            <p class="self-grade">Grade: ${person.grade}</p>
                        </div>
                    </div>
                    <div class="self-money card">
                        <div class="self-salary">
                            <div class="=self-money-icon-container"><i class="fa-regular fa-money-bill-1"></i></div>
                            <div class="self-money-info-container">
                                <p class="amount-p">${person.salaire}</p>
                                <p>Salaire</p>
                            </div>
                        </div>
                        <div class="self-remains-to-pay">
                            <div class="self-remains-icon-container"><i class="fa-solid fa-comment-dollar"></i></div>
                            <div class="self-remains-info-container">
                                <p class="amount-p">${person.resteAPayer}</p>
                                <p>Reste à payer</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Div contenant CA, Factures, Craft et Notes de frais sous les identifiants et les salaires -->
                <div class="person-salary">
                    <div class="self-total-ca card">
                        <div class="self-ca-icon-container"><i class="fa-solid fa-cash-register"></i></div>
                        <div class="self-ca-info-container">
                            <p class="amount-p">${person.caTotal}</p>
                            <p>Chiffre d'affaire</p>
                        </div>
                    </div>
                    <div class="self-bills card">
                        <div class="self-bills-icon-container"><i class="fa-solid fa-receipt"></i></div>
                        <div class="self-bills-info-container">
                            <p class="amount-p">${person.nombreFacture}</p>
                            <p>Factures</p>
                        </div>
                    </div>
                    <div class="self-amount-crafted card">
                        <div class="self-craft-icon-container"><i class="fa-solid fa-screwdriver-wrench"></i></div>
                        <div class="self-craft-info-container">
                            <p class="amount-p">${person.craft}</p>
                            <p>Craft</p>
                        </div>
                    </div>
                    <div class="self-expense-report card">
                        <div class="self-expense-icon-container"><i class="fa-solid fa-file-invoice-dollar"></i></div>
                        <div class="self-expense-info-container">
                            <p class="amount-p">${person.noteDeFrais}</p>
                            <p>Notes de frais</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fonction pour afficher les informations de tout le monde (sans mettre à jour la barre de nom)
function displayAllPersonInfo(person) {
    return `
        <div class="all-person-info">
            <div class="all-person-id">
                <div class="all-grade">
                    <p>Grade: ${person.grade}</p>
                </div>
                <div class="all-name">
                    <p>${person.nom}</p>
                </div>
                <div class="all-mat">
                    <p>Matricule: ${person.matricule}</p>
                </div>
            </div>
            <div class="all-person-salary">
                <div class="all-salary">
                    <p>Salaire: ${person.salaire}</p>
                </div>
                <div class="all-total-ca">
                    <p><i class="fa-solid fa-cash-register"></i> CA: ${person.caTotal}</p>
                </div>
                <div class="all-bills">
                    <p><i class="fa-solid fa-receipt"></i> Factures: ${person.nombreFacture}</p>
                </div>
                <div class="all-amount-crafted">
                    <p><i class="fa-solid fa-screwdriver-wrench"></i> Craft: ${person.craft}</p>
                </div>
                <div class="all-expense-report">
                    <p><i class="fa-solid fa-file-invoice-dollar"></i> Notes de frais: ${person.noteDeFrais}</p>
                </div>
                <div class="all-remains-to-pay">
                    <p><i class="fa-solid fa-comment-dollar"></i> Reste à payer: ${person.resteAPayer}</p>
                </div>
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