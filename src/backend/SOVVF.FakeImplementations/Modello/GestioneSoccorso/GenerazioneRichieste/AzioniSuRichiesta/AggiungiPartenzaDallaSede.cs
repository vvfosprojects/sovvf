using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta
{
    internal class AggiungiPartenzaDallaSede : IAzioneSuRichiesta
    {
        private readonly ParametriMezzo parametriMezzo;
        private readonly RichiestaConParametri richiesta;
        private readonly ParcoMezzi parcoMezzi;
        private bool eseguita = false;

        public DateTime IstantePrevisto
        {
            get
            {
                return this.parametriMezzo.DataPrevistaComposizione; // non c'è delay tra composizione e attivazione della partenza
            }
        }

        public AggiungiPartenzaDallaSede(RichiestaConParametri richiesta, ParametriMezzo parametriMezzo, ParcoMezzi parcoMezzi)
        {
            this.richiesta = richiesta;
            this.parametriMezzo = parametriMezzo;
            this.parcoMezzi = parcoMezzi;
        }

        public void Esegui(DateTime istanteEffettivo)
        {
            var mezzo = this.parametriMezzo.MezzoUtilizzato;

            if (mezzo == null)
                return;

            mezzo.ContestoMezzo.Uscita();
            this.richiesta.Richiesta.Eventi.Add(
                new UscitaPartenza()
                {
                    CodiceMezzo = parametriMezzo.MezzoUtilizzato.Codice,
                    Istante = istanteEffettivo
                });

            this.eseguita = true;
        }

        public bool Eseguita()
        {
            return this.eseguita;
        }
    }
}
