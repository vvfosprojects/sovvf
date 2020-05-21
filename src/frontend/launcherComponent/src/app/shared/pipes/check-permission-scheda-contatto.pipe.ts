import { Pipe, PipeTransform } from '@angular/core';
import { PermissionFeatures } from '../enum/permission-features.enum';
import { PermessiService } from '../../core/service/permessi-service/permessi.service';

@Pipe({
    name: 'checkPermissionSchedaContatto',
    pure: false
})
export class CheckPermissionSchedaContattoPipe implements PipeTransform {

    constructor(private _permessiService: PermessiService) {
    }

    transform(feature: PermissionFeatures, codSede: string): any {
        if (codSede) {
            return !this._permessiService.checkUserPermissionSchedaContatto(feature, codSede);
        }
        return false;
    }

}
