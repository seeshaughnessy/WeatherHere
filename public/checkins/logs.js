getData()
async function getData() {
    const res = await fetch('/api')
    const data = await res.json()

    for (item of data) {
        const root = document.createElement('p')
        root.setAttribute('id', 'checkin_item')
        const comment = document.createElement('div')
        const geo = document.createElement('div')
        const date = document.createElement('div')
        // const image = document.createElement('img')

        const lat = parseFloat(item.lat).toFixed(2)
        const lng = parseFloat(item.lng).toFixed(2)
        geo.textContent = `${lat}º, ${lng}º`
        const dateString = new Date(item.timestamp).toLocaleString()
        date.textContent = `Time: ${dateString}`
        // image.src = item.image64

        root.append(geo, date)
        document.body.append(root)

    }

    console.log(data)
}
