import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { Role, Utente } from '../../../shared/model/utente.model';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const users: User[] = [
        //     { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
        //     { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User },
        //     { id: 3, username: 'test', password: 'test', firstName: 'Mario', lastName: 'Rossi', role: Role.Admin }
        // ];

        const users: Utente[] = [
            { id: '1', nome: 'Luigi', cognome: 'Bianchi', username: 'admin', password: 'admin', ruolo: Role.Admin },
            { id: '2', nome: 'Pinco', cognome: 'Pallino', username: 'user', password: 'user', ruolo: Role.User },
            { id: '3', nome: 'Mario', cognome: 'Rossi', username: 'test', password: 'test', ruolo: Role.Admin }
        ];

        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');
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
                    token: `fake-jwt-token.${user.ruolo}`
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
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
