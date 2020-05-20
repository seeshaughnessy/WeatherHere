let lat, lng;

// First check to see if the device can use geolocation
if ('geolocation' in navigator) {
    console.log('geolocation available')
    navigator.geolocation.getCurrentPosition(async position => {
        // console.log(position)

        try {

        lat = position.coords.latitude.toFixed(2)
        lng = position.coords.longitude.toFixed(2)

        document.getElementById('latitude').textContent = lat
        document.getElementById('longitude').textContent = lng

        // POST request with fetch() > do in client side index.html
        const api_url = `/weather/${lat},${lng}`
        const res = await fetch(api_url)
        const json = await res.json()
        const weather = json.weather
        const air_quality = json.air_quality.results[0].measurements[0]
        console.log(json)

        const tempK = weather.main.temp
        const tempF = (tempK * 9/5 - 459.67).toFixed(0)
        const tempC = (tempK - 273.15).toFixed(0)
        const aq_date = Date(air_quality.lastupdated)

        document.getElementById('summary').textContent = weather.weather[0].description
        document.getElementById('temperature').textContent = tempF

        document.getElementById('aq_parameter').textContent = air_quality.parameter
        document.getElementById('aq_value').textContent = air_quality.value
        document.getElementById('aq_units').textContent = air_quality.unit
        document.getElementById('aq_date').textContent = aq_date

        const data = {lat, lng, weather, air_quality}

        const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        // use fetch to send the data, await res.json() receives the data back from the server
        const db_res = await fetch('/api', options)
        const db_json = await db_res.json()
        console.log(json)
    

        } catch(err) {
            console.log('something went wrong', err)
        }

    })
} else {
    console.log('geolocation NOT available')
}