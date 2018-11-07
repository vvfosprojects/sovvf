using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.StatiRichiesta;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Mappers.RichiestaSuSintesi
{
    class MapperListaRichiesteSuListaSintesiRichieste
    {

        public List<SintesiRichiesta> MapRichiesteSuSintesi(List<ListaRichiesteAssistenza> ListaRichiesta)
        {            
            List<SintesiRichiesta> ListaSintesi = new List<SintesiRichiesta>();

            foreach(ListaRichiesteAssistenza elemento in ListaRichiesta)
            {
                SintesiRichiesta sintesi = new SintesiRichiesta();
                string statoRichiesta = DecodifcaStatoRichiesta(elemento.Richiesta.StatoRichiesta);

                sintesi.codice = elemento.Richiesta.Codice;
                sintesi.codiceSchedaNue = elemento.Richiesta.CodiceSchedaNue;
                sintesi.competenze = elemento.Richiesta.Competenze;
                //sintesi.complessita = elemento.Richiesta.Complessita;
                sintesi.descrizione = elemento.Richiesta.Descrizione;
                sintesi.etichette = elemento.Richiesta.Tags.ToArray();
                sintesi.eventi = elemento.Richiesta.Eventi.ToList();
                //sintesi.fonogramma = elemento.Richiesta.StatoInvioFonogramma;
                sintesi.id = elemento.Richiesta.Id;
                sintesi.istantePresaInCarico = elemento.Richiesta.IstantePresaInCarico;
                sintesi.istantePrimaAssegnazione = elemento.Richiesta.IstantePrimaAssegnazione;
                
                sintesi.istanteRicezioneRichiesta = sintesi.eventi.Count > 0 ? elemento.Richiesta.IstanteRicezioneRichiesta : DateTime.MinValue;
                sintesi.localita = elemento.Richiesta.Localita;
                sintesi.operatore = elemento.Richiesta.Operatore;
                sintesi.partenze = elemento.Richiesta.ListaPartenze;
                sintesi.priorita = elemento.Richiesta.PrioritaRichiesta;
                sintesi.richiedente = elemento.Richiesta.Richiedente;
                sintesi.rilevanza = DateTime.Now;
                sintesi.stato = statoRichiesta;
                sintesi.tipologie = elemento.Richiesta.Tipologie;
                sintesi.zoneEmergenza = elemento.Richiesta.ZoneEmergenza;

                ListaSintesi.Add(sintesi);

            }

            return ListaSintesi;

        }

        private string DecodifcaStatoRichiesta(IStatoRichiesta statoRichiesta)
        {

            switch (statoRichiesta.ToString())
            {

                case "Modello.Classi.Soccorso.StatiRichiesta.InAttesa":
                    return "InAttesa";
                case "Modello.Classi.Soccorso.StatiRichiesta.Assegnata":
                    return "Assegnata";
                case "Modello.Classi.Soccorso.StatiRichiesta.Chiusa":
                    return "Chiusa";
                case "Modello.Classi.Soccorso.StatiRichiesta.Sospesa":
                    return "Sospesa";
                default:
                    return "Chiusa";
            }

        }
    }
}
