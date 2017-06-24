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
      "codice": "ZOG91072",
      "descrizione": "AS/289",
      "targa": "94608",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T12:37:00.5827655+02:00",
      "codiceRichiestaAssistenza": "924.295.896",
      "disponibile": true,
      "descrizioneSquadra": "A24",
      "tooltipSquadra": "A90",
      "personeSulMezzo": [
        {
          "codiceFiscale": "CLRWMY30M99X404G",
          "descrizione": "Rebeka Reinger",
          "tooltip": "CVSZXI50G81W653V",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "KKOMZD76J49W195Q",
          "descrizione": "Carlie Considine",
          "tooltip": "MUOXYB12C34C165L",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "PVPHGY10K62H931M",
          "descrizione": "Erick West",
          "tooltip": "MPKVVP39I72R523O",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FNQTWR40V30Y635P",
          "descrizione": "Reed O'Hara",
          "tooltip": "AURYZV21A70P787D",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TSTIUU99K19C947J",
          "descrizione": "Elroy Wolf",
          "tooltip": "ORYPNM37T20Y113C",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "KEG97584",
      "descrizione": "APS/263",
      "targa": "61245",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T14:09:45.8915024+02:00",
      "codiceRichiestaAssistenza": "575.857.128",
      "disponibile": false,
      "descrizioneSquadra": "A17",
      "tooltipSquadra": "A18",
      "personeSulMezzo": [
        {
          "codiceFiscale": "QZRPPO42O52W851P",
          "descrizione": "Edgar Streich",
          "tooltip": "VFVPVT40Z49G204Y",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "HXGRZG88J78A166B",
          "descrizione": "Wilhelmine Rohan",
          "tooltip": "KVVELL75I97K536A",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "DGOTAJ62Y33O107D",
          "descrizione": "Guiseppe Bernhard",
          "tooltip": "TUGERN85K26M679W",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "QVMOEM42U86R496P",
          "descrizione": "Courtney Greenholt",
          "tooltip": "BXGFUG02X68F229T",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EPTTKT09S77W056Z",
          "descrizione": "Janae Halvorson",
          "tooltip": "QSHDFN69Q44N136A",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "NHO06352",
      "descrizione": "AV/342",
      "targa": "41585",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T11:06:32.29472+02:00",
      "codiceRichiestaAssistenza": "763.628.452",
      "disponibile": true,
      "descrizioneSquadra": "A25",
      "tooltipSquadra": "A88",
      "personeSulMezzo": [
        {
          "codiceFiscale": "EVXLVT86M95C179W",
          "descrizione": "Mitchell Hodkiewicz",
          "tooltip": "FPBSSU32A05E854O",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "FKDQWT72H35I670J",
          "descrizione": "Noemie Eichmann",
          "tooltip": "CFQLMV69U75S114N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "PTIXMN07S37D472K",
          "descrizione": "Marianna Funk",
          "tooltip": "YQUFUZ47P31H203D",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FSDJSD21R27M741Y",
          "descrizione": "Alec Hirthe",
          "tooltip": "NNXAUM45C50E676M",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "OXRYQI29D57D309I",
          "descrizione": "Toy Goldner",
          "tooltip": "RIXHQF66C16E954M",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "IWU92022",
      "descrizione": "AS/174",
      "targa": "25017",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T08:42:13.4683365+02:00",
      "codiceRichiestaAssistenza": "831.816.607",
      "disponibile": false,
      "descrizioneSquadra": "A47",
      "tooltipSquadra": "A35",
      "personeSulMezzo": [
        {
          "codiceFiscale": "JJRWLO48G35X888U",
          "descrizione": "Miguel Hegmann",
          "tooltip": "WDVWWS18L04K471M",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ASCEEN61F86P984U",
          "descrizione": "Lonny Barton",
          "tooltip": "NUDHRA88Y11U382S",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SYIETM32V06Y600Z",
          "descrizione": "Hipolito Quigley",
          "tooltip": "KKDJSS90B27S180Y",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "IBRZJE72A51R345V",
          "descrizione": "Dejuan Gulgowski",
          "tooltip": "PQMULG01J41P197C",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LBZPMS49J83D357J",
          "descrizione": "Jewell Lynch",
          "tooltip": "GGTIBK78Y96O386V",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "WEU21587",
      "descrizione": "AV/596",
      "targa": "09021",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T04:32:07.2162237+02:00",
      "codiceRichiestaAssistenza": "422.496.791",
      "disponibile": false,
      "descrizioneSquadra": "A39",
      "tooltipSquadra": "A27",
      "personeSulMezzo": [
        {
          "codiceFiscale": "MLCWSW12E53D113D",
          "descrizione": "Janie Nolan",
          "tooltip": "OQWJYW51W80N739A",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OGVORZ24K74Z870Q",
          "descrizione": "Waino Cormier",
          "tooltip": "BEAFRI41A58F150X",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZZWCNM76X92M138J",
          "descrizione": "Mozell Weimann",
          "tooltip": "BDGFUG85P24V863Z",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZROMZK49O44J870K",
          "descrizione": "Filomena Cremin",
          "tooltip": "UCVQWD34D48U365T",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "PDVTVS41G46T421G",
          "descrizione": "Garth Parisian",
          "tooltip": "ARIPYI57Q16G074U",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "XYV49561",
      "descrizione": "AV/705",
      "targa": "05254",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T10:31:44.8356269+02:00",
      "codiceRichiestaAssistenza": "295.222.584",
      "disponibile": true,
      "descrizioneSquadra": "A15",
      "tooltipSquadra": "A24",
      "personeSulMezzo": [
        {
          "codiceFiscale": "ILAUXL61X51A933M",
          "descrizione": "Judd Conn",
          "tooltip": "LBQYEM73T24Y048Z",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NJVXTM77S01V048Z",
          "descrizione": "Modesta Gerhold",
          "tooltip": "NVIEBX84Q16E489A",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "OHDEKT72X10B075G",
          "descrizione": "Waldo Reilly",
          "tooltip": "FTZWAD61W79E312E",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ILOKWZ74O19P191V",
          "descrizione": "Katheryn Wiegand",
          "tooltip": "LCBTQW49Z69T566R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UXZEPP52G50A553P",
          "descrizione": "Julianne Koelpin",
          "tooltip": "SYOJBT75J30M292T",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "QYW90349",
      "descrizione": "AV/182",
      "targa": "01471",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T03:19:02.560141+02:00",
      "codiceRichiestaAssistenza": "023.562.594",
      "disponibile": true,
      "descrizioneSquadra": "A08",
      "tooltipSquadra": "A71",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GYUMOX41U62Y492W",
          "descrizione": "Fern Lubowitz",
          "tooltip": "OQWRMB53W08T519V",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "BCIBTP17G43U977I",
          "descrizione": "Micaela Jacobs",
          "tooltip": "HHLAOP09Y67N102H",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "NWHNSU10C11Y245L",
          "descrizione": "Wilhelmine Hackett",
          "tooltip": "CULRRE14X27R431F",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "TPRWMN98A33A609Q",
          "descrizione": "Ezequiel Herzog",
          "tooltip": "FPJOIF82L65C293G",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "FHYSVE71X57T807D",
          "descrizione": "Esteban Kunde",
          "tooltip": "AJRRFN14G10I726D",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "IGN78530",
      "descrizione": "AS/508",
      "targa": "69072",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T01:50:15.9917599+02:00",
      "codiceRichiestaAssistenza": "688.765.672",
      "disponibile": true,
      "descrizioneSquadra": "A29",
      "tooltipSquadra": "A63",
      "personeSulMezzo": [
        {
          "codiceFiscale": "VSEFDJ46U38Y044Y",
          "descrizione": "Jonathan Bergnaum",
          "tooltip": "LJHCLH14A51S750U",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "MMEEBK39P94T000H",
          "descrizione": "Edgar Osinski",
          "tooltip": "PTYYXL16P13Z632A",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GIXUOS20G51Q423G",
          "descrizione": "Judah VonRueden",
          "tooltip": "NHTYUS72Z83T948A",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VEGSWE54Z60Q383M",
          "descrizione": "Augustine Botsford",
          "tooltip": "JCBTMG18V21O206S",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ULPJJT01I45J437N",
          "descrizione": "Watson Lynch",
          "tooltip": "KUMSIT27D76T162I",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "YRH47877",
      "descrizione": "AV/937",
      "targa": "63566",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T21:27:15.9686739+02:00",
      "codiceRichiestaAssistenza": "009.343.726",
      "disponibile": true,
      "descrizioneSquadra": "A74",
      "tooltipSquadra": "A20",
      "personeSulMezzo": [
        {
          "codiceFiscale": "ZVNTMO00H49K056G",
          "descrizione": "Emmy Ritchie",
          "tooltip": "YRJOHS92X87M761B",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OATSGJ60O31B145B",
          "descrizione": "Claire Ward",
          "tooltip": "HFAOIC15A27V548T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GKAXHE50W73Z742L",
          "descrizione": "Trycia DuBuque",
          "tooltip": "MLPDUR77N65I678Y",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JXWZHG32B53P056G",
          "descrizione": "Dena Schmitt",
          "tooltip": "GFGNLB42J61X478O",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "MEITOP23Y50S450H",
          "descrizione": "Diamond Hickle",
          "tooltip": "JLYVAA58Q88E935T",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "CVF62681",
      "descrizione": "AV/640",
      "targa": "84959",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T04:08:29.7334206+02:00",
      "codiceRichiestaAssistenza": "454.925.337",
      "disponibile": false,
      "descrizioneSquadra": "A40",
      "tooltipSquadra": "A09",
      "personeSulMezzo": [
        {
          "codiceFiscale": "TSMCJV08I22S746N",
          "descrizione": "Frederic Harris",
          "tooltip": "IZUQWP50K12L851S",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VWTINK75Y76T505O",
          "descrizione": "Amparo Anderson",
          "tooltip": "BPNUTP60V32O685N",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ALKXIR84R52Y241T",
          "descrizione": "Myrtie Herzog",
          "tooltip": "BZSVIX17E98B401B",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "EGVYIX18X07K911F",
          "descrizione": "Green Kub",
          "tooltip": "QBZEYQ48M78E462P",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "CQVRNA19U07W266U",
          "descrizione": "Tony Kutch",
          "tooltip": "CWIWCS00W37T507H",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "VMC64256",
      "descrizione": "APS/260",
      "targa": "65080",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T14:29:37.9430414+02:00",
      "codiceRichiestaAssistenza": "664.967.779",
      "disponibile": false,
      "descrizioneSquadra": "A21",
      "tooltipSquadra": "A65",
      "personeSulMezzo": [
        {
          "codiceFiscale": "ZZFCXM30C57I710D",
          "descrizione": "Autumn Breitenberg",
          "tooltip": "CSABZT38F98X972S",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XSIJSW82Y99F064V",
          "descrizione": "Maurine Mosciski",
          "tooltip": "YFIORE12S85K339F",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SZDDSV39Z81L006T",
          "descrizione": "Paul Yost",
          "tooltip": "EQEPQF43N59C406Z",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UNMETF20G74S659Q",
          "descrizione": "Darrell Little",
          "tooltip": "JMYHLW30U63L008A",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZXZJOY68U83D881M",
          "descrizione": "Deborah Hirthe",
          "tooltip": "FBHJDL39I36T545G",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "BNR68536",
      "descrizione": "APS/351",
      "targa": "35945",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T08:16:10.8336247+02:00",
      "codiceRichiestaAssistenza": "851.207.589",
      "disponibile": true,
      "descrizioneSquadra": "A18",
      "tooltipSquadra": "A73",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GMVOMG84U53A782J",
          "descrizione": "Clementina Kunze",
          "tooltip": "CRBSZI09L89M987O",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SOMSKD56H72W548B",
          "descrizione": "Fidel Ferry",
          "tooltip": "TWGKHK67C41B310M",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "JGXDJA36O35R854K",
          "descrizione": "Earnest Kohler",
          "tooltip": "DEIUJM11R96L980Z",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "QMFCQV22L66P995A",
          "descrizione": "Pearline Upton",
          "tooltip": "MOQFWQ78W57V541Q",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "BNNNCB45B07W910Y",
          "descrizione": "Johnathon Powlowski",
          "tooltip": "GJLXYL76V01T267T",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "ORC95675",
      "descrizione": "ABP/649",
      "targa": "96060",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T14:15:57.504397+02:00",
      "codiceRichiestaAssistenza": "946.786.650",
      "disponibile": true,
      "descrizioneSquadra": "A25",
      "tooltipSquadra": "A24",
      "personeSulMezzo": [
        {
          "codiceFiscale": "OFKNAW28L10C513P",
          "descrizione": "Stanford Stokes",
          "tooltip": "TZWDFB86J57I301L",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "EWTKSQ13P98Z933F",
          "descrizione": "Wilfred Koelpin",
          "tooltip": "CFLDGV26V70J603S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "IHFYWM97K63Z006T",
          "descrizione": "Brad Bashirian",
          "tooltip": "TMOLYJ65O19N638Q",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EIYDNL53V60R993Z",
          "descrizione": "Dakota Walker",
          "tooltip": "VGPGZK54D76H352Y",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "PZCVQN04X29E618W",
          "descrizione": "Ezekiel Dickens",
          "tooltip": "CZTXYL62J61R061P",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "NKO90435",
      "descrizione": "ABP/687",
      "targa": "33310",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T09:40:36.7371893+02:00",
      "codiceRichiestaAssistenza": "103.678.014",
      "disponibile": false,
      "descrizioneSquadra": "A59",
      "tooltipSquadra": "A76",
      "personeSulMezzo": [
        {
          "codiceFiscale": "IONVNG54M57Y105Q",
          "descrizione": "Zane Hudson",
          "tooltip": "XNPPUP67W64N943V",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UHQOTY45S77Z251U",
          "descrizione": "Alysha Pfannerstill",
          "tooltip": "YTGWMR70B85T108F",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ITREHX80W38K146C",
          "descrizione": "Lenna Bogisich",
          "tooltip": "KDWZWJ61Z59M306S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "TMJZLU42R71C147R",
          "descrizione": "Melany Zieme",
          "tooltip": "UVURSX48V44L770V",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "KRCMQS80W45T726G",
          "descrizione": "Candice Gerlach",
          "tooltip": "VRCYXR72I44C514H",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "BBI07174",
      "descrizione": "ABP/564",
      "targa": "46938",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T22:42:44.9834143+02:00",
      "codiceRichiestaAssistenza": "578.843.718",
      "disponibile": true,
      "descrizioneSquadra": "A39",
      "tooltipSquadra": "A70",
      "personeSulMezzo": [
        {
          "codiceFiscale": "WBWABA85P01O983R",
          "descrizione": "Eleonore Abernathy",
          "tooltip": "OFMIQG95T34O146S",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UKHWQG83Z76Z332B",
          "descrizione": "Payton Nicolas",
          "tooltip": "SGTDLD21M01I166N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "SPGNIG19T00J069I",
          "descrizione": "Tyson Sawayn",
          "tooltip": "HWSKBJ28L42R863C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "FYMZMJ11C94I878M",
          "descrizione": "Elvis Schmeler",
          "tooltip": "EFDBKT44J17R591T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "HJIFWG23C65U335B",
          "descrizione": "Roy Weimann",
          "tooltip": "XCGAXV93I93Q909A",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "QUX57404",
      "descrizione": "AV/946",
      "targa": "09967",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T15:55:33.798357+02:00",
      "codiceRichiestaAssistenza": "026.940.343",
      "disponibile": true,
      "descrizioneSquadra": "A05",
      "tooltipSquadra": "A96",
      "personeSulMezzo": [
        {
          "codiceFiscale": "WQEDBP20G19F433I",
          "descrizione": "Allison Kerluke",
          "tooltip": "BHPKAT59S37H190F",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VKLEKD79T93S270H",
          "descrizione": "Blaise Buckridge",
          "tooltip": "FDJMRM64X83J178F",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "WWLSDA65A00G879X",
          "descrizione": "Haskell Hermann",
          "tooltip": "XUSSQV04P29K507G",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "NAJXCL54R05K134U",
          "descrizione": "Bridie Ruecker",
          "tooltip": "DVWBOZ20S42B570X",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ARGDDD09F06Y780B",
          "descrizione": "Baylee Altenwerth",
          "tooltip": "ZVXVJX94Y96D417D",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "UEL77304",
      "descrizione": "AS/195",
      "targa": "98273",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T04:40:26.6311672+02:00",
      "codiceRichiestaAssistenza": "602.321.882",
      "disponibile": true,
      "descrizioneSquadra": "A92",
      "tooltipSquadra": "A87",
      "personeSulMezzo": [
        {
          "codiceFiscale": "CIXZEC69D20W400E",
          "descrizione": "Odessa Klocko",
          "tooltip": "GATNAW62F29R513N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "KBAEYD96G45W005T",
          "descrizione": "Macie Buckridge",
          "tooltip": "UWCNXL71O57D537J",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "CCPPKQ16I19C852D",
          "descrizione": "Trevor Kulas",
          "tooltip": "NDSFZJ15I05H617O",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "EMMJFD51M62Y342B",
          "descrizione": "Sallie Swaniawski",
          "tooltip": "XPGHCV67X38C923T",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "EXPQVW43K61Z538D",
          "descrizione": "Bradley Deckow",
          "tooltip": "EKNOIR85P27Z622R",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "LZR97517",
      "descrizione": "ABP/806",
      "targa": "57658",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T07:02:04.1281857+02:00",
      "codiceRichiestaAssistenza": "018.846.329",
      "disponibile": true,
      "descrizioneSquadra": "A64",
      "tooltipSquadra": "A69",
      "personeSulMezzo": [
        {
          "codiceFiscale": "WKNJPC56U10K467V",
          "descrizione": "Isabel Schultz",
          "tooltip": "POHWDY77H12K824F",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MVPUPE72M50X625Q",
          "descrizione": "Estrella Ruecker",
          "tooltip": "OKKWIH45T11A404Z",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VZDBXM17J59X297Q",
          "descrizione": "Deion Waelchi",
          "tooltip": "ZGMDPB03O59E252N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MNYSQY96W81H775X",
          "descrizione": "Afton Denesik",
          "tooltip": "WNZVCP14J63A492T",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "GQOEZF11H71P350F",
          "descrizione": "Torey Turner",
          "tooltip": "SVCMMP95W73O017T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "III73802",
      "descrizione": "AS/338",
      "targa": "55931",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T04:22:16.0855182+02:00",
      "codiceRichiestaAssistenza": "932.721.105",
      "disponibile": false,
      "descrizioneSquadra": "A21",
      "tooltipSquadra": "A94",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GJSBYU11W66W532T",
          "descrizione": "Humberto Langosh",
          "tooltip": "LSDLCH54C13S057T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QJJZYS40L84Z300E",
          "descrizione": "Alvina Reilly",
          "tooltip": "XPTKJB95X53U632U",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "LTKABV79D83R840P",
          "descrizione": "Albin Wintheiser",
          "tooltip": "YAXZEO41A86E299P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XNYRKX12G78T022X",
          "descrizione": "Cristobal Dibbert",
          "tooltip": "UGMQSS15Q07Y808D",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GQAUYI72H73Y367B",
          "descrizione": "Cayla Kozey",
          "tooltip": "WFZHKO14U96E179Y",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "LJE67018",
      "descrizione": "AV/936",
      "targa": "71408",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T05:00:30.975184+02:00",
      "codiceRichiestaAssistenza": "947.572.352",
      "disponibile": true,
      "descrizioneSquadra": "A51",
      "tooltipSquadra": "A10",
      "personeSulMezzo": [
        {
          "codiceFiscale": "EEHZUO92W34Q077M",
          "descrizione": "Concepcion Dietrich",
          "tooltip": "FYSNIY08U95K393T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "PYTLJK44I29V791B",
          "descrizione": "Aisha Littel",
          "tooltip": "QYASTC23Y06S950P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TPICXP88Z25F298H",
          "descrizione": "Lon Kreiger",
          "tooltip": "GAICBM36N92R391H",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NBLVVD97T87X685A",
          "descrizione": "Wallace VonRueden",
          "tooltip": "NHQPYI96P12C681C",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "LEFCGT48P24C392W",
          "descrizione": "Haylee Sipes",
          "tooltip": "LMMXLK54T10M718O",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "TRH48387",
      "descrizione": "ABP/775",
      "targa": "61587",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T12:26:48.4984711+02:00",
      "codiceRichiestaAssistenza": "432.969.276",
      "disponibile": false,
      "descrizioneSquadra": "A76",
      "tooltipSquadra": "A91",
      "personeSulMezzo": [
        {
          "codiceFiscale": "ZVAILT21X71X351P",
          "descrizione": "Cameron Cummings",
          "tooltip": "MLTIPK31W65I830M",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QGEBPU91V30Q083V",
          "descrizione": "Winnifred Fisher",
          "tooltip": "MLYCPI53K25H064N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "LVYKLP91G66Z038G",
          "descrizione": "Ambrose Renner",
          "tooltip": "DPSCKN83C90Q343N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CZJELC86L21L856V",
          "descrizione": "Oleta Sporer",
          "tooltip": "TNWPHV21Z35R849Y",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "YEPFSC61R04Z565U",
          "descrizione": "Maddison Roob",
          "tooltip": "KCIFYX38O29X594V",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "EDR08810",
      "descrizione": "APS/096",
      "targa": "79834",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T02:26:03.7508931+02:00",
      "codiceRichiestaAssistenza": "717.326.962",
      "disponibile": true,
      "descrizioneSquadra": "A29",
      "tooltipSquadra": "A32",
      "personeSulMezzo": [
        {
          "codiceFiscale": "CYLMZE02X49L126W",
          "descrizione": "Libbie Erdman",
          "tooltip": "SMHLOW15Y79V024R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "WHLXLJ92Q74N048Q",
          "descrizione": "Brandy Conroy",
          "tooltip": "NWPUQD49Q91T545T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VBXNJF40L75B313W",
          "descrizione": "Nelda Keebler",
          "tooltip": "NUUZLH24Z90M688H",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ANKIPR73P50L661N",
          "descrizione": "Hudson Williamson",
          "tooltip": "CMFCSM13F91M829T",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "EFCGCS74O23J149G",
          "descrizione": "Zechariah Jones",
          "tooltip": "LRVMIM44B12R926G",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "YVY88755",
      "descrizione": "ABP/623",
      "targa": "19748",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T18:35:38.1926451+02:00",
      "codiceRichiestaAssistenza": "259.423.777",
      "disponibile": true,
      "descrizioneSquadra": "A54",
      "tooltipSquadra": "A13",
      "personeSulMezzo": [
        {
          "codiceFiscale": "DAICKX63Q56M501Z",
          "descrizione": "Murray Kertzmann",
          "tooltip": "AFCSER96G46I532C",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "KVLDJC16E73L440G",
          "descrizione": "Cecil Brekke",
          "tooltip": "IEKLHJ89G01H963I",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "XVAPNN23U02H321B",
          "descrizione": "Casimir Kohler",
          "tooltip": "KETMDW50K38C047H",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TQWEZO86Y79D849I",
          "descrizione": "Darwin Gulgowski",
          "tooltip": "JWSYLW90Y18N980K",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "FEEQLX71H53E715D",
          "descrizione": "Tiffany Connelly",
          "tooltip": "SLHBOX50H92W002A",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "OKR74608",
      "descrizione": "AV/410",
      "targa": "44741",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T18:39:03.6328505+02:00",
      "codiceRichiestaAssistenza": "983.179.166",
      "disponibile": false,
      "descrizioneSquadra": "A62",
      "tooltipSquadra": "A87",
      "personeSulMezzo": [
        {
          "codiceFiscale": "ESFNDS68E13H129R",
          "descrizione": "Wilford Kuphal",
          "tooltip": "ZJBNAR15T46W566U",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "PPFLSN74F97R510C",
          "descrizione": "Griffin Schulist",
          "tooltip": "EEVZFY45H86O474K",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OQNTOL17B85U428Q",
          "descrizione": "Abdul Abbott",
          "tooltip": "PZMGAN55L38C711W",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LQJWMW69M44S874Q",
          "descrizione": "Estevan Veum",
          "tooltip": "KNFAXR31T86G360O",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "SMPPAB11S40P082U",
          "descrizione": "Percy Buckridge",
          "tooltip": "QMECSX18E00V212P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "YXC17895",
      "descrizione": "APS/906",
      "targa": "86226",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T18:07:22.232823+02:00",
      "codiceRichiestaAssistenza": "883.785.396",
      "disponibile": false,
      "descrizioneSquadra": "A68",
      "tooltipSquadra": "A75",
      "personeSulMezzo": [
        {
          "codiceFiscale": "AQBTSF15T49F529X",
          "descrizione": "Euna Huels",
          "tooltip": "AOCQZX73G26X612V",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "AEIFIX32T53S914D",
          "descrizione": "Rogers Schmeler",
          "tooltip": "ZCWZXY31O30H465I",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UFEGTD19O24M524Y",
          "descrizione": "Drew Erdman",
          "tooltip": "EKHZUV96G90J813A",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TJTVZJ06B88V433F",
          "descrizione": "Archibald Hane",
          "tooltip": "GKKVLX95Y63D282N",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ILXYDU08L56A610N",
          "descrizione": "Estevan Hansen",
          "tooltip": "NIXBWC07R59G848T",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "MKW90107",
      "descrizione": "APS/424",
      "targa": "41373",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T13:49:18.7211846+02:00",
      "codiceRichiestaAssistenza": "581.304.308",
      "disponibile": false,
      "descrizioneSquadra": "A27",
      "tooltipSquadra": "A54",
      "personeSulMezzo": [
        {
          "codiceFiscale": "BBTUTL60E95P843R",
          "descrizione": "Callie Schimmel",
          "tooltip": "OPLDPI20C04H898M",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OIARAR14V40Y139C",
          "descrizione": "Liliane Harris",
          "tooltip": "YDMLKP97R76B952P",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WOUYCM80D90I734X",
          "descrizione": "Shaina Grimes",
          "tooltip": "WPCBXM71K04W747T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ZBZPJL97J93O069M",
          "descrizione": "Liam Orn",
          "tooltip": "MXMJHL97C28Y571X",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GGRCED78V97Y281Z",
          "descrizione": "Domenic Toy",
          "tooltip": "RSDKTW45A88Z763J",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "QAX19985",
      "descrizione": "AS/709",
      "targa": "95498",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T10:34:14.4780451+02:00",
      "codiceRichiestaAssistenza": "423.541.892",
      "disponibile": false,
      "descrizioneSquadra": "A00",
      "tooltipSquadra": "A04",
      "personeSulMezzo": [
        {
          "codiceFiscale": "WEECFN38R45F247J",
          "descrizione": "Bill Wintheiser",
          "tooltip": "PEDYUW46A89B416O",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MEPLCO39N75G619G",
          "descrizione": "Austyn Price",
          "tooltip": "GKGTWJ97J10P871Q",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "DCPPUI71T27C109V",
          "descrizione": "Parker Schultz",
          "tooltip": "LSCEUZ84D65M415Y",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RPXATP79G90R093K",
          "descrizione": "Eve Wiegand",
          "tooltip": "XUPYWQ42S39P036D",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "LZMLVT84M65D086X",
          "descrizione": "Mertie Hermiston",
          "tooltip": "QBJHJA63I93I810X",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "ETQ62091",
      "descrizione": "ABP/541",
      "targa": "31004",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T00:33:29.8698687+02:00",
      "codiceRichiestaAssistenza": "630.520.614",
      "disponibile": true,
      "descrizioneSquadra": "A37",
      "tooltipSquadra": "A69",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GKGPQF57K42I769T",
          "descrizione": "Kenya Senger",
          "tooltip": "HLAUKM90K86F138J",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZPVDKA72F64J041B",
          "descrizione": "Gilda Walker",
          "tooltip": "PWCSFD87G00Z309P",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "DAACDH25B82A198E",
          "descrizione": "Esmeralda Will",
          "tooltip": "XQANGL21T12C890G",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NSVMQB05F90B179S",
          "descrizione": "Emerald Hettinger",
          "tooltip": "NTQYCN47S30B609V",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "LAZLRF21R05D166E",
          "descrizione": "Gerald Keeling",
          "tooltip": "TTYFHJ21X40D976W",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "VKF52435",
      "descrizione": "APS/366",
      "targa": "80192",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T04:08:12.1067399+02:00",
      "codiceRichiestaAssistenza": "659.434.860",
      "disponibile": false,
      "descrizioneSquadra": "A86",
      "tooltipSquadra": "A72",
      "personeSulMezzo": [
        {
          "codiceFiscale": "IILCUC80U97O945Y",
          "descrizione": "Denis Hackett",
          "tooltip": "NLAQJH22N52S694I",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "KOJAQG52V71H711K",
          "descrizione": "Reid Mayert",
          "tooltip": "SCUMWG45G15K134W",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "NUTDCL50G80N219A",
          "descrizione": "John Kemmer",
          "tooltip": "BMTDRH12J09H243H",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "PZIZVA65S93M189G",
          "descrizione": "Maryjane Larson",
          "tooltip": "RCWYED03O80W814X",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CRSNDO29W90H078N",
          "descrizione": "Beth Kassulke",
          "tooltip": "BEWUSB76B43P950P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "GCG28393",
      "descrizione": "AV/145",
      "targa": "63523",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T19:13:52.9082158+02:00",
      "codiceRichiestaAssistenza": "001.302.804",
      "disponibile": false,
      "descrizioneSquadra": "A31",
      "tooltipSquadra": "A04",
      "personeSulMezzo": [
        {
          "codiceFiscale": "ZMLIYP74T92B135T",
          "descrizione": "Cathrine Welch",
          "tooltip": "ZARNIO87U15V198B",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "BDQEOS56D22U350U",
          "descrizione": "Alfonzo Kiehn",
          "tooltip": "YDUDXY32C00H290C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VMZZQK55Z79U494T",
          "descrizione": "Luna Morar",
          "tooltip": "ZSFGML60Z98J420F",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ZMJQJY52I61W533V",
          "descrizione": "Rudolph Anderson",
          "tooltip": "FNNAJO51J55J744R",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JIHRGD99C45Z630P",
          "descrizione": "Noble Schoen",
          "tooltip": "LZBUTF67H34B629N",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "MEQ39131",
      "descrizione": "ABP/656",
      "targa": "68596",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T02:05:07.1813892+02:00",
      "codiceRichiestaAssistenza": "662.692.554",
      "disponibile": false,
      "descrizioneSquadra": "A39",
      "tooltipSquadra": "A75",
      "personeSulMezzo": [
        {
          "codiceFiscale": "FOAKOP61V75Y274J",
          "descrizione": "Kole Bahringer",
          "tooltip": "DVBSAK98V76F398M",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "HJRXKR77S28X516Q",
          "descrizione": "Dayna Klein",
          "tooltip": "VAZRUU31O29K231H",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "FLKYGS69Y25O673I",
          "descrizione": "Dell DuBuque",
          "tooltip": "RXDANE57W65J891A",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "XUHAWW15A52A909Z",
          "descrizione": "Will Murray",
          "tooltip": "KXTRZT33W65O635J",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RAGXXE94W64K804Z",
          "descrizione": "Lindsey Spinka",
          "tooltip": "CHGONG94A56K759I",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "XSX47507",
      "descrizione": "AS/982",
      "targa": "26080",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T06:00:41.6498112+02:00",
      "codiceRichiestaAssistenza": "772.373.476",
      "disponibile": false,
      "descrizioneSquadra": "A27",
      "tooltipSquadra": "A96",
      "personeSulMezzo": [
        {
          "codiceFiscale": "DWNJTJ86U19Y886N",
          "descrizione": "Clarabelle Denesik",
          "tooltip": "EBWZXU67M16V815Q",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZZBPDW87Z03O267U",
          "descrizione": "Meaghan Champlin",
          "tooltip": "XPPDQK41H17H287F",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "PXABEU63Y99B044K",
          "descrizione": "Velma Brakus",
          "tooltip": "WKERSP62T07L459D",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VLVNGL51G02W886V",
          "descrizione": "Ewell Kohler",
          "tooltip": "FIMNOW32M54E311D",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "JETDMJ69W18T624S",
          "descrizione": "Ahmed Tillman",
          "tooltip": "YGQXGB67X96R702Z",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "ZDI78276",
      "descrizione": "AS/701",
      "targa": "62678",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T17:11:31.6712968+02:00",
      "codiceRichiestaAssistenza": "127.737.240",
      "disponibile": true,
      "descrizioneSquadra": "A51",
      "tooltipSquadra": "A48",
      "personeSulMezzo": [
        {
          "codiceFiscale": "YBHAPQ79H84E253Z",
          "descrizione": "Enrico Walter",
          "tooltip": "AEZAMF67Q10N055G",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RSBNOU91N76D134Y",
          "descrizione": "Barney Tromp",
          "tooltip": "AUVZWC72H45R215Q",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NPEAJR80N06C046G",
          "descrizione": "Daisy Parisian",
          "tooltip": "TFKVNS69B49Q727O",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZLEDTO76E41A098U",
          "descrizione": "Jamarcus Bauch",
          "tooltip": "URISSU65J98J934F",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "PLVCXN28B40V976L",
          "descrizione": "Justyn Brekke",
          "tooltip": "TLICAJ63A26N650W",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "TGN59174",
      "descrizione": "APS/264",
      "targa": "86734",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T01:10:15.4507754+02:00",
      "codiceRichiestaAssistenza": "835.422.387",
      "disponibile": false,
      "descrizioneSquadra": "A93",
      "tooltipSquadra": "A87",
      "personeSulMezzo": [
        {
          "codiceFiscale": "WJWHOP85U72I771D",
          "descrizione": "Bethel Schuster",
          "tooltip": "GLXNPG23I13A262Z",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FRRNIY49X86U210H",
          "descrizione": "Rasheed Rice",
          "tooltip": "VGAHHN34T06N804X",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "TDZBQJ46O92Y985B",
          "descrizione": "Clemmie Kiehn",
          "tooltip": "KJAYMS92J86U193C",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TQRXQZ42U18Z790T",
          "descrizione": "Neal Marks",
          "tooltip": "ENJRDB88D09O790L",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "MTAMFX83J07U427J",
          "descrizione": "Hal Kohler",
          "tooltip": "ZNVVDI27O00R412G",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "RTB35774",
      "descrizione": "APS/223",
      "targa": "74314",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-23T23:54:44.1536856+02:00",
      "codiceRichiestaAssistenza": "560.896.991",
      "disponibile": true,
      "descrizioneSquadra": "A33",
      "tooltipSquadra": "A94",
      "personeSulMezzo": [
        {
          "codiceFiscale": "SEZEUD00Z70V650L",
          "descrizione": "Eugenia Gerhold",
          "tooltip": "XUOJIN43I77I877V",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "RFNWWE21M67I829J",
          "descrizione": "Amani Tillman",
          "tooltip": "UQQHUS32J10Y763Q",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "BXJDFB85A84J478R",
          "descrizione": "Macey Jones",
          "tooltip": "XTDNZW94R06O693A",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RLPLES57A62B099P",
          "descrizione": "Carleton Hane",
          "tooltip": "KKHGPE53H84E798Z",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LOLAGV21P97P979C",
          "descrizione": "Kellen Jakubowski",
          "tooltip": "FZGQJF85N51F991S",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "PPQ68616",
      "descrizione": "APS/764",
      "targa": "00179",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T21:32:31.9551006+02:00",
      "codiceRichiestaAssistenza": "345.741.907",
      "disponibile": false,
      "descrizioneSquadra": "A77",
      "tooltipSquadra": "A84",
      "personeSulMezzo": [
        {
          "codiceFiscale": "EGYGOR07O99I887K",
          "descrizione": "Danielle Rau",
          "tooltip": "VKPSEG71V90B690E",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "MWMXJG43K75Z241N",
          "descrizione": "General Effertz",
          "tooltip": "NUAUNF75W23V657S",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "YBIGVV05V66Y168P",
          "descrizione": "Mack Stehr",
          "tooltip": "CZROTP00Y94N624L",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "HYETZK18X17A099G",
          "descrizione": "Mylene Blick",
          "tooltip": "MPQUTC64D96Q163J",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "IZGKWS93X84O454D",
          "descrizione": "Maeve Nicolas",
          "tooltip": "DLRIZA92O53S509K",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "EUX54120",
      "descrizione": "ABP/375",
      "targa": "33675",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T19:24:34.3522426+02:00",
      "codiceRichiestaAssistenza": "077.786.623",
      "disponibile": true,
      "descrizioneSquadra": "A19",
      "tooltipSquadra": "A36",
      "personeSulMezzo": [
        {
          "codiceFiscale": "OXSHBM50M41I539W",
          "descrizione": "Dario Boyle",
          "tooltip": "KTTWMN66Q99Z989L",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "MUECEX43B22D033K",
          "descrizione": "Stella Hilpert",
          "tooltip": "AFTLWX14M14Q818T",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "IOVLEM34N86P595Q",
          "descrizione": "Rafaela Ruecker",
          "tooltip": "JIECLY16Q39F518P",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "OBHBLK28X54C231A",
          "descrizione": "Tia Ernser",
          "tooltip": "MKNZWT05R04T476G",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "IXUVQA61N06D516M",
          "descrizione": "Ervin Mayert",
          "tooltip": "CLIIXO74U03P135P",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "FAX54319",
      "descrizione": "AS/811",
      "targa": "25541",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T09:11:49.6971198+02:00",
      "codiceRichiestaAssistenza": "301.690.582",
      "disponibile": true,
      "descrizioneSquadra": "A44",
      "tooltipSquadra": "A63",
      "personeSulMezzo": [
        {
          "codiceFiscale": "SUOTUC39A21R095Y",
          "descrizione": "Opal Metz",
          "tooltip": "TLJXXN40O48M788S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WFXGXG65E11Y594Y",
          "descrizione": "Kennedi Olson",
          "tooltip": "XQGIBT52T38F222X",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MNDGJJ38Q88C721J",
          "descrizione": "Flossie Zieme",
          "tooltip": "WVNJAW13X96H002C",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "RGXZFD63R55B992G",
          "descrizione": "Josefina Torp",
          "tooltip": "ECJGBK99P80O101S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XQJRRF57W07Z843D",
          "descrizione": "Uriel Bruen",
          "tooltip": "AVOHEC56A49T254Q",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "OYE60510",
      "descrizione": "AS/528",
      "targa": "69916",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T01:52:58.515246+02:00",
      "codiceRichiestaAssistenza": "103.693.315",
      "disponibile": true,
      "descrizioneSquadra": "A25",
      "tooltipSquadra": "A51",
      "personeSulMezzo": [
        {
          "codiceFiscale": "LSDKNA39N50V386V",
          "descrizione": "Samir Mayert",
          "tooltip": "YKYFOC06R61S715R",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "HKIZFB65T99P757P",
          "descrizione": "Carley Bruen",
          "tooltip": "MOHMIS33U27V235O",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "YFWOZJ16C86Z194D",
          "descrizione": "Russell Purdy",
          "tooltip": "YZHVTW20B72E056F",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "YOYIQQ47V17L048O",
          "descrizione": "Deangelo Wiegand",
          "tooltip": "JDRSJB98S64M755Y",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "PIRJAB12Q67I437O",
          "descrizione": "Kaitlin Kuvalis",
          "tooltip": "WOHSTT13S09P574Q",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "KGC31171",
      "descrizione": "AS/427",
      "targa": "86897",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T06:50:38.0342353+02:00",
      "codiceRichiestaAssistenza": "906.253.696",
      "disponibile": true,
      "descrizioneSquadra": "A01",
      "tooltipSquadra": "A08",
      "personeSulMezzo": [
        {
          "codiceFiscale": "OKQHMW46J92Y895W",
          "descrizione": "Hertha Weissnat",
          "tooltip": "ZCJFYE86E97D466L",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ABLEGG94M38N220I",
          "descrizione": "Belle Koss",
          "tooltip": "ESCPFH76V82F598K",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VVCGNR48R65B151G",
          "descrizione": "Horacio Hamill",
          "tooltip": "MFXNQD52F25L714H",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XFKCJP00T76A255N",
          "descrizione": "Hubert Rath",
          "tooltip": "HMDYLH50F79S251N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JWHMOJ85E00Y276J",
          "descrizione": "Emmy Moen",
          "tooltip": "GZUUNW38Z34C040B",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "DNB24109",
      "descrizione": "AS/816",
      "targa": "00818",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T06:31:07.4557923+02:00",
      "codiceRichiestaAssistenza": "257.856.075",
      "disponibile": true,
      "descrizioneSquadra": "A90",
      "tooltipSquadra": "A02",
      "personeSulMezzo": [
        {
          "codiceFiscale": "MRZECQ24P86Y425H",
          "descrizione": "Kaitlin Kutch",
          "tooltip": "UVGSHE74P07F421T",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RKZUIZ48Y64J797F",
          "descrizione": "Alexander Treutel",
          "tooltip": "ZSAKEQ48P17H565W",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ZNHHLF00G27L212N",
          "descrizione": "Sherwood Bashirian",
          "tooltip": "AUEXCU62K86G167A",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SGVJDK11D95A084F",
          "descrizione": "Annalise Prohaska",
          "tooltip": "PEMVZQ15A67N185E",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QQUSZQ76J88T960F",
          "descrizione": "Oscar Schimmel",
          "tooltip": "LVTZUE53K41M673K",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "GIS27149",
      "descrizione": "ABP/322",
      "targa": "02387",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T18:12:52.5148589+02:00",
      "codiceRichiestaAssistenza": "179.399.695",
      "disponibile": false,
      "descrizioneSquadra": "A32",
      "tooltipSquadra": "A50",
      "personeSulMezzo": [
        {
          "codiceFiscale": "XPJJON60X81Y407Q",
          "descrizione": "Gabrielle Homenick",
          "tooltip": "KCITOT00Y42E947F",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZLKAXR61J82R661R",
          "descrizione": "Lafayette Beier",
          "tooltip": "WVPNMS66Q14R850K",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JERCLK27G85A387Q",
          "descrizione": "Eldridge Ryan",
          "tooltip": "YXHHZZ99D41P225F",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TJFISL71Q85Y122Z",
          "descrizione": "Zaria Effertz",
          "tooltip": "XRDNLC31H27T687N",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "QEVOWJ03E28I223D",
          "descrizione": "Willie Farrell",
          "tooltip": "VTGIIM88D80L788J",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "XDH99535",
      "descrizione": "AS/850",
      "targa": "45009",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T02:21:38.3734298+02:00",
      "codiceRichiestaAssistenza": "858.543.850",
      "disponibile": true,
      "descrizioneSquadra": "A81",
      "tooltipSquadra": "A12",
      "personeSulMezzo": [
        {
          "codiceFiscale": "QKWIRI20M82T329V",
          "descrizione": "Emerson Herzog",
          "tooltip": "ESGVFP58I15N706G",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FUBQMP12E28W311W",
          "descrizione": "Bridgette Cruickshank",
          "tooltip": "PQTCNX89I56Q988C",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OFQRYL39L83K895V",
          "descrizione": "Jerry Herzog",
          "tooltip": "ROSPPU74P80M059O",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "YSHSOL06Y67C134Q",
          "descrizione": "Stacey Howe",
          "tooltip": "QAWGYU03I38Y350O",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZZHOAW07M77B465T",
          "descrizione": "Emory Raynor",
          "tooltip": "LIYNBS20T35B774Y",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "IHR29236",
      "descrizione": "AV/239",
      "targa": "86574",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T05:59:40.8249397+02:00",
      "codiceRichiestaAssistenza": "234.280.428",
      "disponibile": false,
      "descrizioneSquadra": "A69",
      "tooltipSquadra": "A42",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GSCGCQ23K38J727H",
          "descrizione": "Krista Lockman",
          "tooltip": "ZIGGFX83Q70Y524A",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "YTKEWK49Y67Y664U",
          "descrizione": "Brian Stark",
          "tooltip": "LXJHGQ63J20H208Q",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "UMVUFZ16R03N716Z",
          "descrizione": "Dakota Langworth",
          "tooltip": "MDOFAC68J49T063I",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QRKCQY59V59R283B",
          "descrizione": "Eldred Hayes",
          "tooltip": "GUSOCW17I38L828P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "KNPRBH19R20K939C",
          "descrizione": "Cali Hirthe",
          "tooltip": "CHFLFF69D14L259X",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "EZS93547",
      "descrizione": "ABP/072",
      "targa": "39643",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T11:21:26.7009608+02:00",
      "codiceRichiestaAssistenza": "046.781.144",
      "disponibile": true,
      "descrizioneSquadra": "A78",
      "tooltipSquadra": "A45",
      "personeSulMezzo": [
        {
          "codiceFiscale": "PQNSCB44H24R439Q",
          "descrizione": "Orlando Bartell",
          "tooltip": "SFCJCK49F80I032M",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "BUDRXE18J38U100U",
          "descrizione": "Iliana Feeney",
          "tooltip": "GLHRBF62X43E915T",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "BIYFFB01L69I280Z",
          "descrizione": "Kiel Nitzsche",
          "tooltip": "DBLHXF49E96R372K",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "AGGPXU92P14E958Z",
          "descrizione": "Branson Lakin",
          "tooltip": "AAATBY27A55B414O",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ODRJPQ25Z90U366V",
          "descrizione": "Shyann Lebsack",
          "tooltip": "MFRRZX70C00N045P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "YHS22836",
      "descrizione": "AS/149",
      "targa": "54577",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T21:20:05.5710481+02:00",
      "codiceRichiestaAssistenza": "285.928.464",
      "disponibile": false,
      "descrizioneSquadra": "A40",
      "tooltipSquadra": "A14",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GCQARS32R41T386N",
          "descrizione": "Kenyatta Ernser",
          "tooltip": "XFENVG09V69J807Z",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XQECKU43L00V576J",
          "descrizione": "Ignacio Parker",
          "tooltip": "PVTOTP57C37Q886R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VVKCLV99Z11T450Y",
          "descrizione": "Damien Boehm",
          "tooltip": "BLMVBI07L20X008Q",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MJYOVP45I81P955O",
          "descrizione": "Kameron Carroll",
          "tooltip": "AITJBO69G17R912S",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MPXKNZ16V24K547I",
          "descrizione": "Rylee Heathcote",
          "tooltip": "AXADRE36F13Q883B",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "SKM86296",
      "descrizione": "ABP/954",
      "targa": "22668",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T12:18:42.3547473+02:00",
      "codiceRichiestaAssistenza": "399.624.422",
      "disponibile": true,
      "descrizioneSquadra": "A65",
      "tooltipSquadra": "A57",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GOAVMH71H74G507X",
          "descrizione": "Brandi Bernhard",
          "tooltip": "BFJQJF92T93M777B",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WVESAY39T04Y640V",
          "descrizione": "Bethany Pfeffer",
          "tooltip": "YQQPAA29G64T939G",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JELGLL88V28K960E",
          "descrizione": "Hillary Hane",
          "tooltip": "GDRUYC22G45U184T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RFEREF01W78S895A",
          "descrizione": "Aditya Gleichner",
          "tooltip": "KMDDFQ42L65N956T",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "OZMTVG54O66E181B",
          "descrizione": "Beau Zulauf",
          "tooltip": "BZASZP42F91C149L",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "CVO25738",
      "descrizione": "APS/353",
      "targa": "65089",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T14:17:10.3103587+02:00",
      "codiceRichiestaAssistenza": "462.015.241",
      "disponibile": true,
      "descrizioneSquadra": "A54",
      "tooltipSquadra": "A30",
      "personeSulMezzo": [
        {
          "codiceFiscale": "LIRMFY94H94V074Z",
          "descrizione": "Grant Shields",
          "tooltip": "ASNGWF27H05H449A",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "PXPJBW45N46C534K",
          "descrizione": "Sammy Crooks",
          "tooltip": "BVHYFP37Q03B704V",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QQRUIR70F52W068C",
          "descrizione": "Dulce Quitzon",
          "tooltip": "ZKTSDV51K90C440F",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "HNQECK84U07G677N",
          "descrizione": "Velva Willms",
          "tooltip": "XOZVMJ11M73Y328Z",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UHJXRA44D32I950I",
          "descrizione": "Liana Pacocha",
          "tooltip": "REUYGJ64B39T758E",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "FWX18880",
      "descrizione": "AS/411",
      "targa": "43790",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T13:45:25.7657093+02:00",
      "codiceRichiestaAssistenza": "616.549.315",
      "disponibile": true,
      "descrizioneSquadra": "A54",
      "tooltipSquadra": "A72",
      "personeSulMezzo": [
        {
          "codiceFiscale": "PUJJEO03G86F225C",
          "descrizione": "Adelle Hodkiewicz",
          "tooltip": "HKMXIX80I43S442C",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "EIKHUH19F89A387F",
          "descrizione": "Boyd Kassulke",
          "tooltip": "XALHOT99E17B217W",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "AQFUJS01H05Z238Z",
          "descrizione": "Judy Grady",
          "tooltip": "AWOWJY74U78P964D",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CRSHLL84F94G264C",
          "descrizione": "Alanna Volkman",
          "tooltip": "TWVOGF44L52V101K",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TLCAXT80O42C865R",
          "descrizione": "Alycia Bailey",
          "tooltip": "CMBABK89C22C181G",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "RYD37635",
      "descrizione": "AV/773",
      "targa": "54410",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T13:28:57.1593632+02:00",
      "codiceRichiestaAssistenza": "901.456.405",
      "disponibile": false,
      "descrizioneSquadra": "A30",
      "tooltipSquadra": "A02",
      "personeSulMezzo": [
        {
          "codiceFiscale": "HCEKGK09B12U720A",
          "descrizione": "Giuseppe McKenzie",
          "tooltip": "BIDXGY43O01Z222Q",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CGHIDN85Y00I081V",
          "descrizione": "Vergie Wisozk",
          "tooltip": "EXMUBO89F94M600I",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TEQARZ43F02V432M",
          "descrizione": "Rachael Bins",
          "tooltip": "MGUHOR54P33Z585F",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EGMKSI86J51F129S",
          "descrizione": "Rowland Bartell",
          "tooltip": "XBJCNV98A70W149Q",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CNLLWI03J20A895G",
          "descrizione": "Sofia Krajcik",
          "tooltip": "EYOTLV93R07F515T",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "LUV99038",
      "descrizione": "AV/326",
      "targa": "53796",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T17:59:49.5665699+02:00",
      "codiceRichiestaAssistenza": "548.625.706",
      "disponibile": true,
      "descrizioneSquadra": "A05",
      "tooltipSquadra": "A32",
      "personeSulMezzo": [
        {
          "codiceFiscale": "LHTDSC96V92H117T",
          "descrizione": "Jan Hartmann",
          "tooltip": "SMVGBR98T31R831D",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ONLVKU96B15H749Y",
          "descrizione": "Elmer Goodwin",
          "tooltip": "BRMUHF37I49B056X",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WCAHJP83M57T808M",
          "descrizione": "Camila Kautzer",
          "tooltip": "TDQBBQ21B47D411L",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "THWYZS70P59F532V",
          "descrizione": "Aubrey Parisian",
          "tooltip": "AZQCMT87K26T668K",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "UEYHBB71V93X604E",
          "descrizione": "Buck Muller",
          "tooltip": "EKFEZJ79T35Q906I",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "XVJ45624",
      "descrizione": "APS/982",
      "targa": "53933",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T05:48:46.4036609+02:00",
      "codiceRichiestaAssistenza": "522.985.099",
      "disponibile": true,
      "descrizioneSquadra": "A33",
      "tooltipSquadra": "A73",
      "personeSulMezzo": [
        {
          "codiceFiscale": "KRNVCH36W23M803S",
          "descrizione": "Blake Schuster",
          "tooltip": "NJUSNJ46N96N835C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "DSGRIB07N91Y672Z",
          "descrizione": "Hershel Leffler",
          "tooltip": "ZZLRRV62S41I989Z",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VATRUW44O29I990N",
          "descrizione": "Kole Schimmel",
          "tooltip": "APWSVI23R21U704P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "IFPGFG33J52H421I",
          "descrizione": "Arnaldo Torphy",
          "tooltip": "HXJNMU24N12L356G",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UJQJNZ71J79R405Q",
          "descrizione": "Damien Windler",
          "tooltip": "RCLAWV11B88V952H",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "LLM87286",
      "descrizione": "AV/625",
      "targa": "57645",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T05:21:20.6139889+02:00",
      "codiceRichiestaAssistenza": "263.893.375",
      "disponibile": true,
      "descrizioneSquadra": "A99",
      "tooltipSquadra": "A02",
      "personeSulMezzo": [
        {
          "codiceFiscale": "HPOXTA63Z38F251Q",
          "descrizione": "Lon Gaylord",
          "tooltip": "EOKZOC08L57P573Z",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZFITKN09L00V359U",
          "descrizione": "Sophia Rosenbaum",
          "tooltip": "PAVSDD82U34W508R",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LEXYPR08Q22R785D",
          "descrizione": "Jaren Rodriguez",
          "tooltip": "NEPOGG59E57K881L",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RKERHN60C65H451N",
          "descrizione": "Jeremie Kiehn",
          "tooltip": "QQSARV38V37O401V",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WWCYEE94X12G337P",
          "descrizione": "Vesta Hayes",
          "tooltip": "KMVZRU72C12H785Q",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "YFP50488",
      "descrizione": "AV/826",
      "targa": "41550",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T04:39:48.192544+02:00",
      "codiceRichiestaAssistenza": "078.940.941",
      "disponibile": false,
      "descrizioneSquadra": "A84",
      "tooltipSquadra": "A84",
      "personeSulMezzo": [
        {
          "codiceFiscale": "HWKHGX70G78H324X",
          "descrizione": "Sherwood Barton",
          "tooltip": "RJOBRH02K11E669U",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QGCEIX79N84I557D",
          "descrizione": "Jermey Kunze",
          "tooltip": "UTAFQI91N26K454G",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "MAQIRU18B55K514B",
          "descrizione": "Broderick Quitzon",
          "tooltip": "ALVKUF78M97D206Z",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "MBFCUH35D74Y347Q",
          "descrizione": "Nikki Bode",
          "tooltip": "QVDXXQ82L23X199R",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "YQNBGC04O63K625I",
          "descrizione": "Rosetta Friesen",
          "tooltip": "DIMYAX27U29K702V",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "CGW06148",
      "descrizione": "ABP/215",
      "targa": "92488",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T12:45:09.6738689+02:00",
      "codiceRichiestaAssistenza": "173.404.741",
      "disponibile": true,
      "descrizioneSquadra": "A26",
      "tooltipSquadra": "A11",
      "personeSulMezzo": [
        {
          "codiceFiscale": "HRHHWJ71W65J486K",
          "descrizione": "Lafayette Denesik",
          "tooltip": "SRKOSO35A27F736W",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "FFCZIH37X67N272B",
          "descrizione": "Frida Kutch",
          "tooltip": "COSNWR91L80T963K",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SIDFXR67N90Y691Z",
          "descrizione": "Tressa Kuvalis",
          "tooltip": "SFIKEX98X78Y327Q",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "XRBVDD90M11P978Y",
          "descrizione": "Efrain Blick",
          "tooltip": "XYHYVT96B67X202B",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "WCEMCL87I81D496G",
          "descrizione": "Diana Schmidt",
          "tooltip": "SFBEMX37F85T695K",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "KDO92720",
      "descrizione": "AS/597",
      "targa": "59624",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T09:51:20.582856+02:00",
      "codiceRichiestaAssistenza": "744.117.976",
      "disponibile": false,
      "descrizioneSquadra": "A04",
      "tooltipSquadra": "A43",
      "personeSulMezzo": [
        {
          "codiceFiscale": "VYTOCQ09Z00Z782G",
          "descrizione": "Rosendo Hauck",
          "tooltip": "CNVDFO26C17K250X",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "OBDXUQ66O19U235X",
          "descrizione": "Leopoldo Langworth",
          "tooltip": "VOZXAY82R84T985H",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ESFNOZ06H84W295W",
          "descrizione": "Marisa Conn",
          "tooltip": "EDYZJY81K09Q024L",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "HZZVIQ98V55F014S",
          "descrizione": "Bernita Harvey",
          "tooltip": "SVPUWR63G35W570K",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "IVICOD25E98F211E",
          "descrizione": "Baby Abbott",
          "tooltip": "FDDRHR42R05A721U",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "NRM01473",
      "descrizione": "AV/656",
      "targa": "73202",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T13:20:29.4260013+02:00",
      "codiceRichiestaAssistenza": "606.942.104",
      "disponibile": true,
      "descrizioneSquadra": "A91",
      "tooltipSquadra": "A30",
      "personeSulMezzo": [
        {
          "codiceFiscale": "MSGSVP08Q37X799A",
          "descrizione": "Edyth Raynor",
          "tooltip": "JXEDOW78R30Z010D",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GQPDFV81S87A064V",
          "descrizione": "Damon Hills",
          "tooltip": "PSVBSI45J77R766A",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "FRJILE91Q23O296V",
          "descrizione": "Mose Reichert",
          "tooltip": "PXVUGL39D93M638A",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "GHQCOS11U57A998P",
          "descrizione": "Jeff Beier",
          "tooltip": "XDWCFV22V72I999M",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "NJCQBQ71D94P088P",
          "descrizione": "Oda Schaefer",
          "tooltip": "ELGHLI45G80B448Z",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "SHT27353",
      "descrizione": "APS/520",
      "targa": "19735",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T02:02:01.9722243+02:00",
      "codiceRichiestaAssistenza": "211.232.063",
      "disponibile": true,
      "descrizioneSquadra": "A90",
      "tooltipSquadra": "A44",
      "personeSulMezzo": [
        {
          "codiceFiscale": "MSDWJO06C72T579H",
          "descrizione": "Charlie Kuhn",
          "tooltip": "QRZLET76J70N530T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JZRBYF98U73Z797D",
          "descrizione": "Jasen Oberbrunner",
          "tooltip": "HYDOYQ90F73M053U",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "PSTNIY03K90U393F",
          "descrizione": "Aurelio Bauch",
          "tooltip": "LTLZER14G24L120X",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "UPEOQF99K34C842O",
          "descrizione": "Anjali Gusikowski",
          "tooltip": "SPVFMT09O95H044I",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "WCFZFH70E39E617T",
          "descrizione": "Dayne Dach",
          "tooltip": "KRUOFL08B46K184E",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "PSA32452",
      "descrizione": "ABP/764",
      "targa": "71722",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-23T23:40:02.9917933+02:00",
      "codiceRichiestaAssistenza": "123.040.595",
      "disponibile": true,
      "descrizioneSquadra": "A98",
      "tooltipSquadra": "A98",
      "personeSulMezzo": [
        {
          "codiceFiscale": "NUKYEF82B73N141U",
          "descrizione": "Pasquale Bailey",
          "tooltip": "QYEFCS80S10C494R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "CGWSUM30F40V051W",
          "descrizione": "Vincenzo Vandervort",
          "tooltip": "OHGICD00R85T768R",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "YDSWAM40W05Y695I",
          "descrizione": "Tobin O'Hara",
          "tooltip": "YTOSMR16S22G836A",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SHTWBG94T26F471U",
          "descrizione": "Rosalind King",
          "tooltip": "LGEVWT86V65Z977F",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "BSHSZY99M75C052Q",
          "descrizione": "Elmore Hilll",
          "tooltip": "LWDFPE71I64T476U",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "GBE76072",
      "descrizione": "AV/620",
      "targa": "57601",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T04:51:18.6319648+02:00",
      "codiceRichiestaAssistenza": "436.929.565",
      "disponibile": true,
      "descrizioneSquadra": "A00",
      "tooltipSquadra": "A69",
      "personeSulMezzo": [
        {
          "codiceFiscale": "OCHOZX14L11O404U",
          "descrizione": "Shayna Keeling",
          "tooltip": "FKFBMI52B14H227X",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JGAKGB06B80Q249X",
          "descrizione": "Dulce Cartwright",
          "tooltip": "BUGKRB20W82Q113N",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "UEDAWG71L90I406O",
          "descrizione": "Clair Murphy",
          "tooltip": "WJIYBE77G94W870M",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "BYZSMQ30N42A597J",
          "descrizione": "Erna Klein",
          "tooltip": "FCVBLM29B15I563D",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "DWSPAQ35F34D546A",
          "descrizione": "Monroe Bruen",
          "tooltip": "WNFFRI99C73F802E",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "GYM95164",
      "descrizione": "AS/278",
      "targa": "15942",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T16:47:39.7139608+02:00",
      "codiceRichiestaAssistenza": "929.869.602",
      "disponibile": true,
      "descrizioneSquadra": "A16",
      "tooltipSquadra": "A36",
      "personeSulMezzo": [
        {
          "codiceFiscale": "CABEPY21K37K230X",
          "descrizione": "Christ McKenzie",
          "tooltip": "XSJZML13U88H962W",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "SBZKWW79W54D797Z",
          "descrizione": "Camila Maggio",
          "tooltip": "BPSLOM35B87A580M",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NVMGOO58R09P946D",
          "descrizione": "Caleb Green",
          "tooltip": "PKXOIS01N93S417Q",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UBEWRU26L92J367N",
          "descrizione": "Vaughn Thiel",
          "tooltip": "HENMLB93K54E898I",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SSCISG08E56Y928A",
          "descrizione": "Jamison Borer",
          "tooltip": "OSVTKV10T44N347G",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "WIT46238",
      "descrizione": "ABP/347",
      "targa": "84120",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-23T23:32:57.9930071+02:00",
      "codiceRichiestaAssistenza": "470.618.964",
      "disponibile": true,
      "descrizioneSquadra": "A03",
      "tooltipSquadra": "A44",
      "personeSulMezzo": [
        {
          "codiceFiscale": "NQAECZ46K57K597G",
          "descrizione": "Rafaela Mills",
          "tooltip": "FVLWAB11G49K263Y",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "NAXNAB04X87J065P",
          "descrizione": "Jeff Rath",
          "tooltip": "TZCXWF24C57G051H",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "SUKUNE33W33V616W",
          "descrizione": "Gino Bergnaum",
          "tooltip": "DBHTQZ91P77W301U",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ZLYONJ81G85Q111W",
          "descrizione": "Horacio Huel",
          "tooltip": "ATUOAS60M98M362K",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ONYWMT05Z56T557J",
          "descrizione": "Shaylee Ullrich",
          "tooltip": "WYWXHK14J29Z753W",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "TBL74270",
      "descrizione": "ABP/730",
      "targa": "66847",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T05:36:46.8653224+02:00",
      "codiceRichiestaAssistenza": "822.757.664",
      "disponibile": true,
      "descrizioneSquadra": "A58",
      "tooltipSquadra": "A52",
      "personeSulMezzo": [
        {
          "codiceFiscale": "SQDKMD88Q72R216O",
          "descrizione": "Quentin Shanahan",
          "tooltip": "GVRZTT07M55H571C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "IBPTVV50A18X343O",
          "descrizione": "Mallory Blanda",
          "tooltip": "RJQKJK21M68C004M",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MAWKRT98O21Z910A",
          "descrizione": "Yasmeen Reilly",
          "tooltip": "RFJOSC41B79W959E",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GSXLMW99M77B007U",
          "descrizione": "Arnoldo Hills",
          "tooltip": "LEIGPW16J14Z998S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "FSNOSP73Z78E146B",
          "descrizione": "London Ankunding",
          "tooltip": "LIOJFQ80S81E270W",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "XKT20939",
      "descrizione": "AS/958",
      "targa": "15667",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T08:03:59.5053679+02:00",
      "codiceRichiestaAssistenza": "387.546.329",
      "disponibile": true,
      "descrizioneSquadra": "A55",
      "tooltipSquadra": "A38",
      "personeSulMezzo": [
        {
          "codiceFiscale": "TOEXCR94K71J973M",
          "descrizione": "Burley Marquardt",
          "tooltip": "HIXOFO60W17Z344O",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "QJZLVO14P60F035K",
          "descrizione": "Mariane Bradtke",
          "tooltip": "AZJLQB26T79L208N",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WMJJUY09R04M973S",
          "descrizione": "Edgardo Murray",
          "tooltip": "YJJOYL66F81F832V",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "QEKKRK21G82B572F",
          "descrizione": "Drake Stiedemann",
          "tooltip": "YLYEHU05W61S972R",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "NRZHTE74E34Z503I",
          "descrizione": "Margaret Bergnaum",
          "tooltip": "ACQPWJ50D32H073U",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "QSC80135",
      "descrizione": "APS/618",
      "targa": "95587",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T16:35:16.7336363+02:00",
      "codiceRichiestaAssistenza": "019.478.019",
      "disponibile": true,
      "descrizioneSquadra": "A03",
      "tooltipSquadra": "A62",
      "personeSulMezzo": [
        {
          "codiceFiscale": "AKYQGZ87M49T711C",
          "descrizione": "Franz Mann",
          "tooltip": "DKSLQS77Q87V827B",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UNWEJL71Y36Y176J",
          "descrizione": "Adalberto Kertzmann",
          "tooltip": "ZHYOGF97Q05Z130P",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "YAHQLU30S69D523T",
          "descrizione": "Paul Rowe",
          "tooltip": "YQYKRE14K56D263B",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "IVEFFN38M52R353T",
          "descrizione": "Barrett Hirthe",
          "tooltip": "QQLHJX40M75E197L",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TKLCVS61T10V459B",
          "descrizione": "Otho Jaskolski",
          "tooltip": "OVISLV19J17S130J",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "EIB62011",
      "descrizione": "AV/209",
      "targa": "93912",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T19:05:15.3009654+02:00",
      "codiceRichiestaAssistenza": "125.384.692",
      "disponibile": true,
      "descrizioneSquadra": "A49",
      "tooltipSquadra": "A19",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GPDWPD44E89E964O",
          "descrizione": "Abdul Funk",
          "tooltip": "GPHDZK12V12W816W",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NGHHPB78C03C341F",
          "descrizione": "Oma Toy",
          "tooltip": "MDMKXP29B00I771M",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZAFIEH18T77S637X",
          "descrizione": "D'angelo Grady",
          "tooltip": "VJSHCT70S53G915U",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "DYFHBV51I46O848M",
          "descrizione": "Clyde Gerlach",
          "tooltip": "SCPLGK33M86B581C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OIWTYK23E78K493N",
          "descrizione": "Christopher Murazik",
          "tooltip": "MYWTLB37K16R356Q",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "GOM03670",
      "descrizione": "AS/824",
      "targa": "06125",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T16:21:55.5058756+02:00",
      "codiceRichiestaAssistenza": "655.886.546",
      "disponibile": false,
      "descrizioneSquadra": "A05",
      "tooltipSquadra": "A42",
      "personeSulMezzo": [
        {
          "codiceFiscale": "FLHHAQ19Y90R001U",
          "descrizione": "Mark Ryan",
          "tooltip": "JYGQOI67M92O438L",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NWBKMT56F14Z710I",
          "descrizione": "Alexandro Daugherty",
          "tooltip": "VTZJWR97K63E595E",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "YMNAYC52N20O137M",
          "descrizione": "Eduardo Little",
          "tooltip": "MFSNZE99Y99F014C",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "UUXVOD77W59M079Q",
          "descrizione": "Henriette Orn",
          "tooltip": "YOWYEP35B94R200M",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RQPVHH49M82G467W",
          "descrizione": "Natalie Towne",
          "tooltip": "VSFFPQ74W74Z229T",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "CMH85793",
      "descrizione": "AV/610",
      "targa": "31900",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T00:16:43.2875541+02:00",
      "codiceRichiestaAssistenza": "215.994.491",
      "disponibile": true,
      "descrizioneSquadra": "A80",
      "tooltipSquadra": "A31",
      "personeSulMezzo": [
        {
          "codiceFiscale": "PQKILD72V16Y318R",
          "descrizione": "Else Bechtelar",
          "tooltip": "PQZTRW00Q27D811R",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OMISRI32R78B373Q",
          "descrizione": "Cale Mayer",
          "tooltip": "WTMIBC00A87G425T",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WYQKLF31O80T105B",
          "descrizione": "Maritza Jakubowski",
          "tooltip": "EGQQHI38O38W986H",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MHGBWN20G67R451Q",
          "descrizione": "Grayson Rau",
          "tooltip": "IJBBIT87A09M790E",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "CJCKHB71X92S349B",
          "descrizione": "Eino Metz",
          "tooltip": "GYHBUF93E07J307H",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "WXN27556",
      "descrizione": "AS/511",
      "targa": "14185",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T19:30:38.7021122+02:00",
      "codiceRichiestaAssistenza": "647.898.332",
      "disponibile": false,
      "descrizioneSquadra": "A58",
      "tooltipSquadra": "A98",
      "personeSulMezzo": [
        {
          "codiceFiscale": "KMLYUL12X17Q308Q",
          "descrizione": "Candice Trantow",
          "tooltip": "AURTGT06I65F387H",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "XDJEAH19Y71S256R",
          "descrizione": "Lauriane Cormier",
          "tooltip": "TEFTUV63Z47P782G",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "WTJOIU25P49O735O",
          "descrizione": "Davon Cummerata",
          "tooltip": "JPIKYF51E38Y385T",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FVKMFG23K64A261N",
          "descrizione": "Gerson Kuvalis",
          "tooltip": "JLIUPC27L66E512B",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XKBEPV87D12V840F",
          "descrizione": "Alice Terry",
          "tooltip": "BVJZNU67N88Z572M",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "ZDN68103",
      "descrizione": "APS/382",
      "targa": "59178",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T22:24:04.6058037+02:00",
      "codiceRichiestaAssistenza": "131.245.454",
      "disponibile": false,
      "descrizioneSquadra": "A16",
      "tooltipSquadra": "A70",
      "personeSulMezzo": [
        {
          "codiceFiscale": "WAICZK80E85L466J",
          "descrizione": "Kailey Romaguera",
          "tooltip": "RXUZLQ96A85H116H",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EMDPOG05W45N248C",
          "descrizione": "Dino Simonis",
          "tooltip": "AWMASV15N32V424J",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "CJNXWU50M50M088F",
          "descrizione": "Enos Auer",
          "tooltip": "MLTJRO25O12U153E",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "DZRMPJ55B24A194R",
          "descrizione": "Peter Harvey",
          "tooltip": "ZWJRFZ91U99U736F",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ZVKUEM91O93H479V",
          "descrizione": "Jessyca Ortiz",
          "tooltip": "IMNSEU51M76N746V",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "KXV45188",
      "descrizione": "ABP/448",
      "targa": "88658",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T00:25:41.0411453+02:00",
      "codiceRichiestaAssistenza": "894.754.129",
      "disponibile": false,
      "descrizioneSquadra": "A46",
      "tooltipSquadra": "A03",
      "personeSulMezzo": [
        {
          "codiceFiscale": "IYWPLD73H09Q885H",
          "descrizione": "Murray Cremin",
          "tooltip": "JRFCNF65L16T239N",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "CCHIXR63V50Y316N",
          "descrizione": "Bartholome Fay",
          "tooltip": "WJKUPJ16G72X257Q",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "AUNMEJ04N85E627K",
          "descrizione": "Chester Durgan",
          "tooltip": "HSZTAJ65R74Q454C",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JFATCV31C00E835Y",
          "descrizione": "Nicholas Hyatt",
          "tooltip": "AMDOVJ70F06H128V",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OPDKXG54N80C570B",
          "descrizione": "Heaven Cole",
          "tooltip": "QEKJTD14U89B552F",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "WWZ04821",
      "descrizione": "AV/765",
      "targa": "53031",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T08:45:58.9811769+02:00",
      "codiceRichiestaAssistenza": "866.351.232",
      "disponibile": true,
      "descrizioneSquadra": "A85",
      "tooltipSquadra": "A30",
      "personeSulMezzo": [
        {
          "codiceFiscale": "VOIPVO57B66O703X",
          "descrizione": "Bonita Reichel",
          "tooltip": "PNIUCH72B34E209B",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "URORQG11E85L746N",
          "descrizione": "Lonny Nienow",
          "tooltip": "UFHDHM35M45T025J",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "XWCPZD87P69O733O",
          "descrizione": "Floyd Boehm",
          "tooltip": "OHFGRS66D42C159T",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "EFEHOW66X71K485W",
          "descrizione": "Jewell Fay",
          "tooltip": "QKXINS23O80T651F",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GSIOBU94S03P207B",
          "descrizione": "Brycen Zemlak",
          "tooltip": "XQOIMC79Z48I665G",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "ZFB95996",
      "descrizione": "AV/999",
      "targa": "12800",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T03:21:26.3686578+02:00",
      "codiceRichiestaAssistenza": "419.966.384",
      "disponibile": false,
      "descrizioneSquadra": "A66",
      "tooltipSquadra": "A96",
      "personeSulMezzo": [
        {
          "codiceFiscale": "CQDNQP14D29A831T",
          "descrizione": "Madeline Toy",
          "tooltip": "DNPCFJ00N40V179J",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LBCGKI09Z15M928G",
          "descrizione": "Aurelia Cummerata",
          "tooltip": "OXEPMP00J82Y069F",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XDGAHK95A57A867V",
          "descrizione": "Willard Thompson",
          "tooltip": "LPQKGR16E58Z098E",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "NQTRYP53J96F160X",
          "descrizione": "Guido Smitham",
          "tooltip": "SAJEST02N60C475M",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "URBWXH10Z31Y259X",
          "descrizione": "Enrico Funk",
          "tooltip": "LBXYJZ73V24P273Q",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "URB54415",
      "descrizione": "AV/374",
      "targa": "88795",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T00:02:42.3854509+02:00",
      "codiceRichiestaAssistenza": "333.748.768",
      "disponibile": false,
      "descrizioneSquadra": "A79",
      "tooltipSquadra": "A60",
      "personeSulMezzo": [
        {
          "codiceFiscale": "MECMJC23K28S712X",
          "descrizione": "Abdul Streich",
          "tooltip": "LNYXCQ93X14P538X",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "IDTLJM90P03N019F",
          "descrizione": "Esta Dare",
          "tooltip": "GAVLUJ19R34X106R",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "AELZAA89J13P396J",
          "descrizione": "Terrence Douglas",
          "tooltip": "SZBFOG72F14I422I",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "HZUPVA06C04G814E",
          "descrizione": "Alberto Abbott",
          "tooltip": "YXSHVQ79U83C663Q",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CDBEYE68Y32V222K",
          "descrizione": "Angel Daniel",
          "tooltip": "SZZBCG77Y76N524Y",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "RKQ95182",
      "descrizione": "ABP/703",
      "targa": "36680",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T15:35:57.9751356+02:00",
      "codiceRichiestaAssistenza": "510.571.099",
      "disponibile": false,
      "descrizioneSquadra": "A87",
      "tooltipSquadra": "A83",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GFABYI64H16B403M",
          "descrizione": "Oleta Reichert",
          "tooltip": "TXWTDX93O84U857H",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LUULMR07R62L270M",
          "descrizione": "Lempi Mohr",
          "tooltip": "LXEAZC68J85S744I",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "IKFSIF30C56R391X",
          "descrizione": "Jacinto Bradtke",
          "tooltip": "TVJXUR91W59U414H",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TPYRXZ02S45P803B",
          "descrizione": "Christian Feest",
          "tooltip": "NKAJAL51U15X697S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "CXJWPZ46H69L491I",
          "descrizione": "Maci Russel",
          "tooltip": "GYFIWF01O96D387C",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "EXD37573",
      "descrizione": "AV/966",
      "targa": "42214",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T01:59:11.0008969+02:00",
      "codiceRichiestaAssistenza": "399.238.546",
      "disponibile": false,
      "descrizioneSquadra": "A46",
      "tooltipSquadra": "A57",
      "personeSulMezzo": [
        {
          "codiceFiscale": "ZYRJNB47W26V631I",
          "descrizione": "Kristina Hackett",
          "tooltip": "UDAHHY74K57B686H",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "XWUDUU21C03H294Q",
          "descrizione": "Arnulfo Mertz",
          "tooltip": "RKLVOZ20F99A010R",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QIFADV61D27Q070I",
          "descrizione": "Ettie Waelchi",
          "tooltip": "AFDORB21C31G391L",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RGPFLW93O81Z781F",
          "descrizione": "Hilda Ernser",
          "tooltip": "UNZXSN80Y46W375R",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "UUGOJM39C62D159Y",
          "descrizione": "Javon Feeney",
          "tooltip": "JWSPWB88Z82E143Q",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "LFT73193",
      "descrizione": "AS/318",
      "targa": "42471",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T01:24:37.7217372+02:00",
      "codiceRichiestaAssistenza": "239.200.235",
      "disponibile": false,
      "descrizioneSquadra": "A40",
      "tooltipSquadra": "A53",
      "personeSulMezzo": [
        {
          "codiceFiscale": "HBFUDH31G47B498E",
          "descrizione": "Celia Hamill",
          "tooltip": "FVRQXG55U61O236A",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NWVVHG08G78O854J",
          "descrizione": "Elvera Swift",
          "tooltip": "LHOOSP41X46T964R",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JOKPAZ86F85C907K",
          "descrizione": "Reba Kulas",
          "tooltip": "IDGWDD45Y99M806Y",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "VHOQAJ65V45Y579S",
          "descrizione": "Birdie McClure",
          "tooltip": "RHMOJY72I70H142Z",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RCXGPI90Z31O180V",
          "descrizione": "Luther Terry",
          "tooltip": "SFSHCH77F44H863L",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "YIC76123",
      "descrizione": "AS/755",
      "targa": "41460",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T11:49:41.5381671+02:00",
      "codiceRichiestaAssistenza": "836.519.879",
      "disponibile": false,
      "descrizioneSquadra": "A13",
      "tooltipSquadra": "A09",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GEECVU90N15Z069D",
          "descrizione": "Chet Christiansen",
          "tooltip": "RLLXPV74G78U767P",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "KIEWTM60T58E266Z",
          "descrizione": "Thaddeus Considine",
          "tooltip": "HPHCIS26J73I076U",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "URZGNB25B52C776U",
          "descrizione": "Teagan Torphy",
          "tooltip": "GVEMVG24F74N996D",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ACFWTQ74H06S287R",
          "descrizione": "Juston Kreiger",
          "tooltip": "FDAGRA76A31C519X",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "KBNSLZ27M56T231M",
          "descrizione": "Demetrius Quitzon",
          "tooltip": "VOVZBT10Y05I997D",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "OHZ20891",
      "descrizione": "AV/379",
      "targa": "31535",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T17:00:39.4296063+02:00",
      "codiceRichiestaAssistenza": "928.935.049",
      "disponibile": true,
      "descrizioneSquadra": "A27",
      "tooltipSquadra": "A27",
      "personeSulMezzo": [
        {
          "codiceFiscale": "TAZVQH70M02A960A",
          "descrizione": "Zander Hodkiewicz",
          "tooltip": "IQNJDS26B24O517D",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ETHJKM26H72D771R",
          "descrizione": "Isaac Quigley",
          "tooltip": "QVCLRQ80M68F580V",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "YGACMK43Y57L970W",
          "descrizione": "Lee Borer",
          "tooltip": "HQTOMU94O72Q944N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "NJRZIS32A71E629T",
          "descrizione": "Fanny Muller",
          "tooltip": "SOINZX56W79M156C",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "HHBFEU22J00R217H",
          "descrizione": "Myah Powlowski",
          "tooltip": "WSCTAM50H95A123B",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "NMP25868",
      "descrizione": "AS/937",
      "targa": "59213",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T20:50:13.1561506+02:00",
      "codiceRichiestaAssistenza": "898.872.507",
      "disponibile": false,
      "descrizioneSquadra": "A08",
      "tooltipSquadra": "A61",
      "personeSulMezzo": [
        {
          "codiceFiscale": "FIROZO24H01P070H",
          "descrizione": "Giles Nitzsche",
          "tooltip": "TDUTUJ37K78R727Q",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ISRHPL65H20Z602G",
          "descrizione": "Micah Batz",
          "tooltip": "PWEPUV64I34I140C",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "LNJCFB16K17L546F",
          "descrizione": "Aida Hermiston",
          "tooltip": "DWLXYI19X95O931G",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MQCLDL56W89Q947Y",
          "descrizione": "Oral Grady",
          "tooltip": "PKUAEG79O81K211N",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "STAIGL39H00W958G",
          "descrizione": "Sydnie O'Connell",
          "tooltip": "PYFJNA87L64U999B",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "YSV68659",
      "descrizione": "AS/838",
      "targa": "51276",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T11:49:39.8268051+02:00",
      "codiceRichiestaAssistenza": "248.104.352",
      "disponibile": true,
      "descrizioneSquadra": "A21",
      "tooltipSquadra": "A04",
      "personeSulMezzo": [
        {
          "codiceFiscale": "QNIXTG66I90W723C",
          "descrizione": "Sammy Simonis",
          "tooltip": "ELZRPU81L78V126Q",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FIGSVZ56A66Y002W",
          "descrizione": "Bridie Stracke",
          "tooltip": "VSDXCF95B96A535R",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LPADYU25N68P217Z",
          "descrizione": "Celestino Ryan",
          "tooltip": "KEMVMM74P06M375R",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "RUISOS36M64G518P",
          "descrizione": "Aurelio Cummings",
          "tooltip": "UORFKQ58E48S453N",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SPUNUA19J44R763S",
          "descrizione": "Jason Blanda",
          "tooltip": "PYCAVE25X06F688K",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "GBK47237",
      "descrizione": "ABP/296",
      "targa": "54690",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T17:16:29.364748+02:00",
      "codiceRichiestaAssistenza": "025.486.593",
      "disponibile": false,
      "descrizioneSquadra": "A28",
      "tooltipSquadra": "A12",
      "personeSulMezzo": [
        {
          "codiceFiscale": "FHHNMV94R43O268C",
          "descrizione": "Giovanny Zieme",
          "tooltip": "ZGYFGV56T56V041W",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XJUPMQ01R60J749L",
          "descrizione": "Sammy Hackett",
          "tooltip": "CBSXFF90R20C788N",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "JTHDDD95K81X568P",
          "descrizione": "Thaddeus Dickens",
          "tooltip": "LOKPPL86O24W924M",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "YXPAQV19T64F196I",
          "descrizione": "Celia King",
          "tooltip": "ERSHMI29Y16E135Z",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LXOMSR12J15F619N",
          "descrizione": "Harold Hackett",
          "tooltip": "QCRJYE71N28O047T",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "ZEK75526",
      "descrizione": "AS/694",
      "targa": "20753",
      "descrizioneUnitaOperativa": "Ostiense",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T13:42:30.0667244+02:00",
      "codiceRichiestaAssistenza": "827.647.562",
      "disponibile": false,
      "descrizioneSquadra": "A55",
      "tooltipSquadra": "A56",
      "personeSulMezzo": [
        {
          "codiceFiscale": "TIFMUR15L16H692G",
          "descrizione": "Nicolas Friesen",
          "tooltip": "YUKAMM35Q89Q175E",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "DRBKCV79J24G206K",
          "descrizione": "Jed Hand",
          "tooltip": "ISALEN65O55E837P",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OROFOC10K68Z721V",
          "descrizione": "Lucie Schroeder",
          "tooltip": "GXWMIF48B69N404X",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "CDYHCD06P72Z069M",
          "descrizione": "Elisabeth Abshire",
          "tooltip": "FGAEGC44D48G350O",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZUSLSQ65C62P974E",
          "descrizione": "Ines Mann",
          "tooltip": "ZRESRW17N84Z122I",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "ATG55071",
      "descrizione": "AV/066",
      "targa": "92219",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T11:17:14.9637602+02:00",
      "codiceRichiestaAssistenza": "044.658.005",
      "disponibile": false,
      "descrizioneSquadra": "A60",
      "tooltipSquadra": "A99",
      "personeSulMezzo": [
        {
          "codiceFiscale": "SASLZE94I66U735R",
          "descrizione": "Kellen Rice",
          "tooltip": "DZEAML03C12V640K",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GPQDPH82I92D479Z",
          "descrizione": "Burdette Donnelly",
          "tooltip": "AGZYUV20V02S919H",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZJWDED00Z74X638W",
          "descrizione": "Hailey Kutch",
          "tooltip": "QVHIEB20G30M470E",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "XCVXSW56Y39X064A",
          "descrizione": "Junior Bauch",
          "tooltip": "BSBWCV79H91O192N",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "TDLUOD91I23A420M",
          "descrizione": "Parker Wilkinson",
          "tooltip": "FTBYXH68V79W105U",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "NOQ25847",
      "descrizione": "ABP/133",
      "targa": "44162",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T11:53:16.4808609+02:00",
      "codiceRichiestaAssistenza": "127.266.254",
      "disponibile": false,
      "descrizioneSquadra": "A31",
      "tooltipSquadra": "A05",
      "personeSulMezzo": [
        {
          "codiceFiscale": "NVWGTO32A09I076M",
          "descrizione": "Presley Torphy",
          "tooltip": "SRUFQW61E42R434R",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ZYCVIM83U35T629I",
          "descrizione": "Hyman McKenzie",
          "tooltip": "PGKDKF77K59O016V",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XIIJGB25L80R098Y",
          "descrizione": "Richmond Medhurst",
          "tooltip": "USPORL87U45B302O",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GAIXWT97S40S130H",
          "descrizione": "Cecile Hartmann",
          "tooltip": "TQYKHM08T66V364P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "XWWQYS37B32A089G",
          "descrizione": "Jayme Schoen",
          "tooltip": "PBKUWF00Q60R740H",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "KSR75881",
      "descrizione": "AS/709",
      "targa": "49584",
      "descrizioneUnitaOperativa": "Fiumicino",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T08:42:00.0015636+02:00",
      "codiceRichiestaAssistenza": "162.915.094",
      "disponibile": true,
      "descrizioneSquadra": "A64",
      "tooltipSquadra": "A10",
      "personeSulMezzo": [
        {
          "codiceFiscale": "IDBPMZ01M52U599M",
          "descrizione": "Irving Smitham",
          "tooltip": "LLSVPG54C21N233U",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "KSNZVY33Z40R912V",
          "descrizione": "Allan Hayes",
          "tooltip": "HMIZOZ93A03G142A",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LQTLEH04K20H339E",
          "descrizione": "Devan Robel",
          "tooltip": "SZAXQJ36F82S105P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VHBXDO63S60H915Y",
          "descrizione": "Helga Gaylord",
          "tooltip": "TDCVRW51O81V723K",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VVLGHQ75Y80F163E",
          "descrizione": "Veronica Ratke",
          "tooltip": "LKBPJC45V29R709P",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "YQD37555",
      "descrizione": "APS/929",
      "targa": "36887",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T21:26:50.9537564+02:00",
      "codiceRichiestaAssistenza": "356.067.201",
      "disponibile": true,
      "descrizioneSquadra": "A12",
      "tooltipSquadra": "A56",
      "personeSulMezzo": [
        {
          "codiceFiscale": "LWHIHC92T70I760C",
          "descrizione": "Andreanne Gorczany",
          "tooltip": "EYJAJF80L82M453W",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "RIRGWJ10P52C209F",
          "descrizione": "Mireille Fritsch",
          "tooltip": "VXDMCN35F57I837K",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "YBAWIQ27I61N281U",
          "descrizione": "Stephen Kub",
          "tooltip": "WOTMVX58G47N600U",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZPMGJE74S38E042V",
          "descrizione": "Antone Mills",
          "tooltip": "PFYUTZ25D44F097Y",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "QFOTJE20C43H894P",
          "descrizione": "Kevin Swift",
          "tooltip": "UTGBPP02C71H537L",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "WWH85574",
      "descrizione": "AV/138",
      "targa": "41126",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T10:21:22.4614743+02:00",
      "codiceRichiestaAssistenza": "489.023.191",
      "disponibile": true,
      "descrizioneSquadra": "A17",
      "tooltipSquadra": "A03",
      "personeSulMezzo": [
        {
          "codiceFiscale": "SBGFBJ23U47J274P",
          "descrizione": "Dawson Kunde",
          "tooltip": "GSTMVM39S48N965S",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "WFZXPI81T00S275L",
          "descrizione": "Owen Ferry",
          "tooltip": "PKTSKN89Y76T068J",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "JCKOQT38Z21Y592T",
          "descrizione": "Craig Gulgowski",
          "tooltip": "NPJTLY40H00I323K",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ATAJNO57A27L345H",
          "descrizione": "Nigel Littel",
          "tooltip": "IZQFRB89Y86G412F",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EBVERY23W66S057L",
          "descrizione": "Penelope Marquardt",
          "tooltip": "NJHQQQ93Y22C201P",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "FFH27140",
      "descrizione": "AS/205",
      "targa": "96976",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-23T23:59:02.6993548+02:00",
      "codiceRichiestaAssistenza": "368.078.425",
      "disponibile": false,
      "descrizioneSquadra": "A54",
      "tooltipSquadra": "A70",
      "personeSulMezzo": [
        {
          "codiceFiscale": "QHSNAC43K22L294K",
          "descrizione": "Abdiel Krajcik",
          "tooltip": "AYPODT36Q85W127S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NSTBWE52V76C963F",
          "descrizione": "Dorothea Herzog",
          "tooltip": "TOTRMT48J12M212M",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ZBKAWX59N88L993R",
          "descrizione": "Leif Luettgen",
          "tooltip": "BGHJID15H40S262H",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SSWCMF69X13C547S",
          "descrizione": "Mckenzie Prosacco",
          "tooltip": "SBXRIG55E68R609X",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "YUBTIF92F85Z595P",
          "descrizione": "Laverne Moore",
          "tooltip": "ANWYSL30N69O687T",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "BRA11810",
      "descrizione": "APS/452",
      "targa": "38388",
      "descrizioneUnitaOperativa": "Centrale",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T18:31:17.8653529+02:00",
      "codiceRichiestaAssistenza": "530.840.832",
      "disponibile": false,
      "descrizioneSquadra": "A39",
      "tooltipSquadra": "A29",
      "personeSulMezzo": [
        {
          "codiceFiscale": "RXDHKU26G22K641N",
          "descrizione": "Anita Hoppe",
          "tooltip": "CHQTOH58J11L740V",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "NZHORA79A97D303N",
          "descrizione": "Julie Nitzsche",
          "tooltip": "DOAXYX51U59O675O",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "NQPARG51F71C194V",
          "descrizione": "Erwin Hoppe",
          "tooltip": "BJRCXY31J04U491Z",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "DXUIUR80S39C831B",
          "descrizione": "Emmitt Wunsch",
          "tooltip": "OSBHDF18Y61A943E",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "TPZGWF01G10P461D",
          "descrizione": "Isidro Ratke",
          "tooltip": "QRDRWX35H96L173P",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "YXU32588",
      "descrizione": "AS/715",
      "targa": "73209",
      "descrizioneUnitaOperativa": "Nomentano",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T22:16:41.8763736+02:00",
      "codiceRichiestaAssistenza": "961.805.903",
      "disponibile": true,
      "descrizioneSquadra": "A78",
      "tooltipSquadra": "A70",
      "personeSulMezzo": [
        {
          "codiceFiscale": "DWGKSE71P19L167C",
          "descrizione": "Rossie Heaney",
          "tooltip": "LVZJDM83E94E506W",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "MIKEZS37H99Y707A",
          "descrizione": "Evan Johnston",
          "tooltip": "MCXWVO11Z43O892J",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "GVHBLE84G13M571S",
          "descrizione": "Ephraim Rutherford",
          "tooltip": "LPQUNI29L19N664C",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "KRSAKI98N96J064V",
          "descrizione": "Kellie Yundt",
          "tooltip": "ATTDHK32Q67B658X",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "LFHVSV32B03C814L",
          "descrizione": "Kraig Bogan",
          "tooltip": "NLPBBJ17W07F730D",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "JIY58651",
      "descrizione": "APS/412",
      "targa": "49995",
      "descrizioneUnitaOperativa": "Ostia",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-23T22:53:29.1728256+02:00",
      "codiceRichiestaAssistenza": "072.538.124",
      "disponibile": false,
      "descrizioneSquadra": "A85",
      "tooltipSquadra": "A11",
      "personeSulMezzo": [
        {
          "codiceFiscale": "JATTKG71U20H874N",
          "descrizione": "Noemie Moore",
          "tooltip": "QCTNVH80N38A680Q",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VZOLCR20E34K092R",
          "descrizione": "Amir Adams",
          "tooltip": "NYLNEF79G44U160X",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "FACFVD55C28U980A",
          "descrizione": "Devonte Legros",
          "tooltip": "MKFHRB57O37Z069W",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "ICHAOD51L45S135N",
          "descrizione": "Candace Heaney",
          "tooltip": "TKEGJY23H71B904Y",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "LWCUNP12W24L545W",
          "descrizione": "Dante Boyle",
          "tooltip": "WYCIUF32K56Q414S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "BAX82741",
      "descrizione": "ABP/762",
      "targa": "79641",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T05:10:45.0422125+02:00",
      "codiceRichiestaAssistenza": "837.513.525",
      "disponibile": true,
      "descrizioneSquadra": "A69",
      "tooltipSquadra": "A44",
      "personeSulMezzo": [
        {
          "codiceFiscale": "GFPTUB38I15Y472Q",
          "descrizione": "Kale Fisher",
          "tooltip": "YQKUEJ58K95B032P",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "VJHGKG98U14J379I",
          "descrizione": "Brenna Gorczany",
          "tooltip": "KKJGFX98D45F104S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SGEVIP33A57D629T",
          "descrizione": "Osbaldo Runte",
          "tooltip": "DCILKV32Z23X002K",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "PBUXVW31Z83H426F",
          "descrizione": "Neoma Aufderhar",
          "tooltip": "UTAZJJ06R60L890E",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "FGMCHV58S81G822A",
          "descrizione": "Delmer Willms",
          "tooltip": "CKNUFS48K53K095N",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        }
      ]
    },
    {
      "codice": "RFO47828",
      "descrizione": "AV/133",
      "targa": "13302",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T04:39:08.137232+02:00",
      "codiceRichiestaAssistenza": "606.626.424",
      "disponibile": true,
      "descrizioneSquadra": "A40",
      "tooltipSquadra": "A62",
      "personeSulMezzo": [
        {
          "codiceFiscale": "ONKQXW56H70F673L",
          "descrizione": "Gaetano Erdman",
          "tooltip": "IRHQGJ13U41K077C",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "ZJVXPD08X66C681X",
          "descrizione": "Benjamin Kessler",
          "tooltip": "WDGVNU11J04Z682J",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "LBEPKL47R82G162V",
          "descrizione": "Marion Blick",
          "tooltip": "OICLZS84S02K528R",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "HTVJUC28C87S711R",
          "descrizione": "Doyle Powlowski",
          "tooltip": "PEWOYT74M79H986K",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "EOAECP97A21G801J",
          "descrizione": "Reanna Wisozk",
          "tooltip": "EXQBRU11P78D787C",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "SMG28906",
      "descrizione": "ABP/391",
      "targa": "68847",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T00:26:53.9257309+02:00",
      "codiceRichiestaAssistenza": "079.105.434",
      "disponibile": true,
      "descrizioneSquadra": "A04",
      "tooltipSquadra": "A25",
      "personeSulMezzo": [
        {
          "codiceFiscale": "LYCNRX54N22N174T",
          "descrizione": "Maiya Roob",
          "tooltip": "RZZBWI25K88U005Q",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "QIQXXW72U84R673K",
          "descrizione": "Freddie Bernhard",
          "tooltip": "WGFMJE57L24N168B",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TBCJQN31S10M665F",
          "descrizione": "Trisha Muller",
          "tooltip": "WGSIEG93I30V784P",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "MPSCGM46Z67A962Q",
          "descrizione": "Kieran Oberbrunner",
          "tooltip": "SYCREA76I35D058L",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "TZGXMH35I43P038O",
          "descrizione": "Doyle Howell",
          "tooltip": "YNBMVC33M64B229V",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "SJG72225",
      "descrizione": "AV/998",
      "targa": "37426",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T10:49:07.5690342+02:00",
      "codiceRichiestaAssistenza": "240.016.548",
      "disponibile": true,
      "descrizioneSquadra": "A31",
      "tooltipSquadra": "A21",
      "personeSulMezzo": [
        {
          "codiceFiscale": "MYPRYJ05I11E126E",
          "descrizione": "Bradley Rogahn",
          "tooltip": "DKZIXI68B03B718U",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "KGIKUN07T75T924J",
          "descrizione": "Alyson Hayes",
          "tooltip": "PSIGMB59B30I407S",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "SPMHCP92I11R404H",
          "descrizione": "Tia Rice",
          "tooltip": "AVJHOZ47L16G595I",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "IPTIET48J99W119Q",
          "descrizione": "Jaunita Zemlak",
          "tooltip": "HYHSXL16W57W772P",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "SQQWRP47P95G945Z",
          "descrizione": "Ilene Brekke",
          "tooltip": "XWWZCO26B21Y583U",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "WHC56337",
      "descrizione": "AV/344",
      "targa": "58897",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "InViaggio",
      "istanteAggiornamentoStato": "2017-06-24T06:53:23.728943+02:00",
      "codiceRichiestaAssistenza": "215.248.653",
      "disponibile": false,
      "descrizioneSquadra": "A99",
      "tooltipSquadra": "A09",
      "personeSulMezzo": [
        {
          "codiceFiscale": "AWJRRA79Z63T488A",
          "descrizione": "Lourdes Shields",
          "tooltip": "SFCVSV73I11B615G",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "OUVYOI86R96D977S",
          "descrizione": "Jerrell Barton",
          "tooltip": "BRVZQK87O75Y658C",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "TQTACE77F14H965I",
          "descrizione": "Colby Kuphal",
          "tooltip": "VFNSOG90B05D676T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "BPQGWF63G79K233J",
          "descrizione": "Cristopher Tromp",
          "tooltip": "XETEDQ76A75H911E",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "OJIAGA11Q72U357N",
          "descrizione": "Jennifer Wintheiser",
          "tooltip": "KNPCOR56N03B242Q",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "AAL24054",
      "descrizione": "ABP/613",
      "targa": "36553",
      "descrizioneUnitaOperativa": "EUR",
      "codiceStato": "SulPosto",
      "istanteAggiornamentoStato": "2017-06-24T01:43:29.8637052+02:00",
      "codiceRichiestaAssistenza": "628.559.273",
      "disponibile": true,
      "descrizioneSquadra": "A69",
      "tooltipSquadra": "A96",
      "personeSulMezzo": [
        {
          "codiceFiscale": "PAOIOP01M06Y568J",
          "descrizione": "Skye Prosacco",
          "tooltip": "HDOGKL86I48L138A",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "EAJEQW56R56V643F",
          "descrizione": "Saul Kunde",
          "tooltip": "UEWSYU66R55U660S",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "DMRRSU20M83C953Y",
          "descrizione": "Hilma Brown",
          "tooltip": "ILKYFY10T91O768S",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "CLCKYH83P50M729K",
          "descrizione": "Ewell Swift",
          "tooltip": "OMSOSN02G54B735I",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "YMCAWJ60H29P330Z",
          "descrizione": "Isom Walter",
          "tooltip": "WJWXAQ71M21E921K",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "GUH61108",
      "descrizione": "APS/171",
      "targa": "29732",
      "descrizioneUnitaOperativa": "Tuscolano II",
      "codiceStato": "InSede",
      "istanteAggiornamentoStato": "2017-06-24T01:11:54.7381558+02:00",
      "codiceRichiestaAssistenza": "869.780.603",
      "disponibile": true,
      "descrizioneSquadra": "A00",
      "tooltipSquadra": "A45",
      "personeSulMezzo": [
        {
          "codiceFiscale": "YIAYSQ07A60L435Z",
          "descrizione": "Jody Hahn",
          "tooltip": "UPDNEV81T23Y235Y",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "WDLNJK41R38M179O",
          "descrizione": "Santino Ratke",
          "tooltip": "VWCWNI46S80X320Q",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "GFTBZD43H15A658D",
          "descrizione": "Jakob Beahan",
          "tooltip": "GYEXTS36L42A176P",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "TWYKEB31R15C280X",
          "descrizione": "Theresa Wunsch",
          "tooltip": "IAJQOA80C43A930S",
          "capoPartenza": true,
          "autista": false,
          "rimpiazzo": true
        },
        {
          "codiceFiscale": "WTDNQB20J14Z276N",
          "descrizione": "Cletus Bauch",
          "tooltip": "FKJHZG73C68E081B",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    },
    {
      "codice": "RTQ01533",
      "descrizione": "AS/145",
      "targa": "53719",
      "descrizioneUnitaOperativa": "Tuscolano I",
      "codiceStato": "InRientro",
      "istanteAggiornamentoStato": "2017-06-24T04:51:56.8140441+02:00",
      "codiceRichiestaAssistenza": "103.935.412",
      "disponibile": true,
      "descrizioneSquadra": "A93",
      "tooltipSquadra": "A89",
      "personeSulMezzo": [
        {
          "codiceFiscale": "KRCUXS53E58S261U",
          "descrizione": "Shea Rosenbaum",
          "tooltip": "UVMLQI01U39B798R",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "DLVXUC38K18U523F",
          "descrizione": "Leta Rowe",
          "tooltip": "FMMVPT02M07L076T",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "XBJBUY92Z86S530T",
          "descrizione": "Charlotte Purdy",
          "tooltip": "QGDTXY76S80X504S",
          "capoPartenza": false,
          "autista": true,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "DROXIU25T53K268C",
          "descrizione": "Maia Kunze",
          "tooltip": "HMDBHE49X16C632A",
          "capoPartenza": false,
          "autista": false,
          "rimpiazzo": false
        },
        {
          "codiceFiscale": "SXJNIE22I54A439Z",
          "descrizione": "Hellen Beatty",
          "tooltip": "QHSXVI40L70B589Y",
          "capoPartenza": true,
          "autista": true,
          "rimpiazzo": true
        }
      ]
    }
  ]`);
  constructor(private http: Http) { }

  public getMezzi(): Observable<MezzoInServizio[]> {
    return Observable.of(this.mezzi);
  }

}
