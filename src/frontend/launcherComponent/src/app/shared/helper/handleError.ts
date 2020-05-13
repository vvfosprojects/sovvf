import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(error: HttpErrorResponse) {

    if (error && error.error instanceof ErrorEvent) {
        console.error('Si è verificato un errore:', error.message);
    } else if (error && (error.status || error.message)) {
        console.error(
            `Errore response: ${error && error.status}, ` +
            `Messaggio body: ${error && error.message}`);
    }
    return throwError('Qualcosa è andato storto, per favore riprova più tardi.');
}
