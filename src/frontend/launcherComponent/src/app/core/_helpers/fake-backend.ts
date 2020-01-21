import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { Role, Utente } from '../../shared/model/utente.model';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const users: Utente[] = [
            {
                id: '1',
                nome: 'Luigi',
                cognome: 'Bianchi',
                username: 'admin',
                password: 'admin',
                ruoli: [
                    {
                        descrizione: Role.CallTracker,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'VVVRCT81H56Z715N',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '2',
                nome: 'Teresio',
                cognome: 'Mancini',
                username: 'user',
                password: 'user',
                ruoli: [
                    {
                        descrizione: Role.CallTracker,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'VDPRHC53C14L424K',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '3',
                nome: 'Mario',
                cognome: 'Rossi',
                username: 'test',
                password: 'test',
                ruoli: [
                    {
                        descrizione: Role.GestoreRichieste,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'YZSPMD89M07M185L',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '4',
                nome: 'Gualtiero',
                cognome: 'Milano',
                username: 'gualtiero',
                password: 'milano',
                ruoli: [
                    {
                        descrizione: Role.GestoreRichieste,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'PRZSPRA89M03M117O',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '5',
                nome: 'Marco',
                cognome: 'Rossi',
                username: 'marco',
                password: 'rossi',
                ruoli: [
                    {
                        descrizione: Role.GestoreRichieste,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'DTNZMD81C49E783W',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '6',
                nome: 'Marco',
                cognome: 'Verdi',
                username: 'marco',
                password: 'verdi',
                ruoli: [
                    {
                        descrizione: Role.GestoreRichieste,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'VNFLYH70E01A412P',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '7',
                nome: 'Isabella',
                cognome: 'Monaldo',
                username: 'isabella',
                password: 'monaldo',
                ruoli: [
                    {
                        descrizione: Role.CallTracker,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'LBRVRY36B08D553W',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '8',
                nome: 'Ivone',
                cognome: 'Sabbatini',
                username: 'ivone',
                password: 'sabbatini',
                ruoli: [
                    {
                        descrizione: Role.GestoreRichieste,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'PQPDLS85P70I697B',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '9',
                nome: 'Flavio',
                cognome: 'Pinto',
                username: 'flavio',
                password: 'pinto',
                ruoli: [
                    {
                        descrizione: Role.CallTracker,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'HCLHND66C61A815O',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '10',
                nome: 'Sandro',
                cognome: 'Marcelo',
                username: 'sandro',
                password: 'marcelo',
                ruoli: [
                    {
                        descrizione: Role.CallTracker,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'HVHNHG30C12G396Q',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '11',
                nome: 'Isidora',
                cognome: 'Trentino',
                username: 'isidora',
                password: 'trentino',
                ruoli: [
                    {
                        descrizione: Role.GestoreRichieste,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'FMJKMI48C50C869C',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '12',
                nome: 'Amina',
                cognome: 'Zetticci',
                username: 'amina',
                password: 'zettici',
                ruoli: [
                    {
                        descrizione: Role.GestoreRichieste,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'VFRGXW29B17I633L',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '13',
                nome: 'Piera',
                cognome: 'Lori',
                username: 'piera',
                password: 'lori',
                ruoli: [
                    {
                        descrizione: Role.GestoreRichieste,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'HMLXKD51L66G417D',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '14',
                nome: 'Romeo',
                cognome: 'Marchesi',
                username: 'romeo',
                password: 'marchesi',
                ruoli: [
                    {
                        descrizione: Role.CallTracker,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'KCCRTM54M61H945I',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            },
            {
                id: '15',
                nome: 'Cora',
                cognome: 'Trentini',
                username: 'cora',
                password: 'trentini',
                ruoli: [
                    {
                        descrizione: Role.GestoreRichieste,
                        sede: {
                            codice: 'RM.1000',
                            provincia: 'ROMA',
                            regione: 'Lazio',
                            tipo: 'Comando',
                            descrizione: 'Comando VV.F. ROMA',
                            coordinate: {
                                latitudine: 41.89996,
                                longitudine: 12.49104,
                            },
                            indirizzo: 'Via Genova, 3/a',
                        }
                    }
                ],
                qualifica: 'Operatore SO115',
                codiceFiscale: 'TFMSJR66P03H966R',
                sede: {
                    codice: 'RM.1000',
                    provincia: 'ROMA',
                    regione: 'Lazio',
                    tipo: 'Comando',
                    descrizione: 'Comando VV.F. ROMA',
                    coordinate: {
                        latitudine: 41.89996,
                        longitudine: 12.49104,
                    },
                    indirizzo: 'Via Genova, 3/a',
                }
            }
        ];

        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-so115-jwt-token');
        const roleString = isLoggedIn && authHeader.split('.')[1];
        const role = roleString ? Role[roleString] : null;

        return of(null).pipe(mergeMap(() => {

            if (request.url.endsWith('/api/auth/Login') && request.method === 'POST') {
                const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user) {
                    return error('Username o password errati');
                }

                return ok({
                    // _user: {
                        id: user.id,
                        username: user.username,
                        nome: user.nome,
                        cognome: user.cognome,
                        ruoli: user.ruoli,
                        sede: user.sede,
                        token: `fake-so115-jwt-token.${user.ruoli[0].descrizione}`
                    // }
                });
            }

            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                if (!isLoggedIn) {
                    return unauthorised();
                }

                const urlParts = request.url.split('/');
                const id = parseInt(urlParts[urlParts.length - 1], 0);

                const currentUser = users.find(x => x.ruoli[0].descrizione === role);
                if (id.toString() !== currentUser.id && (role !== Role.GestoreRichieste || role !== Role.CallTracker)) {
                    return unauthorised();
                }

                const user = users.find(x => x.id === id.toString());
                return ok(user);
            }

            if (request.url.endsWith('/users') && request.method === 'GET') {
                if (role !== Role.GestoreRichieste && role !== Role.CallTracker) {
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

