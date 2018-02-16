import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { MezzoInServizio } from '../mezzoinservizio/mezzoinservizio.model';
import { PersonaSulMezzo } from "../mezzoinservizio/persona-sul-mezzo.model";
import { Http } from "@angular/http";

@Injectable()
export class ListaMezziService_FakeJson {
  private mezzi: MezzoInServizio[] = JSON.parse(`
  [
    {
      "codice": "FRP98903",
      "descrizione": "APS/820",
      "targa": "54283",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-25T01:02:10.4551733+02:00",
      "codiceRichiestaAssistenza": "505.148.566",
      "disponibile": true,
      "descrizioneSquadra": "A68",
      "tooltipSquadra": "A13",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GVHQGJ30E99F197G",
          "descrizione": "Quirino Fontana",
          "tooltip": "DPDJPT60S09E263L",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZKZHCX71D37L078D",
          "descrizione": "Giobbe Villa",
          "tooltip": "CDMSXP26Y18R575U",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WHCLFU92G92B918R",
          "descrizione": "Serse Carbon",
          "tooltip": "IMRCSV28Z36E649B",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VKNHHD24X32S721J",
          "descrizione": "Emidio Giuliani",
          "tooltip": "IEFJQZ90X57O591A",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GUVAEF21J55B612T",
          "descrizione": "Modesto Costa",
          "tooltip": "WQBWIJ13W17R762W",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": [
        {
          "codiceStato": "InSede"
        }
      ]
    },
    {
      "codice": "OQL01900",
      "descrizione": "ABP/429",
      "targa": "30597",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T20:13:51.4804382+02:00",
      "codiceRichiestaAssistenza": "717.159.608",
      "disponibile": true,
      "descrizioneSquadra": "A56",
      "tooltipSquadra": "A44",
      "personeSulMezzo": [
        {
          "codiceFiscale": "XMVROB42N38R618B",
          "descrizione": "Sabatino Marian",
          "tooltip": "KERKXL59O27I711P",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "DFEVAD62C56B990G",
          "descrizione": "Augusto Montanari",
          "tooltip": "QFCXFY19Z70B455R",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WDSYHO42J75Y524X",
          "descrizione": "Gianmarco Marini",
          "tooltip": "KBHYWX26M04E543E",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CRRICV75L41J731Y",
          "descrizione": "Miriana Basile",
          "tooltip": "POFWBC99F86Z420J",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GLGKOG74L78X195G",
          "descrizione": "Ippolito Fior",
          "tooltip": "PWUQGE85R84S169W",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ], 
       "codiciStatoSucc": [
        {
          "codiceStato": "SulPosto"
        },
        {
          "codiceStato": "InRientro"
        },
        {
          "codiceStato": "InSede"
        }
      ]
    },
    {
      "codice": "MRP53874",
      "descrizione": "ABP/448",
      "targa": "16907",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T23:25:29.2215342+02:00",
      "codiceRichiestaAssistenza": "068.837.133",
      "disponibile": true,
      "descrizioneSquadra": "A02",
      "tooltipSquadra": "A22",
      "personeSulMezzo": [
        {
          "codiceFiscale": "ZEDJIL96P14K663W",
          "descrizione": "Sesto Orlando",
          "tooltip": "LGNTNC27O21S305A",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "BOIUGZ41C77L959T",
          "descrizione": "Domingo Caruso",
          "tooltip": "BMLPGB74I44D316I",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "HIXUMU46T48U033Q",
          "descrizione": "Kai Colombo",
          "tooltip": "NPZCTO51P66J331R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LEJLGB88V29J018Y",
          "descrizione": "Joey Milani",
          "tooltip": "SIGEGX77Z00N486Y",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LVSFLU12N61B487E",
          "descrizione": "Cassiopea D'amico",
          "tooltip": "JEZCNO28T87M541J",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": [
        {
          "codiceStato": "SulPosto"
        },
        {
          "codiceStato": "InRientro"
        },
        {
          "codiceStato": "InSede"
        }
      ]
    },
    {
      "codice": "CMK69196",
      "descrizione": "ABP/747",
      "targa": "34816",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T17:49:53.2660078+02:00",
      "codiceRichiestaAssistenza": "672.551.134",
      "disponibile": true,
      "descrizioneSquadra": "A16",
      "tooltipSquadra": "A62",
      "personeSulMezzo": [
        {
          "codiceFiscale": "UXYSKY82E14X327M",
          "descrizione": "Artes Riva",
          "tooltip": "VMBZBS71N68C512J",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UGFZMX94N85G451M",
          "descrizione": "Anastasio Montanari",
          "tooltip": "ASXXAR83P30X719Y",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FVVBXP54F14S953S",
          "descrizione": "Miriam Mazza",
          "tooltip": "QWIFHQ53E49U156W",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ROOQKD47W11K093A",
          "descrizione": "Giuliano Sartori",
          "tooltip": "BXQOLJ23A23J136R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EIZVML63C51H219Q",
          "descrizione": "Joseph De Angelis",
          "tooltip": "ZBZDHE73K58X033E",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": [
        {
          "codiceStato": "InRientro"
        },
        {
          "codiceStato": "InSede"
        }
      ]
    },
    {
      "codice": "REC76234",
      "descrizione": "AS/611",
      "targa": "28261",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-25T14:14:59.9389079+02:00",
      "codiceRichiestaAssistenza": "240.496.752",
      "disponibile": true,
      "descrizioneSquadra": "A76",
      "tooltipSquadra": "A98",
      "personeSulMezzo": [
        {
          "codiceFiscale": "CFOLAU69F66Z444A",
          "descrizione": "Marco Bianc",
          "tooltip": "EHBAHZ12C48A869Q",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LEPEAR69H29T064J",
          "descrizione": "Orfeo De luca",
          "tooltip": "ZAEHMX55M36U358A",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WYXMNQ17C03F405K",
          "descrizione": "Romolo Ferrari",
          "tooltip": "PGXDHM11P64Q225P",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LSUUIX41K53A482E",
          "descrizione": "Vania Marian",
          "tooltip": "TZUQZJ45C64D984C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SVNRSV67T11R742Q",
          "descrizione": "Benedetta Barone",
          "tooltip": "QQCULV33N93I107M",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "ILX49208",
      "descrizione": "AV/460",
      "targa": "17380",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-25T03:41:42.4870141+02:00",
      "codiceRichiestaAssistenza": "917.583.529",
      "disponibile": true,
      "descrizioneSquadra": "A18",
      "tooltipSquadra": "A60",
      "personeSulMezzo": [
        {
          "codiceFiscale": "FAOQDE93B22V230C",
          "descrizione": "Domiziano Bruno",
          "tooltip": "MAEEST46R41L940X",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VWWBOM49K80Q874L",
          "descrizione": "Osea D'angelo",
          "tooltip": "YAVVWQ52Y87H424F",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GOBTZO27X68T997E",
          "descrizione": "Cleopatra Monti",
          "tooltip": "XAAAKZ25D65R445F",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XFMTKU09F78I916P",
          "descrizione": "Enrica Benedetti",
          "tooltip": "FFOQUU00E39L337V",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZGXTCY18R18O999Y",
          "descrizione": "Abramo Ruggiero",
          "tooltip": "ZIOSZJ78O22L923Q",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "JWI42179",
      "descrizione": "AV/445",
      "targa": "55378",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-25T13:45:14.8861873+02:00",
      "codiceRichiestaAssistenza": "500.308.550",
      "disponibile": true,
      "descrizioneSquadra": "A93",
      "tooltipSquadra": "A36",
      "personeSulMezzo": [
        {
          "codiceFiscale": "AYQRCE19X48F899C",
          "descrizione": "Harry Marian",
          "tooltip": "PXBCLW99B09X884X",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LTKMLE79X81S102X",
          "descrizione": "Tancredi Grassi",
          "tooltip": "FZVFVE11W95X330N",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JTCSKD01O62W970O",
          "descrizione": "Egisto Ruggiero",
          "tooltip": "XPOPIH08A39U305Y",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EGTOBY66D93E099L",
          "descrizione": "Furio Cont",
          "tooltip": "XVETLK20U58X738W",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "IRHEZZ84J98V145I",
          "descrizione": "Gianmarco Sartori",
          "tooltip": "DZMIEU88B20N720Q",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "UEZ19973",
      "descrizione": "AS/883",
      "targa": "82340",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-25T12:38:49.1566073+02:00",
      "codiceRichiestaAssistenza": "711.771.218",
      "disponibile": true,
      "descrizioneSquadra": "A14",
      "tooltipSquadra": "A61",
      "personeSulMezzo": [
        {
          "codiceFiscale": "QIZLZR26C41U405D",
          "descrizione": "Helga Bianchi",
          "tooltip": "BAMWUQ34P19O675M",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CCRVOB89D99I066Y",
          "descrizione": "Ercole Piras",
          "tooltip": "WDMEUQ26M19N085M",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ACGYZE56V60I950L",
          "descrizione": "Loretta Moretti",
          "tooltip": "IQXXFI33W24X451O",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VWVCRQ73D69R904R",
          "descrizione": "Aroldo De rosa",
          "tooltip": "WDFBPO86L37O889F",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "PAPYSW57O47K778N",
          "descrizione": "Ione De luca",
          "tooltip": "LQUFNW93B30C898W",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "QVI50644",
      "descrizione": "AS/587",
      "targa": "44439",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-25T02:57:16.4665853+02:00",
      "codiceRichiestaAssistenza": "168.728.120",
      "disponibile": true,
      "descrizioneSquadra": "A00",
      "tooltipSquadra": "A49",
      "personeSulMezzo": [
        {
          "codiceFiscale": "RLCQNB65E42B872U",
          "descrizione": "Folco Colombo",
          "tooltip": "AVYYYS35O83S457J",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QRWYKV87A68I969U",
          "descrizione": "Teseo Coppola",
          "tooltip": "FTNDYE41Q86W513P",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CPFPEA29H80R995B",
          "descrizione": "Michael D'amico",
          "tooltip": "QCNYTY72X37I150V",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ELPCFO68C17F626Q",
          "descrizione": "Timoteo Martinelli",
          "tooltip": "NOQLQM83O44V181K",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QQCJCN68P14N671A",
          "descrizione": "Pericle Piras",
          "tooltip": "GOZYQK20K53R358Z",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "ZFG69978",
      "descrizione": "AV/867",
      "targa": "22241",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-25T04:26:11.5248761+02:00",
      "codiceRichiestaAssistenza": "183.053.814",
      "disponibile": true,
      "descrizioneSquadra": "A49",
      "tooltipSquadra": "A97",
      "personeSulMezzo": [
        {
          "codiceFiscale": "QCOECD03Y70J272V",
          "descrizione": "Joannes Moretti",
          "tooltip": "OZVKWD16W28M052W",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WGHEEF12E73W002Z",
          "descrizione": "Assia Ferrari",
          "tooltip": "LVSSBY42B02A808K",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "OFNHJV52D72P708V",
          "descrizione": "Benedetta Testa",
          "tooltip": "BEOGFS91D87N826R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UEAEQF45G68L024I",
          "descrizione": "Miriam Costantin",
          "tooltip": "GAZHPJ64I42K313C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "RQTEVS09O85B943P",
          "descrizione": "Timothy Giuliani",
          "tooltip": "RUWLVZ71D92N371U",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "RDB95997",
      "descrizione": "AS/272",
      "targa": "80232",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-25T02:04:26.3450102+02:00",
      "codiceRichiestaAssistenza": "646.486.817",
      "disponibile": true,
      "descrizioneSquadra": "A92",
      "tooltipSquadra": "A37",
      "personeSulMezzo": [
        {
          "codiceFiscale": "AJGGCH56P08Z418X",
          "descrizione": "Vera Bruno",
          "tooltip": "LKNGUF32D48Z464X",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WVITSU76H86F275W",
          "descrizione": "Nico Rizzo",
          "tooltip": "IMCLBU03E71K392Z",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CRIHRR89Y51Y389J",
          "descrizione": "Sesto Vitali",
          "tooltip": "LTJHZP35X14J297L",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FGOZQQ15N61B377T",
          "descrizione": "Sirio Romano",
          "tooltip": "GTJJRH19V41X954U",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "DCZNUQ87I43F147B",
          "descrizione": "Anastasio Cattaneo",
          "tooltip": "SVXWSM62B47E499P",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "RII05860",
      "descrizione": "AS/922",
      "targa": "73538",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-25T07:21:20.2809933+02:00",
      "codiceRichiestaAssistenza": "070.198.286",
      "disponibile": true,
      "descrizioneSquadra": "A20",
      "tooltipSquadra": "A21",
      "personeSulMezzo": [
        {
          "codiceFiscale": "TOVXII23N20I403X",
          "descrizione": "Modesto Bruno",
          "tooltip": "MXDRRN63L70W745O",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "MILMAH93B15Q772T",
          "descrizione": "Cristyn Villa",
          "tooltip": "TPWEKQ07Q53I984V",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "OUQGEY86O00P752E",
          "descrizione": "Elga Battaglia",
          "tooltip": "YPEBVZ53V68O729Q",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "YBSEVU26J64C121O",
          "descrizione": "Miriana Bernardi",
          "tooltip": "FKTVGR69Y74G378I",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CAWZDJ56F54E552R",
          "descrizione": "Clodovea Parisi",
          "tooltip": "FFGLMD83W83C329C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "OAC38806",
      "descrizione": "AS/185",
      "targa": "68841",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-25T13:54:14.4714227+02:00",
      "codiceRichiestaAssistenza": "666.383.167",
      "disponibile": true,
      "descrizioneSquadra": "A38",
      "tooltipSquadra": "A86",
      "personeSulMezzo": [
        {
          "codiceFiscale": "FRKWJB85G68G062A",
          "descrizione": "Emilia Coppola",
          "tooltip": "UHEPUA81Y11H928E",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EYFITB98H81R033D",
          "descrizione": "Iacopo Santoro",
          "tooltip": "LBBPWN88I13V914C",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "BOVNTJ33Z81E580D",
          "descrizione": "Davide Giordano",
          "tooltip": "CDJIVV16T99E452I",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "PIKBCT76A37H401T",
          "descrizione": "Marzio Rinaldi",
          "tooltip": "YSFARP75J96R625K",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VRJHJK73M18D672P",
          "descrizione": "Cira D'amico",
          "tooltip": "PKHTMJ13Q36D096J",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "CEN95985",
      "descrizione": "AV/059",
      "targa": "00808",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-25T14:06:42.1824294+02:00",
      "codiceRichiestaAssistenza": "141.286.572",
      "disponibile": true,
      "descrizioneSquadra": "A89",
      "tooltipSquadra": "A19",
      "personeSulMezzo": [
        {
          "codiceFiscale": "TTFTWG77B06V125U",
          "descrizione": "Eustachio Santoro",
          "tooltip": "TOWLZD66U11H477D",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EYHFUC27C35Y154I",
          "descrizione": "Deborah Orlando",
          "tooltip": "RXIGPF59O97E041K",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VESBQG03R56N177O",
          "descrizione": "Giacinta Palumbo",
          "tooltip": "FWSRZF17W31N591P",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "EARJKV95B50S812J",
          "descrizione": "Walter Ferri",
          "tooltip": "NDMSVL52A50E591P",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NDJQKX16M14Y707D",
          "descrizione": "Giordano Barone",
          "tooltip": "MSHVXX59B93N765R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "GZS56982",
      "descrizione": "AS/823",
      "targa": "06167",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T16:50:19.4755534+02:00",
      "codiceRichiestaAssistenza": "514.404.801",
      "disponibile": true,
      "descrizioneSquadra": "A47",
      "tooltipSquadra": "A21",
      "personeSulMezzo": [
        {
          "codiceFiscale": "XHCAHC39K06L959T",
          "descrizione": "Artemide Serr",
          "tooltip": "DBHJIN27P02D011N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LSYTOU63E59O547J",
          "descrizione": "Marino Orlando",
          "tooltip": "BPYTMB37Y19Q270N",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "BTEQIL91T56E139P",
          "descrizione": "Rosalino Donati",
          "tooltip": "XNZLSF07F29S859R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QKBOQP79Y31Q613I",
          "descrizione": "Sarita Martini",
          "tooltip": "ACHLLH77X88W516H",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FGSNIT95I04C096T",
          "descrizione": "Mirco Giuliani",
          "tooltip": "PIYQHX88E05P498C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ],
      "codiciStatoSucc": []
    },
    {
      "codice": "CGB82171",
      "descrizione": "APS/926",
      "targa": "84749",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T17:47:35.2563962+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A46",
      "tooltipSquadra": "A01",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "NME67557",
      "descrizione": "AV/884",
      "targa": "23308",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T07:46:40.4520632+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A84",
      "tooltipSquadra": "A56",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "SQL54534",
      "descrizione": "APS/200",
      "targa": "22415",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T06:43:41.0460474+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A67",
      "tooltipSquadra": "A74",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "FIM98453",
      "descrizione": "ABP/307",
      "targa": "31023",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T13:38:28.3665506+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A97",
      "tooltipSquadra": "A60",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "SFJ08776",
      "descrizione": "ABP/064",
      "targa": "13285",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T21:53:42.7585957+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A37",
      "tooltipSquadra": "A38",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "SPD94653",
      "descrizione": "ABP/952",
      "targa": "63411",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T14:08:11.0900896+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A86",
      "tooltipSquadra": "A25",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "DWT19642",
      "descrizione": "APS/944",
      "targa": "02960",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T07:36:15.5409836+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A75",
      "tooltipSquadra": "A71",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "JUK80642",
      "descrizione": "APS/666",
      "targa": "62200",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T00:56:59.8262907+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A12",
      "tooltipSquadra": "A08",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "GYR85351",
      "descrizione": "ABP/537",
      "targa": "01947",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T06:26:47.5447197+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A61",
      "tooltipSquadra": "A85",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "TSP49814",
      "descrizione": "AS/245",
      "targa": "33162",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T11:00:38.7487439+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A34",
      "tooltipSquadra": "A77",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "GVC84649",
      "descrizione": "ABP/202",
      "targa": "47209",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T20:43:57.9221898+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A31",
      "tooltipSquadra": "A74",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "JXM81885",
      "descrizione": "ABP/530",
      "targa": "17603",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T23:27:41.4733768+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A49",
      "tooltipSquadra": "A86",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "BNX70435",
      "descrizione": "ABP/873",
      "targa": "71845",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T05:37:16.6266143+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A45",
      "tooltipSquadra": "A07",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "WMX10928",
      "descrizione": "ABP/797",
      "targa": "71639",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T01:03:50.1220337+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A03",
      "tooltipSquadra": "A16",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "SGN88468",
      "descrizione": "AS/981",
      "targa": "20190",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T05:30:48.0499649+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A45",
      "tooltipSquadra": "A68",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "WTS06000",
      "descrizione": "AS/776",
      "targa": "26603",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T05:06:47.9182061+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A79",
      "tooltipSquadra": "A14",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "HKX34687",
      "descrizione": "APS/182",
      "targa": "84372",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T11:57:29.4053213+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A97",
      "tooltipSquadra": "A50",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "HQD43980",
      "descrizione": "APS/350",
      "targa": "74466",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T08:36:54.4201415+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A41",
      "tooltipSquadra": "A45",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "IIB68228",
      "descrizione": "ABP/752",
      "targa": "13652",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T13:46:08.754433+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A19",
      "tooltipSquadra": "A63",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "HJM22806",
      "descrizione": "AV/830",
      "targa": "09247",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T21:15:06.4245885+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A10",
      "tooltipSquadra": "A00",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "ZJK67668",
      "descrizione": "AS/522",
      "targa": "71366",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T03:34:01.291382+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A23",
      "tooltipSquadra": "A43",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "PKD28225",
      "descrizione": "ABP/577",
      "targa": "94551",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T09:19:59.6410785+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A10",
      "tooltipSquadra": "A06",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "YFX58427",
      "descrizione": "APS/888",
      "targa": "28021",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T02:39:40.131801+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A21",
      "tooltipSquadra": "A65",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "PDH12730",
      "descrizione": "AV/891",
      "targa": "24717",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T08:11:37.4033797+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A97",
      "tooltipSquadra": "A13",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "PTV83448",
      "descrizione": "AV/754",
      "targa": "58225",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T18:15:16.785094+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A25",
      "tooltipSquadra": "A04",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "EVO72431",
      "descrizione": "ABP/511",
      "targa": "85514",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T05:07:20.2769478+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A52",
      "tooltipSquadra": "A85",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "IJC92334",
      "descrizione": "AS/830",
      "targa": "57643",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T20:01:07.8445129+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A32",
      "tooltipSquadra": "A04",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "JVA48916",
      "descrizione": "APS/662",
      "targa": "76739",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T04:36:20.6538009+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A08",
      "tooltipSquadra": "A69",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "OVD35766",
      "descrizione": "AV/710",
      "targa": "15993",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T06:22:07.2076317+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A72",
      "tooltipSquadra": "A93",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "JDG05400",
      "descrizione": "AV/294",
      "targa": "50777",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T12:28:24.4618419+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A09",
      "tooltipSquadra": "A65",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "HSA07361",
      "descrizione": "APS/128",
      "targa": "99282",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T05:29:46.1106061+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A03",
      "tooltipSquadra": "A54",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "VDO28458",
      "descrizione": "ABP/394",
      "targa": "46855",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T08:35:05.7543413+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A66",
      "tooltipSquadra": "A41",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "GPU57754",
      "descrizione": "APS/194",
      "targa": "98947",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T01:38:21.373117+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A58",
      "tooltipSquadra": "A59",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "FUP52784",
      "descrizione": "ABP/058",
      "targa": "76540",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T10:50:21.6316277+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A09",
      "tooltipSquadra": "A82",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "HWH38334",
      "descrizione": "APS/983",
      "targa": "91917",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T13:49:34.2817788+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A66",
      "tooltipSquadra": "A43",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "RES45970",
      "descrizione": "AS/249",
      "targa": "41569",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T21:26:22.9974182+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A16",
      "tooltipSquadra": "A14",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "JRF27228",
      "descrizione": "AS/197",
      "targa": "55534",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T20:23:30.548631+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A00",
      "tooltipSquadra": "A18",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "KEK40406",
      "descrizione": "ABP/356",
      "targa": "67398",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T18:00:10.9663438+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A61",
      "tooltipSquadra": "A13",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "VEY98203",
      "descrizione": "AS/517",
      "targa": "73359",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T11:31:11.8502379+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A52",
      "tooltipSquadra": "A24",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "KRF22122",
      "descrizione": "ABP/780",
      "targa": "57951",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T23:58:25.5396072+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A67",
      "tooltipSquadra": "A33",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "YZC81538",
      "descrizione": "AV/603",
      "targa": "64392",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T02:48:28.7917322+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A05",
      "tooltipSquadra": "A14",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "KAV03740",
      "descrizione": "ABP/786",
      "targa": "98537",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T00:17:02.8517529+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A95",
      "tooltipSquadra": "A54",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "ZGN61110",
      "descrizione": "AS/738",
      "targa": "85448",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T00:04:33.2544505+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A02",
      "tooltipSquadra": "A38",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "EGB15358",
      "descrizione": "AV/661",
      "targa": "36506",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T02:57:53.5419181+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A12",
      "tooltipSquadra": "A19",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "HRQ90315",
      "descrizione": "ABP/290",
      "targa": "99208",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T16:26:47.563582+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A07",
      "tooltipSquadra": "A99",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "FHF11541",
      "descrizione": "AS/742",
      "targa": "32267",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T13:25:39.9997511+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A68",
      "tooltipSquadra": "A34",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "CHK14978",
      "descrizione": "APS/189",
      "targa": "22878",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T15:04:46.5869722+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A73",
      "tooltipSquadra": "A75",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "XSP55705",
      "descrizione": "APS/381",
      "targa": "74086",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T05:08:36.9093568+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A50",
      "tooltipSquadra": "A92",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "CGQ71413",
      "descrizione": "AS/297",
      "targa": "05585",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T12:24:51.9276438+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A15",
      "tooltipSquadra": "A13",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "GAL68525",
      "descrizione": "ABP/063",
      "targa": "45730",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T14:46:57.829542+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A11",
      "tooltipSquadra": "A01",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "PZI60194",
      "descrizione": "AV/338",
      "targa": "16769",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T21:29:28.5653055+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A83",
      "tooltipSquadra": "A86",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "FMY77102",
      "descrizione": "APS/897",
      "targa": "03711",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T08:51:20.6789945+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A10",
      "tooltipSquadra": "A79",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "ZOJ60821",
      "descrizione": "AV/884",
      "targa": "16549",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T05:44:02.3400673+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A39",
      "tooltipSquadra": "A67",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "HYE22257",
      "descrizione": "APS/154",
      "targa": "66689",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T00:40:03.0368976+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A14",
      "tooltipSquadra": "A18",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "PEB44530",
      "descrizione": "AS/617",
      "targa": "59063",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T01:05:20.2855989+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A77",
      "tooltipSquadra": "A08",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "OBL90474",
      "descrizione": "ABP/197",
      "targa": "94946",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T20:11:45.7548605+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A43",
      "tooltipSquadra": "A78",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "LKP94186",
      "descrizione": "AS/747",
      "targa": "53504",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T10:38:40.5904361+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A60",
      "tooltipSquadra": "A96",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "HUB90322",
      "descrizione": "APS/116",
      "targa": "55131",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T11:02:55.412077+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A75",
      "tooltipSquadra": "A09",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "PYJ78241",
      "descrizione": "AV/406",
      "targa": "77117",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T19:07:02.7199961+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A95",
      "tooltipSquadra": "A38",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "LTD98970",
      "descrizione": "APS/469",
      "targa": "56911",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T15:44:00.2457348+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A98",
      "tooltipSquadra": "A38",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "CXX38870",
      "descrizione": "APS/454",
      "targa": "40028",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T19:05:52.3439545+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A73",
      "tooltipSquadra": "A47",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "YZF54366",
      "descrizione": "APS/456",
      "targa": "37001",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T14:54:19.7679548+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A15",
      "tooltipSquadra": "A32",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "RWU59879",
      "descrizione": "ABP/223",
      "targa": "99577",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T05:55:57.864692+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A86",
      "tooltipSquadra": "A70",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "EZD38376",
      "descrizione": "APS/983",
      "targa": "87390",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T03:57:38.3988275+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A01",
      "tooltipSquadra": "A53",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "KFY82856",
      "descrizione": "AS/198",
      "targa": "59291",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T07:11:21.3971048+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": true,
      "descrizioneSquadra": "A90",
      "tooltipSquadra": "A78",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "JIA87132",
      "descrizione": "AV/296",
      "targa": "36344",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T18:17:19.0920383+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A29",
      "tooltipSquadra": "A68",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "UCQ09577",
      "descrizione": "AV/637",
      "targa": "87950",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T18:12:54.0591969+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A01",
      "tooltipSquadra": "A11",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "WHB94342",
      "descrizione": "AS/150",
      "targa": "60835",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T14:55:56.6970573+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A05",
      "tooltipSquadra": "A15",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "AGN04521",
      "descrizione": "ABP/088",
      "targa": "63441",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T06:59:15.2248211+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A25",
      "tooltipSquadra": "A58",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "JWF50193",
      "descrizione": "AS/581",
      "targa": "98751",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T13:41:30.64037+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A99",
      "tooltipSquadra": "A85",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "CTY43214",
      "descrizione": "AV/331",
      "targa": "10645",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T15:47:38.5138694+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A82",
      "tooltipSquadra": "A24",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "CSR86443",
      "descrizione": "APS/259",
      "targa": "00830",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T06:41:50.6368032+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A86",
      "tooltipSquadra": "A22",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "JDD34480",
      "descrizione": "APS/152",
      "targa": "33593",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T08:21:51.8916015+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A89",
      "tooltipSquadra": "A24",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "DXW05634",
      "descrizione": "APS/071",
      "targa": "05581",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T12:51:55.2411785+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A21",
      "tooltipSquadra": "A58",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "PCV09580",
      "descrizione": "APS/469",
      "targa": "57921",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T04:40:32.3152639+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A67",
      "tooltipSquadra": "A41",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "UZI25426",
      "descrizione": "ABP/426",
      "targa": "00093",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T03:58:37.8199093+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A41",
      "tooltipSquadra": "A61",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "FIB43610",
      "descrizione": "APS/791",
      "targa": "42504",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T14:58:37.2127025+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A52",
      "tooltipSquadra": "A44",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "WXB69622",
      "descrizione": "AS/410",
      "targa": "29484",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T08:22:19.4732664+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A78",
      "tooltipSquadra": "A11",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "QRU39446",
      "descrizione": "AV/068",
      "targa": "43870",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T00:30:42.8088278+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A12",
      "tooltipSquadra": "A32",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "XVK54095",
      "descrizione": "APS/117",
      "targa": "01879",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T08:05:41.6338944+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A55",
      "tooltipSquadra": "A25",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "BXY65801",
      "descrizione": "APS/101",
      "targa": "07677",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T12:46:11.3912187+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A28",
      "tooltipSquadra": "A87",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "GIE08209",
      "descrizione": "APS/399",
      "targa": "83465",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T04:29:07.9393699+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A60",
      "tooltipSquadra": "A13",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "XTN08910",
      "descrizione": "AV/423",
      "targa": "47586",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T07:41:51.2495782+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A60",
      "tooltipSquadra": "A33",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "AJP64129",
      "descrizione": "ABP/995",
      "targa": "54584",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-25T03:24:33.3863746+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A04",
      "tooltipSquadra": "A97",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    },
    {
      "codice": "CHX40613",
      "descrizione": "AV/374",
      "targa": "67331",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T17:27:49.8087217+02:00",
      "codiceRichiestaAssistenza": "",
      "disponibile": false,
      "descrizioneSquadra": "A21",
      "tooltipSquadra": "A82",
      "personeSulMezzo": [],
      "codiciStatoSucc": []
    }
  ]`);
  constructor(private http: Http) { }

  public getMezzi(): Observable<MezzoInServizio[]> {
    return Observable.of(this.mezzi);
  }
}
