import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { Store } from '@ngxs/store';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../shared/enum/toastr';
import { Ruolo } from '../../shared/model/utente.model';
import { LSNAME } from '../settings/config';
import { AuthState } from '../../features/auth/store/auth.state';
import { Navigate } from '@ngxs/router-plugin';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private store: Store) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const logged = this.store.selectSnapshot(AuthState.logged);
        if (logged) {
            const ruoliUtenteLoggato = JSON.parse(sessionStorage.getItem(LSNAME.role));

            /**
             * utente loggato, rotta senza permessi
             */
            if (!route.data.roles || route.data.roles.length <= 0) {
                return true;
            }

            if (ruoliUtenteLoggato) {
                if (!checkUserPermission(route.data.roles, ruoliUtenteLoggato)) {
                    /**
                     * utente loggato ma senza permesso
                     */
                    this.store.dispatch(new ShowToastr(ToastrType.Error, 'Utente non abilitato', 'La risorsa richiesta non è accessibile'));
                    this.store.dispatch(new Navigate(['/' + RoutesPath.Home]));
                    return false;
                }

                return true;
            }
        }
        console.log('Not logged user', state.url);
        localStorage.setItem(LSNAME.redirectUrl, JSON.stringify(state.url));
        this.store.dispatch(new Navigate(['/' + RoutesPath.Login]));
        return false;
    }
}

export function checkUserPermission(roles: Array<any>, ruoliUtente: Ruolo[]) {
    let count = 0;
    if (roles && ruoliUtente.length > 0) {
        ruoliUtente.forEach((ruolo: Ruolo) => {
            if (roles.indexOf(ruolo.descrizione) === -1) {
                count++;
            }
        });
    } else {
        count++;
    }
    return count === 0 || (ruoliUtente.length > 0 && count < ruoliUtente.length);
}
