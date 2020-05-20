// SERVER
// Set up express framework
const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')
require('dotenv').config()

console.log(process.env)

const app = express()
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening at ${port}`))

// 1. Serve web pages > Host static files > index.html
app.use(express.static('public'))
    // JSON Parsing (using express)
app.use(express.json({ limit: '1mb' }))

// 3. Save to database (using NeDB)
const database = new Datastore('database.db')
database.loadDatabase()

// 2. Send location data back to server
    
    // Routing
    app.post('/api', (req, res) => {

        // req: holds all the data 
        const data = req.body
        const timestamp = Date.now()
        data.timestamp = timestamp
        database.insert(data)

        //Must complete request ie: res.end()
        // end by sending response back to client 
        res.json(data)


    })

    app.get('/api', (req, res) => {

        database.find({}, (err, data) => {
            if (err) {
                res.end()
                return
            }
            res.json(data)
        })
        
    })

    app.get('/weather/:latlng', async (req, res) => {
        const latlng = req.params.latlng.split(',')
        const lat = latlng[0]
        const lng = latlng[1]
        const api_key = process.env.API_KEY
        const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}`
        const weather_response = await fetch(weather_url)
        const weather_data = await weather_response.json()

        // Air Quality get request from openaq.org
        const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lng}`
        const aq_response = await fetch(aq_url)
        const aq_data = await aq_response.json()

        const data = {
            weather: weather_data,
            air_quality: aq_data
        }

        res.json(data)
    })
    
    // POST request with fetch() > do in client side index.html




// 4. Authentication