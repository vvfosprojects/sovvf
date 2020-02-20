import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { Store } from '@ngxs/store';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../shared/enum/toastr';
import { Role } from '../../../shared/model/utente.model';

@Injectable({providedIn: 'root'})
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
            if (route.data.roles && route.data.roles.indexOf(currentUser.ruoli[0].descrizione) === -1) {
                console.log(route.data.roles);
                /**
                 * utente loggato ma senza permesso
                 */
                this.store.dispatch(new ShowToastr(ToastrType.Error, 'Utente non abilitato', 'La risorsa richiesta non è accessibile da ' + currentUser.nome + ' ' + currentUser.cognome));
                const homeAcceptedRoles = [ Role.Amministratore, Role.GestoreRichieste, Role.CallTaker ];
                console.log('homeAcceptedRoles', homeAcceptedRoles);
                console.log('Amministratore value', Object.values(Role.Amministratore));
                // if (homeAcceptedRoles.indexOf(currentUser.ruoli[0].descrizione) === -1) {
                //    this.router.navigate(['/' + RoutesPath.Home]);
                // }
                this.router.navigate([ '/' + RoutesPath.Logged ]);
                return false;
            }

            return true;
        }

        this.router.navigate([ '/' + RoutesPath.Login ], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
