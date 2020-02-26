import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { Store } from '@ngxs/store';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../shared/enum/toastr';
import { Ruolo, Utente } from '../../../shared/model/utente.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private store: Store,
        private authenticationService: AuthenticationService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.ruoli) {
            if (!checkUserPermission(route.data.roles, currentUser) && route.data.roles && route.data.roles.length > 0) {
                /**
                 * utente loggato ma senza permesso
                 */
                this.store.dispatch(new ShowToastr(ToastrType.Error, 'Utente non abilitato', 'La risorsa richiesta non è accessibile da ' + currentUser.nome + ' ' + currentUser.cognome));
                this.router.navigate(['/' + RoutesPath.Logged]);
                return false;
            }

            return true;
        }

        this.router.navigate(['/' + RoutesPath.Login], { queryParams: { returnUrl: state.url } });
        return false;

        function checkUserPermission(roles: Array<any>, utente: Utente) {
            let count = 0;
            if (roles && utente.ruoli.length > 0) {
                utente.ruoli.forEach((ruolo: Ruolo) => {
                    if (roles.indexOf(ruolo.descrizione) === -1) {
                        count++;
                    }
                });
            } else {
                count++;
            }
            return count === 0 || (utente.ruoli.length > 0 && count < utente.ruoli.length);
        }
    }
}
