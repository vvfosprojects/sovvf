import {Component, ElementRef} from '@angular/core';
import * as GoogleMapsLoader from 'google-maps';

@Component({
  selector: 'google-maps',
  styleUrls: ['./googleMaps.scss'],
  templateUrl: './googleMaps.html',
})
export class GoogleMaps {

  constructor(private _elementRef:ElementRef) {
  }

  ngAfterViewInit() {
    let el = this._elementRef.nativeElement.querySelector('.google-maps');

    //L.Icon.Default.imagePath = 'assets/img/theme/vendor/leaflet';

    // TODO: do not load this each time as we already have the library after first attempt
    GoogleMapsLoader.load((google) => {
        new google.maps.Map(el, {
        //center: new google.maps.LatLng(44.5403, -78.5463),
        center: new google.maps.LatLng(41.9060, 12.5122),        
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    });

    //let myLatlng = new google.maps.LatLng(44.5403,-78.5463);
    //let map = new google.maps.Map(el, {
    //    center: new google.maps.LatLng(44.5403, -78.5463),
    //    zoom: 8,
    //    mapTypeId: google.maps.MapTypeId.ROADMAP
    //  });
    //let marker = new google.maps.Marker({ 
    //    draggable: true,
    //    animation: google.maps.Animation.DROP,
    //      position: myLatlng,
    //      map: map,//set map created here
    //        title:"Hello World!"
    //      });          
    //var map = L.map(el).setView([41.9060, 12.5122], 13);
    //L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //}).addTo(map);

    //L.marker([41.9065464, 12.544122]).addTo(map)
    //  .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //  .openPopup();
    ;
  }
}
