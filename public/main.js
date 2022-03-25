
var map = L.map('map').setView([6.511815, -65.797119], 4);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var mascotaEnMapa = []
const cargarMascotas = async () => {
  const response = await fetch('http://localhost:3000/api/mascotas'); 
  // Llamada a la api, desde el lado del servidor.
  const myJson = await response.json(); 
  if(myJson == null || myJson.length < 1){
    alert("No hay mascotas para mostrar su ubicación de rescate!");
  }
  else{
    myJson.forEach(m => {
      //alert(m.ubicacion[0] + " , " + m.ubicacion[1]);
      var marker = L.marker(m.ubicacion).addTo(map);
      var apopup = L.popup().setContent("¡Aqui encontramos a "+ m.nombre +"!");
      marker.bindPopup(apopup);

      function muestraPopup(e) {
        marker.openPopup();
      }
      function cierraPopup(e) {
        marker.closePopup();
      }

      marker.on("mouseover", muestraPopup);
      marker.on("mouseout", cierraPopup);
      mascotaEnMapa.push(marker);
    });

    
    
    console.log("Ye");
  }
}


window.onload = cargarMascotas;
/*

var marker = L.marker([0.0,0.0]).addTo(map);

function onMapClick(e) {
    marker.setLatLng(e.latlng);
}

function onMarkerClick(e) {
  var apopup = L.popup().setContent("¡Aqui encontramos a Doki!");
  marker.bindPopup(apopup).openPopup();
}
marker.on("click", onMarkerClick);

map.on("click", onMapClick);
*/