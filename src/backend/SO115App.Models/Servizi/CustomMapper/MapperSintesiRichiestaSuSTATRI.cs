using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.ServiziEsterni.Statri;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperSintesiRichiestaSuSTATRI : IMapperSintesiInSchedeSO115
    {
        public List<SchedaSO115> Map(SintesiRichiesta sintesiRichiesta)
        {
            List<SchedaSO115> listaSchede = new List<SchedaSO115>();
            int progressivo = 1;
            foreach (var partenza in sintesiRichiesta.Partenze)
            {
                SchedaSO115 scheda = new SchedaSO115()
                {
                    ABP = partenza.Partenza.Mezzo.Genere.Equals("ABP") ? 1 : 0,
                    ACTSCH = partenza.Partenza.Mezzo.Genere.Equals("ACTSCH") ? 1 : 0,
                    AF = partenza.Partenza.Mezzo.Genere.Equals("AF") ? 1 : 0,
                    AFNUC = partenza.Partenza.Mezzo.Genere.Equals("AFNUC") ? 1 : 0,
                    AFPOL = partenza.Partenza.Mezzo.Genere.Equals("AFPOL") ? 1 : 0,
                    AG = partenza.Partenza.Mezzo.Genere.Equals("AG") ? 1 : 0,
                    AIS = partenza.Partenza.Mezzo.Genere.Equals("AIS") ? 1 : 0,
                    AL = partenza.Partenza.Mezzo.Genere.Equals("AL") ? 1 : 0,
                    APS = partenza.Partenza.Mezzo.Genere.Equals("APS") ? 1 : 0,
                    ARI = partenza.Partenza.Mezzo.Genere.Equals("ARI") ? 1 : 0,
                    AS1 = partenza.Partenza.Mezzo.Genere.Equals("AS1") ? 1 : 0,
                    ATRID = partenza.Partenza.Mezzo.Genere.Equals("ATRID") ? 1 : 0,
                    AV = partenza.Partenza.Mezzo.Genere.Equals("AV") ? 1 : 0,
                    BA = partenza.Partenza.Mezzo.Genere.Equals("BA") ? 1 : 0,
                    BP = partenza.Partenza.Mezzo.Genere.Equals("BP") ? 1 : 0,
                    CA = partenza.Partenza.Mezzo.Genere.Equals("CA") ? 1 : 0,
                    CAESK = partenza.Partenza.Mezzo.Genere.Equals("CAESK") ? 1 : 0,
                    CANUC = partenza.Partenza.Mezzo.Genere.Equals("CANUC") ? 1 : 0,
                    ELI = partenza.Partenza.Mezzo.Genere.Equals("ELI") ? 1 : 0,
                    MBP = partenza.Partenza.Mezzo.Genere.Equals("MBP") ? 1 : 0,
                    MS = partenza.Partenza.Mezzo.Genere.Equals("MS") ? 1 : 0,
                    MezzoNonCodificato = !partenza.Partenza.Mezzo.Genere.Equals("ABP")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("ACTSCH")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("AF")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("AFNUC")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("AFPOL")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("AG")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("AIS")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("AL")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("APS")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("ARI")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("AS1")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("ATRID")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("AV")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("BA")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("CA")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("CAESK")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("CANUC")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("ELI")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("MBP")
                                        && !partenza.Partenza.Mezzo.Genere.Equals("MS")
                                        ? true : false,
                    AnnoIntervento = sintesiRichiesta.IstanteRicezioneRichiesta.Year,
                    Boschi = sintesiRichiesta.TipoTerreno != null ? sintesiRichiesta.TipoTerreno.All(t => t.Descrizione.Equals("BOSCHI")) ? 1 : 0 : 0,
                    Campi = sintesiRichiesta.TipoTerreno != null ? sintesiRichiesta.TipoTerreno.All(t => t.Descrizione.Equals("CAMPI")) ? 1 : 0 : 0,
                    Sterpaglia = sintesiRichiesta.TipoTerreno != null ? sintesiRichiesta.TipoTerreno.All(t => t.Descrizione.Equals("STERPAGLIE")) ? 1 : 0 : 0,
                    Carabinieri = sintesiRichiesta.Richiedente.Nominativo.Contains("Carabinieri") ? true : false,
                    Chiamata = sintesiRichiesta.IstanteRicezioneRichiesta,
                    DataIntervento = sintesiRichiesta.IstantePresaInCarico.Value,
                    Latitudine = sintesiRichiesta.Localita.Coordinate.Latitudine,
                    Longitudine = sintesiRichiesta.Localita.Coordinate.Longitudine,
                    FFAA = sintesiRichiesta.Richiedente.Nominativo.Contains("FFAA") ? true : false,
                    GuardiaDiFinanza = sintesiRichiesta.Richiedente.Nominativo.Contains("Guardia Di Finanza") ? true : false,
                    GuardiaForestale = sintesiRichiesta.Richiedente.Nominativo.Contains("Guardia Forestale") ? true : false,
                    Note_Intervento = sintesiRichiesta.NotePubbliche,
                    Note_Operatore = sintesiRichiesta.NotePrivate,
                    NumProtocolloFono = sintesiRichiesta.Fonogramma != null ? sintesiRichiesta.Fonogramma.ProtocolloFonogramma : "",
                    PoliziaDiStato = sintesiRichiesta.Richiedente.Nominativo.Contains("Polizia Di Stato") ? true : false,
                    Progressivo = progressivo,
                    RichiedenteIntervento = sintesiRichiesta.Richiedente.Nominativo,
                    RilevanteStArCu = sintesiRichiesta.RilevanteStArCu,
                    SiglaComando = sintesiRichiesta.Codice.Substring(0, 2),
                    Telefono = sintesiRichiesta.Richiedente.Telefono,
                    USL = sintesiRichiesta.Richiedente.Nominativo.Contains("USL") ? true : false,
                    VigiliUrbani = sintesiRichiesta.Richiedente.Nominativo.Contains("Vigili Urbani") ? true : false,
                    VolontariCivili = sintesiRichiesta.Richiedente.Nominativo.Contains("Volontari Civili") ? true : false,
                    ViaPiazza = sintesiRichiesta.Localita.Indirizzo,
                    ProvinciaIntervento = sintesiRichiesta.Codice.Substring(0, 2),
                    AutomezziSO115 = MappaAutomezzi(partenza.Partenza.Mezzo),
                    PersoneSO115 = MappaSquadre(partenza.Partenza.Squadre),
                    InterventoPiuSquadre = ContaSquadre(partenza),
                    NumeroCivico = "",
                    Scheda = Convert.ToInt32(sintesiRichiesta.CodiceRichiesta.Split('-')[2]),
                    CFFUNZSERV = "",
                    CodiceTipologia = 0,
                    //CodiceComune = 0, // PUO PASSARE NULL
                    CodiceCalamita = "",
                    CodiceSedeServizio = Convert.ToInt32(sintesiRichiesta.CodSOCompetente.Split('.')[1]), // METTERE IL NUMERO DOPO IL .
                    UscitaDallaSede = CercaUscitaPartenza(sintesiRichiesta.Eventi, partenza.Partenza.Mezzo.Codice, partenza.CodicePartenza),
                    ArrivoSulLuogo = CercaArrivoSulPosto(sintesiRichiesta.Eventi, partenza.Partenza.Mezzo.Codice, partenza.CodicePartenza),
                    PartenzaDalLuogo = CercaInRientro(sintesiRichiesta.Eventi, partenza.Partenza.Mezzo.Codice, partenza.CodicePartenza),
                    RientroInSede = CercaRientrato(sintesiRichiesta.Eventi, partenza.Partenza.Mezzo.Codice, partenza.CodicePartenza)
                };

                listaSchede.Add(scheda);

                progressivo++;
            }

            return listaSchede;
        }

        private DateTime CercaUscitaPartenza(List<EventoSintesiRichiesta> eventiSintesi, string codiceMezzo, string CodicePartenza)
        {
            var eventoInViaggio = eventiSintesi.FindAll(m => m.Stato.Equals("In Viaggio") && m.CodiceMezzo.Equals(codiceMezzo) && m.CodicePartenza.Equals(CodicePartenza)).OrderByDescending(i => i.Ora).FirstOrDefault();
            return eventoInViaggio != null ? eventoInViaggio.Ora : DateTime.MinValue;
        }

        private DateTime CercaArrivoSulPosto(List<EventoSintesiRichiesta> eventiSintesi, string codiceMezzo, string CodicePartenza)
        {
            var eventoArrivoSulPosto = eventiSintesi.FindAll(m => m.Stato.Equals("Sul Posto") && m.CodiceMezzo.Equals(codiceMezzo) && m.CodicePartenza.Equals(CodicePartenza)).OrderByDescending(i => i.Ora).FirstOrDefault();
            return eventoArrivoSulPosto != null ? eventoArrivoSulPosto.Ora : DateTime.MinValue;
        }

        private DateTime CercaInRientro(List<EventoSintesiRichiesta> eventiSintesi, string codiceMezzo, string CodicePartenza)
        {
            var eventoInRientro = eventiSintesi.FindAll(m => m.Stato.Equals("In Rientro") && m.CodiceMezzo.Equals(codiceMezzo) && m.CodicePartenza.Equals(CodicePartenza)).OrderByDescending(i => i.Ora).FirstOrDefault();
            return eventoInRientro != null ? eventoInRientro.Ora : DateTime.MinValue;
        }

        private DateTime CercaRientrato(List<EventoSintesiRichiesta> eventiSintesi, string codiceMezzo, string CodicePartenza)
        {
            var eventoRientrato = eventiSintesi.FindAll(m => m.Stato.Equals("Rientrato") && m.CodiceMezzo.Equals(codiceMezzo) && m.CodicePartenza.Equals(CodicePartenza)).OrderByDescending(i => i.Ora).FirstOrDefault();
            return eventoRientrato != null ? eventoRientrato.Ora : DateTime.MinValue;
        }

        private bool ContaSquadre(ComposizionePartenze partenze)
        {
            var ListaSquadre = partenze.Partenza.Squadre.Count();

            if (ListaSquadre > 1)
                return true;
            else
                return false;
        }

        private List<PersonaSO115> MappaSquadre(List<API.Models.Classi.Condivise.Squadra> Squadre)
        {
            List<PersonaSO115> listaSquadre = new List<PersonaSO115>();

            foreach (var squadra in Squadre)
            {
                foreach (var componente in squadra.Membri)
                {
                    var CountNome = componente.Nominativo.Split(' ').Count();
                    string cognome = "";

                    for (int i = 1; i <= CountNome - 1; i++)
                    {
                        cognome = cognome + componente.Nominativo.Split(' ')[i];
                    }

                    PersonaSO115 operatore = new PersonaSO115()
                    {
                        Autista = componente.DescrizioneQualifica.Equals("DRIVER") ? true : false,
                        CapoSquadra = componente.DescrizioneQualifica.Equals("TEAM_LEADER") ? true : false,
                        CodiceFiscale = componente.CodiceFiscale,
                        CodiceQualifica = 0,
                        Cognome = cognome,
                        Nome = componente.Nominativo.Split(' ')[0]
                    };

                    listaSquadre.Add(operatore);
                }
            }

            return listaSquadre;
        }

        private IList<AutomezzoSO115> MappaAutomezzi(API.Models.Classi.Condivise.Mezzo mezzoSO)
        {
            List<AutomezzoSO115> listaMezzi = new List<AutomezzoSO115>();

            AutomezzoSO115 mezzo = new AutomezzoSO115()
            {
                CodiceGenereMezzo = mezzoSO.Genere,
                Targa = mezzoSO.Codice.Split('.')[1]
            };

            listaMezzi.Add(mezzo);

            return listaMezzi;
        }
    }
}
