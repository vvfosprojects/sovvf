import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'personale'
})
export class PersonalePipe implements PipeTransform {

    transform(value: number, args?: any): string {
        let res: string;
        switch (args) {
            case 'funzionari':
                res = value > 1 ? 'Funzionari' : 'Funzionario';
                break;
            case 'tecnici':
                res = value > 1 ? 'Tecnici' : 'Tecnico';
                break;
            default:
                return null;
        }
        return res;
    }

}
