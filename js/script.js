// Konstanten für Preise
const PRICES = {
    WEEK_SUMMER: 450,
    WEEK_WINTER: 650,
    DAY_SUMMER: 70,
    DAY_WINTER: 100,
    PERSON_FEE: 7.5,
    TAX_TEENS: 2.8,
    TAX_ADULTS: 5.9,
    SAUNA: 15
};

// Modal mit dynamischen Preisinformationen befüllen
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').setAttribute('min', today);

    const priceInfoContent = document.getElementById('priceInfoContent');
    priceInfoContent.innerHTML = `
        <ul>
            <li><strong>Grundgebühr Woche:</strong>
                <ul>
                    <li>${PRICES.WEEK_SUMMER} CHF Sommer</li>
                    <li>${PRICES.WEEK_WINTER} CHF Winter</li>
                </ul>
            </li>
            <li><strong>Grundgebühr Tag</strong><br>mehr oder weniger als eine ganzen Woche:
                <ul>
                    <li>${PRICES.DAY_SUMMER} CHF Sommer</li>
                    <li>${PRICES.DAY_WINTER} CHF Winter</li>
                </ul>
            </li>
            <li><strong>Personengebühren:</strong>
                <ul>
                    <li>${PRICES.PERSON_FEE.toFixed(2)} CHF pro Tag und Person (ab 6 Jahren)</li>
                </ul>
            </li>
            <li><strong>Kurtaxe:</strong>
                <ul>
                    <li>${PRICES.TAX_TEENS.toFixed(2)} CHF pro Tag (Kinder 6-15 Jahre)</li>
                    <li>${PRICES.TAX_ADULTS.toFixed(2)} CHF pro Tag (Erwachsene ab 16 Jahren)</li>
                </ul>
            </li>
            <li><strong>Sauna:</strong>
                <ul>
                    <li>${PRICES.SAUNA} CHF pro Saunagang</li>
                </ul>
            </li>
        </ul>
    `;
});

// endDate > startDate
document.getElementById('startDate').addEventListener('change', function(){
    const startDate = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate');

    if (startDate) {
        endDateInput.min = startDate;
    }
});

// display SliderValue
function updateSliderValue(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    valueDisplay.textContent = slider.value;
}

// calculateCost
document.getElementById('calculateCosts').addEventListener('click', function(){
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const numAdults = parseInt(document.getElementById('numAdults').value) || 0;
    const numTeens = parseInt(document.getElementById('numTeens').value) || 0;
    const numChildren = parseInt(document.getElementById('numChildren').value) || 0;
    const numSauna = parseInt(document.getElementById('numSauna').value) || 0;

    // endDate or startDate missing
    if (isNaN(startDate) || isNaN(endDate)) {
        alert('Bitte geben Sie ein gültiges Start- und Enddatum ein.');
        return;
    }

    // endDate < startdate
    if (endDate <= startDate) {
        alert('Das Enddatum muss größer als das Startdatum sein.');
        return;
    }

    // no Adult
    if (!numAdults) {
        alert('Mindestens eine erwachsene Person muss das Chalet mieten!');
        return;
    }

    // total Person >= 8
    if ((numAdults + numTeens + numChildren) >= 8) {
        alert('Wir haben Betten für maximal 8 Peronen, 6 Personen sind ideal!');
        return;
    }

    const dayInMillis = 24 * 60 * 60 * 1000;
    const totalDays = Math.ceil((endDate - startDate) / dayInMillis);

    const startMonth = startDate.getMonth() + 1; // Januar ist 0
    const isWinter = startMonth >= 10 || startMonth <= 4;
    const weekRate = isWinter ? PRICES.WEEK_WINTER : PRICES.WEEK_SUMMER;
    const dayRate = isWinter ? PRICES.DAY_WINTER : PRICES.DAY_SUMMER;

    const fullWeeks = Math.floor(totalDays / 7);
    const extraDays = totalDays % 7;
    const baseCost = fullWeeks * weekRate + extraDays * dayRate;

    const personCost = (numAdults + numTeens) * PRICES.PERSON_FEE * totalDays;
    const taxCost = (numTeens * PRICES.TAX_TEENS + numAdults * PRICES.TAX_ADULTS) * totalDays;

    const saunaCost = numSauna * PRICES.SAUNA;

    const totalCost = baseCost + personCost + taxCost + saunaCost;

    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = `
    <table class="table table-responsive table-striped">
        <tr>
            <th scope="row">Grundgebühr:</th>
            <td class="text-end">${baseCost.toFixed(2)} CHF</td>
        </tr>
        <tr>
            <th scope="row">Personengebühr:</th>
            <td class="text-end">${personCost.toFixed(2)} CHF</td>
        </tr>
        <tr>
            <th scope="row">Kurtaxe:</th>
            <td class="text-end">${taxCost.toFixed(2)} CHF</td>
        </tr>
        <tr>
            <th scope="row">Sauna:</th>
            <td class="text-end">${saunaCost.toFixed(2)} CHF</td>
        </tr>
        <tr>
            <th scope="row">Gesamtkosten:</th>
            <td class="text-end"><strong>${totalCost.toFixed(2)} CHF</strong></td>
        </tr>
    </table>
    `;

    const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
    resultsModal.show();
});