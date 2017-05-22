import { Injectable } from '@angular/core';

import { TipologiaIntervento } from "app/ricerca-tipologie/tipologia-intervento.model";


@Injectable()
export class RicercaTipologieService {
  risultati: TipologiaIntervento[] = new Array();
  tipologie: TipologiaIntervento[] = [
    new TipologiaIntervento("0", "0", "Falso allarme (0)", "Falso allarme"),
    new TipologiaIntervento("1", "1", "Incendio normale (generico) (1)", "Incendi ed esplosioni"),
    new TipologiaIntervento("2", "2", "Incendio ed esplosione (2)", "Incendi ed esplosioni"),
    new TipologiaIntervento("3", "3", "Esplosione da sostanza esplodente (3)", "Incendi ed esplosioni"),
    new TipologiaIntervento("4", "4", "Esplosione (escluso esplosione da sostanza esplodente) (4)", "Incendi ed esplosioni"),
    new TipologiaIntervento("5", "5", "Incendio aeromobile (5)", "Aeroporti"),
    new TipologiaIntervento("6", "6", "Incendio nave o traghetto (6)", "Porti"),
    new TipologiaIntervento("7", "7", "Emergenza carrello aeromobile bloccato (7)", "Aeroporti"),
    new TipologiaIntervento("8", "8", "Recupero aeromobile (8)", "Aeroporti"),
    new TipologiaIntervento("9", "9", "Ricerca aeromobile (9)", "Aeroporti"),
    new TipologiaIntervento("10", "10", "Incidente stradale generico (10)", "Incidenti stradali"),
    new TipologiaIntervento("11", "11", "Incidente stradale con mezzo trasportante merci pericolose (11)", "Incidenti stradali"),
    new TipologiaIntervento("12", "12", "Ribaltamento di mezzo trasportante merci pericolose (12)", "Incidenti stradali"),
    new TipologiaIntervento("13", "13", "Rimozione ostacoli non dovuti al traffico (13)", "Incidenti stradali"),
    new TipologiaIntervento("14", "14", "Recupero merci e beni (14)", "Recuperi"),
    new TipologiaIntervento("15", "15", "Recupero sostanze radioattive (15)", "Recuperi"),
    new TipologiaIntervento("16", "16", "Recupero parafulmini radioattivi (16)", "Recuperi"),
    new TipologiaIntervento("17", "17", "Recupero rilevatori vari (17)", "Recuperi"),
    new TipologiaIntervento("18", "18", "Valanghe (18)", "Statica"),
    new TipologiaIntervento("19", "19", "Cedimento terreno, voragine (19)", "Statica"),
    new TipologiaIntervento("20", "20", "Cedimento sede stradale (20)", "Statica"),
    new TipologiaIntervento("21", "21", "Dissesto statico di elementi costruttivi (21)", "Statica"),
    new TipologiaIntervento("22", "22", "Danni d'acqua in genere (22)", "Acqua"),
    new TipologiaIntervento("23", "23", "Straripamenti, inondazioni, mareggiate (23)", "Acqua"),
    new TipologiaIntervento("24", "24", "Rifornimento idrico (24)", "Acqua"),
    new TipologiaIntervento("25", "25", "Prosciugamento in genere (25)", "Acqua"),
    new TipologiaIntervento("26", "26", "Soccorso a persone (26)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("27", "27", "Salvataggio persone (27)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("28", "28", "Salvataggio animali (28)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("29", "29", "Recupero salme (29)", "Vari"),
    new TipologiaIntervento("30", "30", "Recupero animali morti (30)", "Vari"),
    new TipologiaIntervento("31", "31", "Trasporto ammalati o infortunati (31)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("32", "32", "Cattura folli o alienati (32)", "Vari"),
    new TipologiaIntervento("33", "33", "Ascensori bloccati (33)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("34", "34", "Apertura porte e finestre (34)", "Vari"),
    new TipologiaIntervento("35", "35", "Incidenti sul lavoro (35)", "Vari"),
    new TipologiaIntervento("36", "36", "Servizio di assistenza (generico) (36)", "Vari"),
    new TipologiaIntervento("37", "37", "Fuga gas (37)", "Vari"),
    new TipologiaIntervento("38", "38", "Lavaggio strada (38)", "Vari"),
    new TipologiaIntervento("39", "39", "Altri tipi (39)", "Vari"),
    new TipologiaIntervento("90", "90", "Emergenza protezione civile (90)", "Emergenza protezione civile"),
    new TipologiaIntervento("99", "99", "Intervento non più necessario (99)", "Intervento non più necessario"),
    new TipologiaIntervento("301", "301", "Incendio bosco, sterpaglie, colture (301)", "Incendi ed esplosioni"),
    new TipologiaIntervento("302", "302", "Incidente seguito da incendio di mezzo trasportante merci pericolose (302)", "Incendi ed esplosioni"),
    new TipologiaIntervento("303", "303", "Incendio in sedime aeroportuale (303)", "Aeroporti"),
    new TipologiaIntervento("304", "304", "Emergenza aeroportuale di altro genere (304)", "Aeroporti"),
    new TipologiaIntervento("305", "305", "Incidente aeromobile di altro genere (305)", "Aeroporti"),
    new TipologiaIntervento("306", "306", "Incendi natanti diversi da navi e traghetti (306)", "Porti"),
    new TipologiaIntervento("307", "307", "Recupero di piccoli natanti (307)", "Porti"),
    new TipologiaIntervento("308", "308", "Soccorso a imbarcazione senza governo (308)", "Porti"),
    new TipologiaIntervento("309", "309", "Ricerca e/o soccorso in ambiente acquatico di imbarcazioni o natanti (309)", "Porti"),
    new TipologiaIntervento("310", "310", "Operazioni antinquinamento (310)", "Porti"),
    new TipologiaIntervento("311", "311", "Ricerca e/o soccorso a persona in mare (SAR) (311)", "Porti"),
    new TipologiaIntervento("312", "312", "Recupero di ostacoli alla navigazione (312)", "Porti"),
    new TipologiaIntervento("313", "313", "Supporto nautico per operazioni a terra (313)", "Porti"),
    new TipologiaIntervento("314", "314", "Incidente stradale in galleria (314)", "Incidenti stradali"),
    new TipologiaIntervento("315", "315", "Recupero sostanza pericolosa (315)", "Recuperi"),
    new TipologiaIntervento("316", "316", "Frane (316)", "Statica"),
    new TipologiaIntervento("317", "317", "Valanghe, slavine (317)", "Statica"),
    new TipologiaIntervento("318", "318", "Crollo parziale di elementi strutturali (318)", "Statica"),
    new TipologiaIntervento("319", "319", "Crollo generalizzato di opere e costruzioni (319)", "Statica"),
    new TipologiaIntervento("320", "320", "Danni d'acqua per rottura o fuoriuscita da tubazioni, canali e simili (320)", "Acqua"),
    new TipologiaIntervento("321", "321", "Incidente ferroviario (321)", "Vari"),
    new TipologiaIntervento("322", "322", "Scoppio (cedimento meccanico) (322)", "Vari"),
    new TipologiaIntervento("323", "323", "Soccorso a persone (323)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("324", "324", "Ricerca persona (SAR) (324)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("325", "325", "Recupero animali (325)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("326", "326", "Recupero salme (326)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("327", "327", "Cattura folli, trattamento sanitario obbligatorio (327)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("328", "328", "Bonifica da insetti (328)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("329", "329", "Assistenza per abbandono locali e/o ambienti (329)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("330", "330", "Recupero con verricello elicottero (330)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("331", "331", "Ricerca e ricognizione aerea (331)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("332", "332", "Ricerca da allarme COSPAS e simili (332)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("333", "333", "Trasporto al gancio baricentrico elicottero (333)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("334", "334", "Mancata adozione di dispositivi di protezione individuale (334)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("335", "335", "Di sostanza infiammabile/combustibile (335)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("336", "336", "Di sostanza comburente (336)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("337", "337", "Di sostanza tossica (337)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("338", "338", "Di sostanza asfissiante (338)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("339", "339", "Di sostanza radioattiva (339)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("340", "340", "Di sostanza biologica (340)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("341", "341", "Di sostanza combustibile in polvere (341)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("342", "342", "Di sostanza infiammabile seguita da incendio (342)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("343", "343", "Di altro tipo di sostanza (343)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("344", "344", "Inquinamento acque superficiali o di falda (344)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("345", "345", "Inquinamento di aria (345)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
    new TipologiaIntervento("346", "346", "Alberi pericolanti (346)", "Vari"),
    new TipologiaIntervento("347", "347", "Messa in sicurezza di imbarcazioni, natanti e/o galleggianti (347)", "Soccorsi e salvataggi"),
    new TipologiaIntervento("348", "348", "Recupero autovetture e veicoli (348)", "Recuperi"),
    new TipologiaIntervento("349", "349", "Rimozione neve dai tetti (349)", "Vari"),
    new TipologiaIntervento("350", "350", "Coperture tetti (350)", "Vari"),
    new TipologiaIntervento("351", "351", "Smontaggio controllato di elementi costruttivi (351)", "Statica"),
    new TipologiaIntervento("352", "352", "Demolizioni (352)", "Statica"),
    new TipologiaIntervento("353", "353", "Rimozione macerie (353)", "Statica"),
    new TipologiaIntervento("354", "354", "Sopralluoghi e verifiche di stabilita' su edifici, manufatti, cedimenti, frane, voragini (354)", "Statica"),
    new TipologiaIntervento("355", "355", "Progettazione opere provvisionali (355)", "Vari"),
    new TipologiaIntervento("356", "356", "Opere provvisionali senza progettazione (356)", "Vari"),
    new TipologiaIntervento("357", "357", "Opere provvisionali con progettazione (357)", "Vari"),
    new TipologiaIntervento("358", "358", "Recupero merci avariate (358)", "Recuperi"),
    new TipologiaIntervento("359", "359", "Messa in sicurezza serbatoi GPL (359)", "Vari"),
    new TipologiaIntervento("360", "360", "Messa in sicurezza impianti tecnologici di servizio (acqua, energia elettrica, gas) (360)", "Vari"),
    new TipologiaIntervento("361", "361", "Monitoraggio strumentale presenza di sostanze pericolose (361)", "Fuoriuscite - dispersioni - emissioni - inquinamenti"),
  ];

  constructor() {

  }

  public search(key: string): TipologiaIntervento[] {
    /**
     * In base alla chiave di ricerca filtro l'array delle tipologie --> nell'array dei risultati che viene ritornato:
     */
    this.risultati.length = 0;
    this.tipologie.forEach(a => {
      if (a.descrizione.toLocaleLowerCase().indexOf(new String(key).toLocaleLowerCase()) > -1)
        this.risultati.push(a);
    })

    return this.risultati;

  }
}
