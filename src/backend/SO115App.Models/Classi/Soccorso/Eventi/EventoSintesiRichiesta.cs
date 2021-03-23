using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Classi.Soccorso.Eventi
{
    public sealed class EventoSintesiRichiesta
    {
        private EventoSintesiRichiesta() { }
        public EventoSintesiRichiesta(DateTime ora)
        {
            Ora = ora;
        }

        public string Stato { get; set; }
        public DateTime Ora { get; private set; }
        public string CodiceMezzo { get; set; }
        public string Note { get; set; } = null;
    }

    public static class EventoSintesiExtension
    {
        /// <summary>
        /// Metodo di estensione che filtra gli eventi rigrardanti mezzi (veivoli compresi)
        /// </summary>
        /// <param name="eventi"></param>
        /// <returns></returns>
        public static List<EventoSintesiRichiesta> ToEventiSintesi(this IEnumerable<Evento> eventi)
        {
            return eventi.Select(e => e.ToEventoSintesi()).Where(e => e != null).ToList();
        }

        private static EventoSintesiRichiesta ToEventoSintesi(this Evento evento)
        {
            var EventoSintesi = new EventoSintesiRichiesta(evento.Istante);

            #region Eventi con veivoli

            if (evento is RichiestaSoccorsoAereo)
            {
                if (string.IsNullOrEmpty(((RichiestaSoccorsoAereo)evento).Targa)) return null;

                EventoSintesi.CodiceMezzo = ((RichiestaSoccorsoAereo)evento).Targa;
                EventoSintesi.Note = ((RichiestaSoccorsoAereo)evento).Note;
                EventoSintesi.Stato = ((RichiestaSoccorsoAereo)evento).Note; //TODO mostrare solo stato dalla string
            }
            else if (evento is AnnullamentoRichiestaSoccorsoAereo)
            {
                if (string.IsNullOrEmpty(((AnnullamentoRichiestaSoccorsoAereo)evento).Targa)) return null;

                EventoSintesi.CodiceMezzo = ((AnnullamentoRichiestaSoccorsoAereo)evento).Targa;
                EventoSintesi.Note = ((AnnullamentoRichiestaSoccorsoAereo)evento).Note;
                EventoSintesi.Stato = ((AnnullamentoRichiestaSoccorsoAereo)evento).Note; //TODO mostrare solo stato dalla string
            }

            #endregion

            #region Eventi con mezzi strdali

            else if (evento is ComposizionePartenze)
            {
                EventoSintesi.CodiceMezzo = ((ComposizionePartenze)evento).Partenza.Mezzo.Codice;
                EventoSintesi.Stato = Costanti.MezzoInViaggio;
            }
            //else if (evento is UscitaPartenza)
            //{
            //    EventoSintesi.CodiceMezzo = ((UscitaPartenza)evento).CodiceMezzo;
            //    EventoSintesi.Stato = Costanti.MezzoInUscita;
            //}
            else if (evento is ArrivoSulPosto)
            {
                EventoSintesi.CodiceMezzo = ((ArrivoSulPosto)evento).CodiceMezzo;
                EventoSintesi.Stato = Costanti.MezzoSulPosto;
            }
            else if (evento is PartenzaInRientro)
            {
                EventoSintesi.CodiceMezzo = ((PartenzaInRientro)evento).CodiceMezzo;
                EventoSintesi.Stato = Costanti.MezzoInRientro;
            }
            else if (evento is PartenzaRientrata)
            {
                EventoSintesi.CodiceMezzo = ((PartenzaRientrata)evento).CodiceMezzo;
                EventoSintesi.Stato = Costanti.MezzoRientrato;
            }
            else if (evento is SostituzionePartenzaFineTurno)
            {
                EventoSintesi.CodiceMezzo = ((SostituzionePartenzaFineTurno)evento).CodiceMezzo;
                EventoSintesi.Stato = Costanti.SostituzionePartenza;
            }

            #endregion

            else return null;

            return EventoSintesi;
        }
    }
}
