import {Pipe, PipeTransform} from '@angular/core';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';

@Pipe({
    name: 'icon'
})
export class IconPipe implements PipeTransform {

    iconDefault = {
        url: '../../../assets/img/icone-markers/rosso.png',
        scaledSize: {
            width: 50,
            height: 50
        }
    };

    transform(marker: RichiestaMarker): any {
        const colori = ['rosso', 'verde', 'blu', 'giallo', 'bianco'];
        const size = [30, 40, 50, 60, 70];
        this.iconDefault.url = '../../../assets/img/icone-markers/' + colori[marker.id_tipologia - 1] + '.png';
        this.iconDefault.scaledSize.width = size[marker.prioritaRichiesta - 1];
        this.iconDefault.scaledSize.height = size[marker.prioritaRichiesta - 1];
        return this.iconDefault;
    }

}
