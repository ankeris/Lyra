function initMap() {
    let uluru = {
        lat: 54.693871,
        lng: 25.250628
    };
    let map = new google
        .maps
        .Map(document.querySelector('.map'), {
            zoom: 15,
            center: uluru
        });
    let marker = new google
        .maps
        .Marker({position: uluru, map: map, animation: google.maps.Animation.DROP});
    let infowindow = new google
        .maps
        .InfoWindow({content: contentString});
    infowindow.open(map, marker);
    marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
}
let contentString = '<div id="content"><h4 id="firstHeading" class="firstH' +
        'eading">Salonas Lyra</h4><div id="bodyContent"><p>Kęstučio g. 26, Vilnius</p><p><a href="tel:+37052623596">Tel.: (+370 5) 262 35 96</a></p><p></p></div>I - V - 10:00 - 19:00 val. VI - 10:00 - 15:00 val</div>';