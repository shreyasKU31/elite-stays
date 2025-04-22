mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 12, // starting zoom
});

const popup = new mapboxgl.Popup({ offset: 10 }).setHTML(
  `<h3>${listing.location}</h3>.<p>Exact Location will be provided after booking.</p>`
);

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
