var LOADED_STOPS = null;

async function load_stops_coord(){
    if (LOADED_STOPS)
        return LOADED_STOPS;
    let url = "https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml";
    try {
        let res = await fetch(url).then(response => response.text()).then(str => {
            let parser = new window.DOMParser();
            return parser.parseFromString(str, "text/xml");
        });
        LOADED_STOPS = res;
        return res;
    } catch(err) {
        console.log('err:', err);
    }
}

async function get_markers() {
    await load_stops_coord();
    let stops_data = LOADED_STOPS.getElementsByTagName("stop");
    let size = stops_data.length;
    for (let i = 0; i < size; i++) {
        let latitude = stops_data[i].getElementsByTagName("latitude")[0].childNodes[0].nodeValue;
        let longitude = stops_data[i].getElementsByTagName("longitude")[0].childNodes[0].nodeValue;
        let popup = new maplibregl.Popup({ offset: 25 }).setHTML(
            `<a href="stops.html?id=${stops_data[i].getElementsByTagName("KS_ID")[0].childNodes[0].nodeValue}">` +
            stops_data[i].getElementsByTagName("title")[0].childNodes[0].nodeValue + `</a>`
        );

        let el = document.createElement('div');
        el.id = 'marker';
        new maplibregl.Marker(el)
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(map);
    }
}