import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
        console.error('Si è verificato un errore:', error.message);
    } else {
        console.error(
            `Errore response: ${error.status}, ` +
            `Messaggio body: ${error.message}`);
    }
    return throwError('Qualcosa è andato storto, per favore riprova più tardi.');
}
