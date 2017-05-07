using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Partenze;
using static Modello.Classi.Soccorso.Squadre.Componente;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta
{
    internal class AggiungiComposizionePartenza : IAzioneSuRichiesta
    {
        private readonly ParcoMezzi parcoMezzi;
        private readonly ParametriMezzo parametriMezzo;
        private readonly RichiestaConParametri richiesta;
        private bool eseguita;

        public AggiungiComposizionePartenza(RichiestaConParametri richiesta, ParametriMezzo parametriMezzo, ParcoMezzi parcoMezzi)
        {
            this.richiesta = richiesta;
            this.parametriMezzo = parametriMezzo;
            this.parcoMezzi = parcoMezzi;
        }

        public DateTime IstantePrevisto
        {
            get
            {
                return this.parametriMezzo.DataPrevistaComposizione;
            }
        }

        public void Esegui(DateTime istanteEffettivo)
        {
            var mezzoSelezionato = this.parcoMezzi.GetPrimoMezzoDisponibile();
            if (mezzoSelezionato == null)
                return;

            mezzoSelezionato.ContestoMezzo.Composizione();
            this.parametriMezzo.MezzoUtilizzato = mezzoSelezionato; // questa assegnazione alimenta l'esecuzione di tutti gli altri eventi successivi
            var composizione = new ComposizionePartenze()
            {
                Istante = istanteEffettivo,
                Componenti = new HashSet<ComponentePartenza>(mezzoSelezionato.Membri
                    .Select((m, i) =>
                        new ComponentePartenza()
                        {
                            CodiceFiscale = m,
                            CodiceMezzo = mezzoSelezionato.Codice,
                            Ruoli = i == 0 ? new HashSet<Ruolo>() { Ruolo.CapoPartenza } : i == 1 ? new HashSet<Ruolo> { Ruolo.Autista } : new HashSet<Ruolo> { Ruolo.Vigile }
                        }))
            };
            this.richiesta.Richiesta.Eventi.Add(composizione);
            eseguita = true;
        }

        public bool Eseguita()
        {
            return this.eseguita;
        }
    }
}
