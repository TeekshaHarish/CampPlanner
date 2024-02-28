mapboxgl.accessToken = mapToken;
// mapboxgl.accessToken = 'pk.eyJ1IjoidGVla3NoYSIsImEiOiJjbHQzMWkxbGowMTdwMmlwc3g0d3E0NGl1In0.qdCYU57O1FMpjN38JHV_Bw';

const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:24})
        .setHTML(
            `<h5>${campground.title}</h5><p>${campground.location}</p>`
        )
    )
    .addTo(map)