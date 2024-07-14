document.getElementById('train-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const stationCode = document.getElementById('station').value;
    await getTrainInfo(stationCode);

    setTimeout(() => {
        document.getElementById('booking-container').style.display = 'block';
    }, 2000);
});

document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const fromStation = document.getElementById('from-station').value;
    const toStation = document.getElementById('to-station').value;
    const numTickets = document.getElementById('num-tickets').value;
    
    const qrData = `From: ${fromStation}, To: ${toStation}, Tickets: ${numTickets}`;
    generateQRCode(qrData);

    document.getElementById('qr-container').style.display = 'block';
});

async function getTrainInfo(stationCode) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '57ad6e04a9msh9ab2b89dad848adp18a581jsn21e4cfccd947',
            'X-RapidAPI-Host': 'ukrail.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(`https://ukrail.p.rapidapi.com/GetUKRail?CMD=GetDepartureBoard&CRS=${stationCode}&NumberQueries=10`, options);
        const data = await response.json();
        console.log(data);  // Log the response for debugging
        displayTrainInfo(data);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

function displayTrainInfo(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // Check if the data and train services are available
    if (!data || !data.Results || !data.Results.GetStationBoardResult || !data.Results.GetStationBoardResult.trainServices) {
        resultsDiv.innerHTML = '<p>No train information found.</p>';
        return;
    }

    const trainServices = data.Results.GetStationBoardResult.trainServices.service;
    const trainList = document.createElement('ul');
    trainServices.forEach(train => {
        const trainItem = document.createElement('li');
        trainItem.textContent = `Train to ${train.destination.location[0].locationName}, Platform: ${train.platform}, Departure Time: ${train.std}, Status: ${train.etd}`;
        trainList.appendChild(trainItem);
    });

    resultsDiv.appendChild(trainList);
}

function generateQRCode(data) {
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';
    new QRCode(qrcodeContainer, {
        text: data,
        width: 128,
        height: 128
    });
}
