import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role } from '../_models';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const users: User[] = [
            { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
            { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User },
            { id: 3, username: 'test', password: 'test', firstName: 'Mario', lastName: 'Rossi', role: Role.Admin }
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
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    token: `fake-jwt-token.${user.role}`
                });
            }

            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                if (!isLoggedIn) {
                    return unauthorised();
                }

                const urlParts = request.url.split('/');
                const id = parseInt(urlParts[urlParts.length - 1], 0);

                const currentUser = users.find(x => x.role === role);
                if (id !== currentUser.id && role !== Role.Admin) {
                    return unauthorised();
                }

                const user = users.find(x => x.id === id);
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
