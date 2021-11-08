import { StatoFonogramma } from '../enum/stato-fonogramma.enum';

export function getStatoFonogrammaEnumByName(name: string): StatoFonogramma {
    switch (name) {
        case 'Inviato':
            return StatoFonogramma.Inviato;
        case 'Da Inviare':
            return StatoFonogramma.DaInviare;
    }
}

export function getStatoFonogrammaStringByEnum(fonogrammaEnum: StatoFonogramma): string {
    switch (fonogrammaEnum) {
        case StatoFonogramma.Inviato:
            return 'Inviato';
        case StatoFonogramma.DaInviare:
            return 'Da Inviare';
    }
}
