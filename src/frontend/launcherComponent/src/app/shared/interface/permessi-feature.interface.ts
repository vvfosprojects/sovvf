import { PermissionFeatures } from '../enum/permission-features.enum';
import { Role } from '../model/utente.model';

export interface PermessiFeatureInterface {
    feature: PermissionFeatures;
    roles: Array<Role>;
}
