var Location,clientID,clientSecret;

function ViewModel(){
    var self = this;
    this.markers = [];

    this.openInfoWindow = function(marker,infowindow) {
        // Foursquare API credentials.
        if(infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            clientID = 'E3R5JRDXTBXUYCJMLOHWW2BLWJ55SCLWUD5HBBTTKZKGT0AP';
            clientSecret = 'MKKCIMES4QTMB5LFZHJTBZO1OJRCGT3CVCSOASIHTMTBG5IG';

            // Foursquare API Link to call.
            var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170801' + '&query=' + this.name;

            // Gets the data from foursquare and store it into its' own variables.
            $.getJSON(foursquareURL).done(function (data) {
                var results = data.response.venues[0];
                self.URL = results.url;
                if (typeof self.URL === 'undefined') {
                    self.URL = "";
                }
                self.street = results.location.formattedAddress[0] || 'No Address Provided';
                self.city = results.location.formattedAddress[1] || 'No Address Provided';
                self.zip = results.location.formattedAddress[3];
                self.country = results.location.formattedAddress[4];
                // This is what the infowindow will contain when clicked.
                this.contentString = '<div class="info-window-content"><div class="title"><b>' + marker.title + "</b></div>" +
                    '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
                    '<div class="content">' + self.street + "</div>" +
                    '<div class="content">' + self.city + "</div>";

                infowindow.setContent(this.contentString);
            }).fail(function () {
                alert('<em>There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.</p>');
            });
            infowindow.open(map,marker);
            infowindow.addListener('closeclick',function() {
                infowindow.marker = null;
            });
        }
    };


    this.popUpMarker = function() {
        self.openInfoWindow(this,self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function(){
            this.setAnimation(null);
        }).bind(this),1400);
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 22.258652,lng: 71.192381},
        zoom: 8,
        mapTypeControl: false
    });

    this.largeInfoWindow = new google.maps.InfoWindow();
    for(var i=0;i < myLocations.length;i++) {
        this.name = myLocations[i].name;
        this.lat=  myLocations[i].lat;
        this.long = myLocations[i].long;
        // Places the marker to it's designed location on the map along with it's title.
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.lat, this.long),
            map: map,
            title: this.name
        });
        this.marker.setMap(map);
        this.markers.push(this.marker);
        this.marker.addListener('click',self.popUpMarker);
    }

    this.closeNav = function() {
        //myWidth = ko.observable('0px');
        document.getElementById('side-nav').style.display = "none";
    };

    this.openNav = function() {
        //myWidth = ko.observable('250px');
        document.getElementById('side-nav').style.display = "block";
    };

    // Search term is blank by default
    this.searchTerm = ko.observable('');

    this.locationList = ko.observableArray([]);

    // Search
    this.filteredLocationList = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchTerm()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);

}

// Error handling if map doesn't load.
function googleError() {
    alert('We had trouble loading Google Maps. Please refresh your browser and try again.');
}

function start() {
    ko.applyBindings(new ViewModel());
}