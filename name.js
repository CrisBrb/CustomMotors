// Fonction pour afficher les informations d'une seule personne
function displayPersonInfo(person) {
    return `
        <div class="header-name">
            <p class="self-name">Nom: ${person.nom}</p>
        </div>
    `;
}


// Fonction pour rechercher par matricule ou afficher tous si aucun matricule n'est saisi
async function handleSearch() {
    const matricule = document.getElementById('matriculeInput').value.trim();
    const csvText = await getCsvData();
    const parsedData = parseCsv(csvText);
    const relevantData = extractRelevantData(parsedData);
    const nameDiv = document.getElementById('name');

    if (matricule) {
        // Rechercher un matricule spécifique
        const person = searchByMatricule(matricule, relevantData);
        if (person) {
            nameDiv.innerHTML = displayPersonInfo(person);
        } else {
            nameDiv.innerHTML = `<p>Aucune personne trouvée pour ce matricule</p>`;
        }
    } else {
        // Si aucun matricule n'est fourni, afficher tous les résultats
        displayAllMatricules(relevantData);
    }
}











