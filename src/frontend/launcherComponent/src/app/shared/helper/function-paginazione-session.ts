import { AppFeatures } from '../enum/app-features.enum';
import { LSNAME } from '../../core/settings/config';

export function setPageSession(tipo: AppFeatures, page: string): void {
    switch (tipo) {
        case AppFeatures.Richieste:
            sessionStorage.setItem(LSNAME.pagesSession.pageRichieste, page);
            break;
    }
}

export function clearAllPagesSession(): void {
    Object.values(LSNAME.pagesSession).forEach((value: string) => {
        sessionStorage.removeItem(value);
    });
}
