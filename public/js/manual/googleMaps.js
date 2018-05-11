function initMap() {
    var uluru = {
        lat: 54.693871,
        lng: 25.250628
    };
    var map = new google
        .maps
        .Map(document.querySelector('.map'), {
            zoom: 15,
            center: uluru
        });
    var marker = new google
        .maps
        .Marker({position: uluru, map: map, animation: google.maps.Animation.BOUNCE});
    var infowindow = new google
        .maps
        .InfoWindow({content: contentString});
    infowindow.open(map, marker);
}
var contentString = '<div id="content"><div id="siteNotice"></div><h4 id="firstHeading" class="firstH' +
        'eading">Lyra store</h4><div id="bodyContent"><p></p><p>Attribution: Uluru(last v' +
        'isited June 22, 2009).</p></div></div>';