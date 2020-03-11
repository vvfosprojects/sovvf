import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AppSettings } from '../../../shared/interface/app-settings.interface';

@Injectable()
export class NavbarServiceFake {

    private navbar: AppSettings;

    constructor() {
    }

    getNavbar() {

        this.navbar = {
            listaSedi: {
                text: 'CON',
                value: 'CON.0000',
                children: [
                    {
                        text: 'Direzione Regionale VV.F. Lazio',
                        value: 'LZ.0000',
                        children: [
                            {
                                text: 'Comando VV.F. di Roma',
                                value: 'RM.1000',
                                children: [
                                    {
                                        text: 'Distaccamento Cittadino La Rustica',
                                        value: 'RM.1001'
                                    },
                                    {
                                        text: 'Distaccamento Cittadino Eur',
                                        value: 'RM.1002'
                                    },
                                    {
                                        text: 'Distaccamento Cittadino Fluviale',
                                        value: 'RM.1003'
                                    }
                                ]
                            },
                            {
                                text: 'Comando VV.F. di Latina',
                                value: 'LT.1000',
                                children: [
                                    {
                                        text: 'Distaccamento Provinciale di Gaeta',
                                        value: 'LT.1001'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale di Terracina',
                                        value: 'LT.1002'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale di Aprilia',
                                        value: 'LT.1003'
                                    }
                                ]
                            },
                            {
                                text: 'Comando VV.F. di Frosinone',
                                value: 'FR.1000',
                                children: [
                                    {
                                        text: 'Distaccamento Provinciale di Cassino',
                                        value: 'FR.1001'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale di Fiuggi',
                                        value: 'FR.1002'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale di Sora',
                                        value: 'FR.1003'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: 'Direzione Regionale VV.F. Toscana',
                        value: 'TO.0000',
                        children: [
                            {
                                text: 'Comando VV.F. di Grosseto',
                                value: 'GR.1000',
                                children: [
                                    {
                                        text: 'Distaccamento Provinciale di Arcidosso',
                                        value: 'GR.1001'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale di Follonica',
                                        value: 'GR.1002'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale di Orbetello',
                                        value: 'GR.1003'
                                    }
                                ]
                            },
                            {
                                text: 'Comando VV.F. di Livorno',
                                value: 'LI.1000',
                                children: [
                                    {
                                        text: 'Distaccamento Provinciale di Cecina',
                                        value: 'LI.1001'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale di Piombino',
                                        value: 'LI.1002'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale di Portoferrai',
                                        value: 'LI.1003'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: 'Direzione Regionale VV.F. Puglia',
                        value: 'PU.0000',
                        children: [
                            {
                                text: 'Comando VV.F. di Bari',
                                value: 'BA.1000',
                                children: [
                                    {
                                        text: 'Distaccamento Provinciale Bari1',
                                        value: 'BA.1001'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale Bari2',
                                        value: 'BA.1002'
                                    }
                                ]
                            },
                            {
                                text: 'Comando VV.F. di Brindisi',
                                value: 'BR.1000',
                                children: [
                                    {
                                        text: 'Distaccamento Provinciale di Brindisi1',
                                        value: 'BR.1001'
                                    },
                                    {
                                        text: 'Distaccamento Provinciale di Brindisi2',
                                        value: 'BR.1002'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            ruoliUtLoggato: []
        //     tipologie: [
        //         {
        //             codice: '5',
        //             categoria: 'Incendi ed Esplosioni',
        //             descrizione: 'Incendio normale (generico)',
        //             star: true
        //         },
        //         {
        //             codice: '6',
        //             categoria: 'Incendi ed Esplosioni',
        //             descrizione: 'Incendio ed esplosione',
        //             star: false
        //         },
        //         {
        //             codice: '7',
        //             categoria: 'Incendi ed Esplosioni',
        //             descrizione: 'Esplosione da sostanza esplodente',
        //             star: true
        //         },
        //         {
        //             codice: '8',
        //             categoria: 'Incendi ed Esplosioni',
        //             descrizione: 'Esplosione (escluso esplosione da sostanza esplodente)',
        //             star: false
        //         },
        //         {
        //             codice: '9',
        //             categoria: 'Incendi ed Esplosioni',
        //             descrizione: 'Incendio bosco, sterpaglie, colture',
        //             star: false
        //         },
        //         {
        //             codice: '10',
        //             categoria: 'Incendi ed Esplosioni',
        //             descrizione: 'Incidente seguito da incendio di mezzo trasportante merci pericolose',
        //             star: false
        //         },
        //         {
        //             codice: '11',
        //             categoria: 'Aeroporti',
        //             descrizione: 'Incendio aeromobile',
        //             star: false
        //         },
        //         {
        //             codice: '12',
        //             categoria: 'Aeroporti',
        //             descrizione: 'Emergenza carrello aeromobile bloccato',
        //             star: false
        //         },
        //         {
        //             codice: '13',
        //             categoria: 'Aeroporti',
        //             descrizione: 'Emergenza carrello aeromobile bloccato',
        //             star: false
        //         },
        //         {
        //             codice: '14',
        //             categoria: 'Aeroporti',
        //             descrizione: 'Recupero aeromobile',
        //             star: false
        //         },
        //         {
        //             codice: '15',
        //             categoria: 'Aeroporti',
        //             descrizione: 'Ricerca aeromobile',
        //             star: false
        //         },
        //         {
        //             codice: '16',
        //             categoria: 'Aeroporti',
        //             descrizione: 'Incendio in sedime aeroportuale',
        //             star: false
        //         },
        //         {
        //             codice: '17',
        //             categoria: 'Aeroporti',
        //             descrizione: 'Emergenza aeroportuale di altro genere',
        //             star: false
        //         },
        //         {
        //             codice: '18',
        //             categoria: 'Aeroporti',
        //             descrizione: 'Incidente aeromobile di altro genere',
        //             star: false
        //         },
        //         {
        //             codice: '19',
        //             categoria: 'Porti',
        //             descrizione: 'Incendio nave o traghetto',
        //             star: false
        //         },
        //         {
        //             codice: '20',
        //             categoria: 'Porti',
        //             descrizione: 'Incendi natanti diversi da navi e traghetti',
        //             star: false
        //         },
        //         {
        //             codice: '21',
        //             categoria: 'Porti',
        //             descrizione: 'Recupero di piccoli natanti',
        //             star: false
        //         },
        //         {
        //             codice: '22',
        //             categoria: 'Porti',
        //             descrizione: 'Soccorso a imbarcazione senza governo',
        //             star: false
        //         },
        //         {
        //             codice: '23',
        //             categoria: 'Porti',
        //             descrizione: 'Ricerca e/o soccorso in ambiente acquatico di imbarcazioni o natanti',
        //             star: false
        //         },
        //         {
        //             codice: '24',
        //             categoria: 'Porti',
        //             descrizione: 'Operazioni antinquinamento',
        //             star: false
        //         },
        //         {
        //             codice: '25',
        //             categoria: 'Porti',
        //             descrizione: 'Ricerca e/o soccorso a persona in mare (SAR)',
        //             star: false
        //         },
        //         {
        //             codice: '26',
        //             categoria: 'Porti',
        //             descrizione: 'Recupero di ostacoli alla navigazione',
        //             star: false
        //         },
        //         {
        //             codice: '27',
        //             categoria: 'Porti',
        //             descrizione: 'Supporto nautico per operazioni a terra',
        //             star: false
        //         },
        //         {
        //             codice: '28',
        //             categoria: 'Porti',
        //             descrizione: 'Incidente nautico',
        //             star: false
        //         },
        //         {
        //             codice: '29',
        //             categoria: 'Incidenti Stradali',
        //             descrizione: 'Incidente stradale generico',
        //             star: false
        //         },
        //         {
        //             codice: '30',
        //             categoria: 'Incidenti Stradali',
        //             descrizione: 'Incidente stradale con mezzo trasportante merci pericolose',
        //             star: false
        //         },
        //         {
        //             codice: '31',
        //             categoria: 'Incidenti Stradali',
        //             descrizione: 'Ribaltamento di mezzo trasportante merci pericolose',
        //             star: false
        //         },
        //         {
        //             codice: '32',
        //             categoria: 'Incidenti Stradali',
        //             descrizione: 'Rimozione ostacoli non dovuti al traffico',
        //             star: false
        //         },
        //         {
        //             codice: '33',
        //             categoria: 'Incidenti Stradali',
        //             descrizione: 'Incidente stradale in galleria',
        //             star: false
        //         },
        //         {
        //             codice: '34',
        //             categoria: 'Recuperi',
        //             descrizione: 'Recupero merci e beni',
        //             star: false
        //         },
        //         {
        //             codice: '35',
        //             categoria: 'Recuperi',
        //             descrizione: 'Recupero sostanze radioattive',
        //             star: false
        //         },
        //         {
        //             codice: '36',
        //             categoria: 'Recuperi',
        //             descrizione: 'Recupero parafulmini radioattivi',
        //             star: false
        //         },
        //         {
        //             codice: '37',
        //             categoria: 'Recuperi',
        //             descrizione: 'Recupero sostanza pericolosa',
        //             star: false
        //         },
        //         {
        //             codice: '38',
        //             categoria: 'Recuperi',
        //             descrizione: 'Recupero autovetture e veicoli',
        //             star: false
        //         },
        //         {
        //             codice: '39',
        //             categoria: 'Recuperi',
        //             descrizione: 'Recupero merci avariate',
        //             star: false
        //         },
        //         {
        //             codice: '40',
        //             categoria: 'Statica',
        //             descrizione: 'Valanghe',
        //             star: false
        //         },
        //         {
        //             codice: '41',
        //             categoria: 'Statica',
        //             descrizione: 'Frane',
        //             star: false
        //         },
        //         {
        //             codice: '42',
        //             categoria: 'Statica',
        //             descrizione: 'Cedimento terreno, voragine',
        //             star: false
        //         },
        //         {
        //             codice: '44',
        //             categoria: 'Statica',
        //             descrizione: 'Cedimento sede stradale',
        //             star: false
        //         },
        //         {
        //             codice: '45',
        //             categoria: 'Statica',
        //             descrizione: 'Dissesto statico di elementi costruttivi',
        //             star: false
        //         },
        //         {
        //             codice: '46',
        //             categoria: 'Statica',
        //             descrizione: 'Valanghe, slavine',
        //             star: false
        //         },
        //         {
        //             codice: '47',
        //             categoria: 'Statica',
        //             descrizione: 'Crollo parziale di elementi strutturali',
        //             star: false
        //         },
        //         {
        //             codice: '48',
        //             categoria: 'Statica',
        //             descrizione: 'Crollo generalizzato di opere e costruzioni',
        //             star: false
        //         },
        //         {
        //             codice: '49',
        //             categoria: 'Statica',
        //             descrizione: 'Smontaggio controllato di elementi costruttivi',
        //             star: false
        //         },
        //         {
        //             codice: '50',
        //             categoria: 'Statica',
        //             descrizione: 'Demolizioni',
        //             star: false
        //         },
        //         {
        //             codice: '51',
        //             categoria: 'Statica',
        //             descrizione: 'Rimozione macerie',
        //             star: false
        //         },
        //         {
        //             codice: '52',
        //             categoria: 'Statica',
        //             descrizione: 'Sopralluoghi e verifiche di stabilita\' su edifici, manufatti, cedimenti, frane, voragini',
        //             star: false
        //         },
        //         {
        //             codice: '53',
        //             categoria: 'Statica',
        //             descrizione: 'Verifiche statiche per compilazione schede AEDES',
        //             star: false
        //         },
        //         {
        //             codice: '54',
        //             categoria: 'Statica',
        //             descrizione: 'Verifiche statiche speditive (TRIAGE)',
        //             star: false
        //         },
        //         {
        //             codice: '55',
        //             categoria: 'Acqua',
        //             descrizione: 'Danni d\'acqua in genere',
        //             star: false
        //         },
        //         {
        //             codice: '56',
        //             categoria: 'Acqua',
        //             descrizione: 'Straripamenti, inondazioni, mareggiate',
        //             star: false
        //         },
        //         {
        //             codice: '57',
        //             categoria: 'Acqua',
        //             descrizione: 'Rifornimento idrico',
        //             star: false
        //         },
        //         {
        //             codice: '58',
        //             categoria: 'Acqua',
        //             descrizione: 'Prosciugamento in genere',
        //             star: false
        //         },
        //         {
        //             codice: '59',
        //             categoria: 'Acqua',
        //             descrizione: 'Danni d\'acqua per rottura o fuoriuscita da tubazioni, canali e simili',
        //             star: false
        //         },
        //         {
        //             codice: '60',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Soccorso a persone',
        //             star: true
        //         },
        //         {
        //             codice: '61',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Salvataggio persone',
        //             star: false
        //         },
        //         {
        //             codice: '62',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Salvataggio animali',
        //             star: false
        //         },
        //         {
        //             codice: '63',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Trasporto ammalati o infortunati',
        //             star: false
        //         },
        //         {
        //             codice: '64',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Ascensori bloccati',
        //             star: false
        //         },
        //         {
        //             codice: '65',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Ricerca persona (SAR)',
        //             star: false
        //         },
        //         {
        //             codice: '66',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Recupero animali',
        //             star: false
        //         },
        //         {
        //             codice: '67',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Assistenza Trattamento Sanitario Obbl. (TSO)',
        //             star: false
        //         },
        //         {
        //             codice: '68',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Bonifica da insetti',
        //             star: false
        //         },
        //         {
        //             codice: '69',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Assistenza per abbandono locali e/o ambienti',
        //             star: false
        //         },
        //         {
        //             codice: '70',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Recupero con verricello elicottero',
        //             star: false
        //         },
        //         {
        //             codice: '71',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Ricerca e ricognizione aerea',
        //             star: false
        //         },
        //         {
        //             codice: '72',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Ricerca da allarme COSPAS e simili',
        //             star: false
        //         },
        //         {
        //             codice: '73',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Trasporto al gancio baricentrico elicottero',
        //             star: false
        //         },
        //         {
        //             codice: '74',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Mancata adozione di dispositivi di protezione individuale',
        //             star: false
        //         },
        //         {
        //             codice: '75',
        //             categoria: 'Soccorsi e Salvataggi',
        //             descrizione: 'Messa in sicurezza di imbarcazioni, natanti e/o galleggianti',
        //             star: false
        //         },
        //         {
        //             codice: '76',
        //             categoria: 'Vari',
        //             descrizione: 'Recupero salme',
        //             star: false
        //         },
        //         {
        //             codice: '77',
        //             categoria: 'Vari',
        //             descrizione: 'Recupero animali morti',
        //             star: false
        //         },
        //         {
        //             codice: '78',
        //             categoria: 'Vari',
        //             descrizione: 'Apertura porte e finestre',
        //             star: false
        //         },
        //         {
        //             codice: '79',
        //             categoria: 'Vari',
        //             descrizione: 'Incidenti sul lavoro',
        //             star: false
        //         },
        //         {
        //             codice: '80',
        //             categoria: 'Vari',
        //             descrizione: 'Servizio di assistenza (generico)',
        //             star: false
        //         },
        //         {
        //             codice: '81',
        //             categoria: 'Vari',
        //             descrizione: 'Fuga gas',
        //             star: false
        //         },
        //         {
        //             codice: '82',
        //             categoria: 'Vari',
        //             descrizione: 'Lavaggio strada',
        //             star: false
        //         },
        //         {
        //             codice: '83',
        //             categoria: 'Vari',
        //             descrizione: 'Incidente ferroviario',
        //             star: false
        //         },
        //         {
        //             codice: '84',
        //             categoria: 'Vari',
        //             descrizione: 'Scoppio (cedimento meccanico)',
        //             star: false
        //         },
        //         {
        //             codice: '85',
        //             categoria: 'Vari',
        //             descrizione: 'Alberi pericolanti',
        //             star: false
        //         },
        //         {
        //             codice: '86',
        //             categoria: 'Vari',
        //             descrizione: 'Rimozione neve dai tetti',
        //             star: false
        //         },
        //         {
        //             codice: '87',
        //             categoria: 'Vari',
        //             descrizione: 'Coperture tetti',
        //             star: false
        //         },
        //         {
        //             codice: '88',
        //             categoria: 'Vari',
        //             descrizione: 'Progettazione opere provvisionali',
        //             star: false
        //         },
        //         {
        //             codice: '89',
        //             categoria: 'Vari',
        //             descrizione: 'Opere provvisionali senza progettazione',
        //             star: false
        //         },
        //         {
        //             codice: '90',
        //             categoria: 'Vari',
        //             descrizione: 'Opere provvisionali con progettazione',
        //             star: false
        //         },
        //         {
        //             codice: '91',
        //             categoria: 'Vari',
        //             descrizione: 'Messa in sicurezza serbatoi GPL',
        //             star: false
        //         },
        //         {
        //             codice: '92',
        //             categoria: 'Vari',
        //             descrizione: 'Messa in sicurezza impianti tecnologici di servizio (acqua, energia elettrica, gas)',
        //             star: false
        //         },
        //         {
        //             codice: '93',
        //             categoria: 'Vari',
        //             descrizione: 'Altri tipi',
        //             star: false
        //         },
        //         {
        //             codice: '94',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Di sostanza infiammabile/combustibile',
        //             star: false
        //         },
        //         {
        //             codice: '95',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Di sostanza comburente',
        //             star: false
        //         },
        //         {
        //             codice: '96',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Di sostanza tossica',
        //             star: false
        //         },
        //         {
        //             codice: '97',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Di sostanza asfissiante',
        //             star: false
        //         },
        //         {
        //             codice: '98',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Di sostanza radioattiva',
        //             star: false
        //         },
        //         {
        //             codice: '99',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Di sostanza biologica',
        //             star: false
        //         },
        //         {
        //             codice: '100',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Di sostanza combustibile in polvere',
        //             star: false
        //         },
        //         {
        //             codice: '101',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Di sostanza infiammabile seguita da incendio',
        //             star: false
        //         },
        //         {
        //             codice: '102',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Di altro tipo di sostanza',
        //             star: false
        //         },
        //         {
        //             codice: '103',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Inquinamento acque superficiali o di falda',
        //             star: false
        //         },
        //         {
        //             codice: '104',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Inquinamento di aria',
        //             star: false
        //         },
        //         {
        //             codice: '105',
        //             categoria: 'Fuoriuscite, Dispersioni, Emissioni, Inquinamenti',
        //             descrizione: 'Monitoraggio strumentale presenza di sostanze pericolose',
        //             star: false
        //         },
        //         {
        //             codice: '106',
        //             categoria: 'Intervento non più necessario',
        //             descrizione: 'Intervento non più necessario',
        //             star: false
        //         },
        //         {
        //             codice: '107',
        //             categoria: 'Falso allarme',
        //             descrizione: 'Falso allarme',
        //             star: false
        //         }
        //     ]
        };

        // this.navbar.tipologie.map(tipologia => {
        //     tipologia.codiceDescrizione = `${tipologia.descrizione} (${tipologia.codice})`;
        // });

        return of(this.navbar);
    }
}
