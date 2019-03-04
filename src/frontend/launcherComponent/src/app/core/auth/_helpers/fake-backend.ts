import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize} from 'rxjs/operators';

import {Role, Utente} from '../../../shared/model/utente.model';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const users: Utente[] = [
      {id: '1', nome: 'Luigi', cognome: 'Bianchi', username: 'admin', password: 'admin', ruolo: Role.Admin, qualifica: 'Qualifica', codiceFiscale: 'VVVRCT81H56Z715N'},
      {id: '2', nome: 'Pinco', cognome: 'Pallino', username: 'user', password: 'user', ruolo: Role.User, qualifica: 'Qualifica', codiceFiscale: 'VDPRHC53C14L424K'},
      {id: '3', nome: 'Mario', cognome: 'Rossi', username: 'test', password: 'test', ruolo: Role.Admin, qualifica: 'Qualifica', codiceFiscale: 'YZSPMD89M07M185L'},
      {id: '4', nome: 'Marco', cognome: 'Rossi', username: 'test2', password: 'test2', ruolo: Role.Admin, qualifica: 'Qualifica', codiceFiscale: 'PRZSPRA89M03M117O'},
    ];

    const authHeader = request.headers.get('Authorization');
    const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-so115-jwt-token');
    const roleString = isLoggedIn && authHeader.split('.')[1];
    const role = roleString ? Role[roleString] : null;

    return of(null).pipe(mergeMap(() => {

      if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
        const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
        if (!user) {
          return error('Username o password errati');
        }
        return ok({
          id: user.id,
          username: user.username,
          nome: user.nome,
          cognome: user.cognome,
          ruolo: user.ruolo,
          token: `fake-so115-jwt-token.${user.ruolo}`
        });
      }

      if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
        if (!isLoggedIn) {
          return unauthorised();
        }

        const urlParts = request.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 1], 0);

        const currentUser = users.find(x => x.ruolo === role);
        if (id.toString() !== currentUser.id && role !== Role.Admin) {
          return unauthorised();
        }

        const user = users.find(x => x.id === id.toString());
        return ok(user);
      }

      if (request.url.endsWith('/users') && request.method === 'GET') {
        if (role !== Role.Admin) {
          return unauthorised();
        }
        return ok(users);
      }

      return next.handle(request);
    }))
      .pipe(materialize())
      .pipe(delay(100))
      .pipe(dematerialize());

    function ok(body) {
      return of(new HttpResponse({status: 200, body}));
    }

    function unauthorised() {
      return throwError({status: 401, error: {message: 'Unauthorised'}});
    }

    function error(message) {
      return throwError({status: 400, error: {message}});
    }
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
