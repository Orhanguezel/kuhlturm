function openNav(formId) {
    document.getElementById("sidebar").style.width = "400px";
    document.getElementById("form-container").innerHTML = document.getElementById(formId).innerHTML;
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("form-container").innerHTML = "";
}

function sendMail(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);

    fetch('send_mail.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('E-Mail wurde erfolgreich gesendet.');
        } else {
            alert('Fehler beim Senden der E-Mail: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.insertAdjacentHTML('beforeend', `
        <form id="katalogForm" style="display: none;" onsubmit="sendMail('katalogForm'); return false;">
            <h2>Katalog Anfordern</h2>
            <label for="company">Firma *</label>
            <input type="text" id="company" name="company" class="form-control" required>
            <label for="contact">Ansprechpartner *</label>
            <input type="text" id="contact" name="contact" class="form-control" required>
            <label for="position">Position *</label>
            <input type="text" id="position" name="position" class="form-control" required>
            <label for="email">E-Mail *</label>
            <input type="email" id="email" name="email" class="form-control" required>
            <label for="phone">Telefon *</label>
            <input type="text" id="phone" name="phone" class="form-control" required>
            <label for="address">Adresse</label>
            <input type="text" id="address" name="address" class="form-control">
            <button type="submit" class="btn btn-primary">Senden</button>
        </form>
        <form id="partForm" style="display: none;" onsubmit="sendMail('partForm'); return false;">
            <h2>Ersatzteile Anfordern</h2>
            <label for="company">Firma *</label>
            <input type="text" id="company" name="company" class="form-control" required>
            <label for="contact">Ansprechpartner *</label>
            <input type="text" id="contact" name="contact" class="form-control" required>
            <label for="position">Position *</label>
            <input type="text" id="position" name="position" class="form-control" required>
            <label for="email">E-Mail *</label>
            <input type="email" id="email" name="email" class="form-control" required>
            <label for="phone">Telefon *</label>
            <input type="text" id="phone" name="phone" class="form-control" required>
            <label for="address">Adresse</label>
            <input type="text" id="address" name="address" class="form-control">
            <button type="submit" class="btn btn-primary">Senden</button>
        </form>
        <form id="towerForm" style="display: none;" onsubmit="sendMail('towerForm'); return false;">
            <h2>Neuer Turm Anfordern</h2>
            <label for="company">Firma *</label>
            <input type="text" id="company" name="company" class="form-control" required>
            <label for="contact">Ansprechpartner *</label>
            <input type="text" id="contact" name="contact" class="form-control" required>
            <label for="position">Position *</label>
            <input type="text" id="position" name="position" class="form-control" required>
            <label for="email">E-Mail *</label>
            <input type="email" id="email" name="email" class="form-control" required>
            <label for="phone">Telefon *</label>
            <input type="text" id="phone" name="phone" class="form-control" required>
            <label for="address">Adresse</label>
            <input type="text" id="address" name="address" class="form-control">
            <h3>Bitte füllen Sie die folgenden Informationen über den gewünschten Turm aus.</h3>
            <label for="process">Verwendungsprozess des Turms</label>
            <input type="text" id="process" name="process" class="form-control">
            <label for="city">Installationsort (Stadt)</label>
            <input type="text" id="city" name="city" class="form-control">
            <label for="district">Installationsort (Bezirk)</label>
            <input type="text" id="district" name="district" class="form-control">
            <label for="waterFlow">Wasserdurchfluss (m3/h)</label>
            <input type="number" id="waterFlow" name="waterFlow" class="form-control">
            <label for="inletTemp">Eingangstemperatur (°C)</label>
            <input type="number" id="inletTemp" name="inletTemp" class="form-control">
            <label for="outletTemp">Ausgangstemperatur (°C)</label>
            <input type="number" id="outletTemp" name="outletTemp" class="form-control">
            <label for="wetBulbTemp">Feuchtkugeltemperatur (°C)</label>
            <input type="number" id="wetBulbTemp" name="wetBulbTemp" class="form-control">
            <label for="capacity">Kapazität (Kcal/h, kW)</label>
            <input type="number" id="capacity" name="capacity" class="form-control">
            <label for="waterQuality">Wasserqualität</label>
            <input type="text" id="waterQuality" name="waterQuality" class="form-control">
            <label for="pool">Pool (CTP-Pool / Betonkonstruktion)</label>
            <input type="text" id="pool" name="pool" class="form-control">
            <label for="location">Standort des Turms (Stahlrahmen / Betonboden)</label>
            <input type="text" id="location" name="location" class="form-control">
            <label for="existingTower">Vorhandener Turm (Modell/Jahr)</label>
            <input type="text" id="existingTower" name="existingTower" class="form-control">
            <label for="howYouKnow">Wie haben Sie von uns erfahren?</label>
            <input type="text" id="howYouKnow" name="howYouKnow" class="form-control">
            <button type="submit" class="btn btn-primary">Senden</button>
        </form>
    `);
});
