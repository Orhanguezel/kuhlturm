document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    fetch('submit_form.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Nachricht erfolgreich gesendet!');
        } else {
            alert('Fehler beim Senden der Nachricht: ' + data.error);
        }
    })
    .catch(error => console.error('Fehler:', error));
});
