import {Component, ElementRef} from '@angular/core';
import * as GoogleMapsLoader from 'google-maps';

@Component({
  selector: 'mappaSOVVF',
  styleUrls: ['./mappaSOVVF.scss'],
  templateUrl: './mappaSOVVF.html',
})
export class mappaSOVVF {

  constructor(private elementRef:ElementRef) { }

  ngOnInit() {

        let el: HTMLElement = this.elementRef.nativeElement.querySelector('.mappaSOVVF');
        this.createMap(el);
  }

  private createMap(el: HTMLElement) {

        var punti = [
              ['Incendio Boschivo',  4, 41.897989, 12.504349, 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_yellow.png'],
              ['Fuga Gas',           5, 41.908210, 12.492676, 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_white.png'],
              ['Soccorso a Persona', 3, 41.898249, 12.493595, 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png'],
              ['Arrivo sul Posto',   2, 41.909743, 12.508812, '../../../../assets/img/theme/vendor/vvf/APS.png'],
              ['Uscita dalla sede',  1, 41.904662, 12.488497, '../../../../assets/img/theme/vendor/vvf/CA.png']
        ];
  
        GoogleMapsLoader.load((google) => {

            let map = new google.maps.Map(el, {
                  center: new google.maps.LatLng(41.9060, 12.5122),
                  zoom: 13,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            for (var i = 0; i < punti.length; i++) {
                  var punto = punti[i];
                  var marker = new google.maps.Marker({
                        title: punto[0],
                        zIndex: punto[1],
                        position: {lat: punto[2], lng: punto[3]},
                        icon: punto[4],
                        map: map
                  });
            }

        });
  }
  
}