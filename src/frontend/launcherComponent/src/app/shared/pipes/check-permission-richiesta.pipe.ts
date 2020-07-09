import { Pipe, PipeTransform } from '@angular/core';
import { PermissionFeatures } from '../enum/permission-features.enum';
import { PermessiService } from '../../core/service/permessi-service/permessi.service';

@Pipe({
    name: 'checkPermissionRichiesta',
    pure: false
})
export class CheckPermissionRichiestaPipe implements PipeTransform {

    constructor(private _permessiService: PermessiService) {
    }

    transform(feature: PermissionFeatures, codUOCompetenza: string[], codSOCompetente: string): any {
        if (codUOCompetenza) {
            return !this._permessiService.checkUserPermissionRichiesta(feature, codUOCompetenza, codSOCompetente);
        }
        return false;
    }

}
