import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonControlAnimation, CustomButtonsMaps } from '../../maps-interface/maps-custom-buttons';

@Component({
    selector: 'app-maps-button',
    templateUrl: './maps-button.component.html',
    styleUrls: ['./maps-button.component.css']
})
export class MapsButtonComponent {

    @Input() controlAnimation: ButtonControlAnimation;
    @Output() buttonClick = new EventEmitter<CustomButtonsMaps>();
    CustomButton = CustomButtonsMaps;

}
