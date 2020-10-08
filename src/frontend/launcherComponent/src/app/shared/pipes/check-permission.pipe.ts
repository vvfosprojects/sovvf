import { Pipe, PipeTransform } from '@angular/core';
import { PermissionFeatures } from '../enum/permission-features.enum';
import { PermessiService } from '../../core/service/permessi-service/permessi.service';

@Pipe({
    name: 'checkPermission',
    pure: false
})
export class CheckPermissionPipe implements PipeTransform {

    constructor(private permessiService: PermessiService) {
    }

    transform(feature: PermissionFeatures): any {
        return !this.permessiService.checkUserPermissionByFeature(feature);
    }

}
