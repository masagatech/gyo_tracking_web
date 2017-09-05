var zindex = 100;

//adapted from http://gmaps-samples-v3.googlecode.com/svn/trunk/overlayview/custommarker.html
function CustomMarker(latlng, map, imageSrc, title) {
    this.latlng_ = latlng;
    this.imageSrc = imageSrc;
    this.title_ = title;
    // Once the LatLng and text are set, add the overlay to the map.  This will
    // trigger a call to panes_changed which should in turn call draw.
    this.setMap(map);

}

CustomMarker.prototype = new google.maps.OverlayView();


CustomMarker.prototype.setTitle = function (title) {
    this.div_.setAttribute("title", title);
}

CustomMarker.prototype.setTitle = function (title) {
    this.div_.setAttribute("title", title);
}

CustomMarker.prototype.draw = function () {
    // Check if the div has been created.
    var div = this.div_;
    if (!div) {
        // Create a overlay text DIV
        div = this.div_ = document.createElement('div');
        // Create the DIV representing our CustomMarker
        div.className = "customMarker"

        var innerholder = document.createElement('div');
        innerholder.className = "innerDivHolder";

        var innertitle = document.createElement('div');
        innertitle.className = "titlename";
        innertitle.innerText = this.title_;

        this.div_title_ = innertitle;

        zindex++;
        div.style.zIndex = (zindex).toString();

        var img = document.createElement("img");
        img.setAttribute("title", this.title_)
        img.src = this.imageSrc;
        img.addEventListener("error", function () { this.src = 'assets/img/default.gif'; });
        innerholder.appendChild(img);
        
        div.appendChild(innertitle);
        div.appendChild(innerholder);
        
        var map = this.getMap();
        google.maps.event.addDomListener(div, "click", function (event) {
            zindex++;
            div.style.zIndex = (zindex).toString();
            google.maps.event.trigger(map, "click");
        });

        // Then add the overlay to the DOM
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
    }

    // Position the overlay 
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
        div.style.left = point.x + 'px';
        div.style.top = point.y + 'px';
    }
};

CustomMarker.prototype.showTitle = function () {
    if (this.div_title_) {
        this.div_title_.style.display = "block";
    }
};

CustomMarker.prototype.hideTitle = function () {
    if (this.div_title_) {
        this.div_title_.style.display = "none";
    }
};

CustomMarker.prototype.remove = function () {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};
CustomMarker.prototype.setPosition = function (latlng) {
    // Position the overlay 
    this.latlng_ = latlng;
    var point = this.getProjection().fromLatLngToDivPixel(latlng);
    if (point) {
        this.div_.style.left = point.x + 'px';
        this.div_.style.top = point.y + 'px';
    }
}

CustomMarker.prototype.getPosition = function () {
    return this.latlng_;
};