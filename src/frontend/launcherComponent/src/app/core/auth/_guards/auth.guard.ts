import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { Select, Store } from '@ngxs/store';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../shared/enum/toastr';
import { Ruolo, Utente } from '../../../shared/model/utente.model';
import { UtenteState } from '../../../features/navbar/store/states/operatore/utente.state';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    @Select(UtenteState.utente) utente$: Observable<Utente>;
    currentUser: Utente;

    constructor(
        private router: Router,
        private store: Store
    ) {
        this.utente$.subscribe((utente: Utente) => this.currentUser = utente);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.currentUser && this.currentUser.ruoli) {
            if (!checkUserPermission(route.data.roles, this.currentUser) && route.data.roles && route.data.roles.length > 0) {
                /**
                 * utente loggato ma senza permesso
                 */
                this.store.dispatch(new ShowToastr(ToastrType.Error, 'Utente non abilitato', 'La risorsa richiesta non è accessibile da ' + this.currentUser.nome + ' ' + this.currentUser.cognome));
                this.router.navigate(['/' + RoutesPath.Home]);
                // this.router.navigate(['/' + RoutesPath.Logged]);
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
