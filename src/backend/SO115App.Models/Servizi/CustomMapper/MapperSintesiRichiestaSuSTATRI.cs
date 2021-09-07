using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Statri;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperSintesiRichiestaSuSTATRI
    {
        public SchedaSO115 Map(SintesiRichiesta sintesiRichiesta)
        {
            return new SchedaSO115()
            {
                ABP = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ABP")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ABP")).Count() : 0 : 0,
                ACTSCH = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ACTSCH")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ACTSCH")).Count() : 0 : 0,
                AF = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AF")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AF")).Count() : 0 : 0,
                AFNUC = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AFNUC")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AFNUC")).Count() : 0 : 0,
                AFPOL = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AFPOL")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AFPOL")).Count() : 0 : 0,
                AG = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AG")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AG")).Count() : 0 : 0,
                AIS = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AIS")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AIS")).Count() : 0 : 0,
                AL = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AL")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AL")).Count() : 0 : 0,
                APS = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("APS")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("APS")).Count() : 0 : 0,
                ARI = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ARI")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ARI")).Count() : 0 : 0,
                AS1 = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AS1")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AS1")).Count() : 0 : 0,
                ATRID = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ATRID")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ATRID")).Count() : 0 : 0,
                AV = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AV")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("AV")).Count() : 0 : 0,
                BA = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("BA")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("BA")).Count() : 0 : 0,
                BP = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("BP")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("BP")).Count() : 0 : 0,
                CA = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("CA")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("CA")).Count() : 0 : 0,
                CAESK = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("CAESK")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("CAESK")).Count() : 0 : 0,
                CANUC = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("CANUC")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("CANUC")).Count() : 0 : 0,
                ELI = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ELI")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("ELI")).Count() : 0 : 0,
                MBP = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("MBP")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("MBP")).Count() : 0 : 0,
                MS = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("MS")).Count() > 0 ? sintesiRichiesta.Partenze.ToList().FindAll(p => p.Partenza.Mezzo.Genere.Equals("MS")).Count() : 0 : 0,
                MezzoNonCodificato = sintesiRichiesta.Partenze != null ? sintesiRichiesta.Partenze.ToList().FindAll(p =>
                                                                    !p.Partenza.Mezzo.Genere.Equals("ABP")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("ACTSCH")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("AF")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("AFNUC")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("AFPOL")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("AG")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("AIS")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("AL")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("APS")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("ARI")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("AS1")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("ATRID")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("AV")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("BA")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("CA")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("CAESK")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("CANUC")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("ELI")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("MBP")
                                                                 && !p.Partenza.Mezzo.Genere.Equals("MS")
                                                            ).Count() > 0 ? true : false : false,
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
                Progressivo = Convert.ToInt32(sintesiRichiesta.CodiceRichiesta.Split('-')[2]),
                RichiedenteIntervento = sintesiRichiesta.Richiedente.Nominativo,
                RilevanteStArCu = sintesiRichiesta.RilevanteStArCu,
                SiglaComando = sintesiRichiesta.Codice.Substring(0, 2) + ".1000",
                Telefono = sintesiRichiesta.Richiedente.Telefono,
                USL = sintesiRichiesta.Richiedente.Nominativo.Contains("USL") ? true : false,
                VigiliUrbani = sintesiRichiesta.Richiedente.Nominativo.Contains("Vigili Urbani") ? true : false,
                VolontariCivili = sintesiRichiesta.Richiedente.Nominativo.Contains("Volontari Civili") ? true : false,
                ViaPiazza = sintesiRichiesta.Localita.Indirizzo,
                ProvinciaIntervento = sintesiRichiesta.Codice.Substring(0, 2),
                AutomezziSO115 = MappaAutomezzi(sintesiRichiesta),
                PersoneSO115 = MappaSquadre(sintesiRichiesta),
                InterventoPiuSquadre = ContaSquadre(sintesiRichiesta.Partenze),
                NumeroCivico = "",
                Scheda = 0,
                CFFUNZSERV = "",
                CodiceTipologia = 0,
                CodiceComune = 0,
                CodiceCalamita = "",
                CodiceSedeServizio = 0
            };
        }

        private bool ContaSquadre(IList<ComposizionePartenze> partenze)
        {
            var ListaSquadre = partenze.Select(s => s.Partenza.Squadre).Count();

            if (ListaSquadre > 1)
                return true;
            else
                return false;
        }

        private List<PersonaSO115> MappaSquadre(SintesiRichiesta sintesiRichiesta)
        {
            List<PersonaSO115> listaSquadre = new List<PersonaSO115>();

            foreach (var partenza in sintesiRichiesta.Partenze)
            {
                foreach (var squadra in partenza.Partenza.Squadre)
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
            }

            return listaSquadre;
        }

        private IList<AutomezzoSO115> MappaAutomezzi(SintesiRichiesta sintesiRichiesta)
        {
            List<AutomezzoSO115> listaMezzi = new List<AutomezzoSO115>();

            foreach (var partenza in sintesiRichiesta.Partenze)
            {
                AutomezzoSO115 mezzo = new AutomezzoSO115()
                {
                    CodiceGenereMezzo = partenza.Partenza.Mezzo.Genere,
                    Targa = partenza.CodiceMezzo.Split('.')[1]
                };

                listaMezzi.Add(mezzo);
            }

            return listaMezzi;
        }
    }
}
