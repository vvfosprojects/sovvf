import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { Select, Store } from '@ngxs/store';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../shared/enum/toastr';
import { Ruolo } from '../../../shared/model/utente.model';
import { Observable } from 'rxjs';
import { RuoliUtenteLoggatoState } from '../../../shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    @Select(RuoliUtenteLoggatoState.ruoli) ruoliUtente$: Observable<Ruolo[]>;
    ruoliUtente: Ruolo[];

    constructor(
        private router: Router,
        private store: Store
    ) {
        this.ruoliUtente$.subscribe((ruoliUtente: Ruolo[]) => this.ruoliUtente = ruoliUtente);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.ruoliUtente) {
            if (!checkUserPermission(route.data.roles, this.ruoliUtente) && route.data.roles && route.data.roles.length > 0) {
                /**
                 * utente loggato ma senza permesso
                 */
                this.store.dispatch(new ShowToastr(ToastrType.Error, 'Utente non abilitato', 'La risorsa richiesta non è accessibile'));
                this.router.navigate(['/' + RoutesPath.Home]);
                // this.router.navigate(['/' + RoutesPath.Logged]);
                return false;
            }

            return true;
        }

        this.router.navigate(['/' + RoutesPath.Login], { queryParams: { returnUrl: state.url } });
        return false;

        function checkUserPermission(roles: Array<any>, ruoliUtente: Ruolo[]) {
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
    }
}
