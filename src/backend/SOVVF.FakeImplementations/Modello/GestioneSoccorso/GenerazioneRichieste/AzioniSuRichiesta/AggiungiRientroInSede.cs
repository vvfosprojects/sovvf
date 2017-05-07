using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta
{
    internal class AggiungiRientroInSede : IAzioneSuRichiesta
    {
        private bool eseguita;
        private readonly ParametriMezzo parametriMezzo;
        private readonly ParcoMezzi parcoMezzi;
        private readonly RichiestaConParametri richiesta;

        public AggiungiRientroInSede(RichiestaConParametri richiesta, ParametriMezzo parametriMezzo, ParcoMezzi parcoMezzi)
        {
            this.richiesta = richiesta;
            this.parametriMezzo = parametriMezzo;
            this.parcoMezzi = parcoMezzi;
        }

        public DateTime IstantePrevisto
        {
            get
            {
                return this.parametriMezzo.DataPrevistaRientroInSede;
            }
        }

        public void Esegui(DateTime istanteEffettivo)
        {
            var mezzo = this.parametriMezzo.MezzoUtilizzato;

            if (mezzo == null)
                return;

            try
            {
                mezzo.ContestoMezzo.InSede();
                this.richiesta.Richiesta.Eventi.Add(
                    new PartenzaRientrata()
                    {
                        CodiceMezzo = parametriMezzo.MezzoUtilizzato.Codice,
                        Istante = istanteEffettivo
                    });
            }
            catch
            {
            }

            this.eseguita = true;
        }

        public bool Eseguita()
        {
            return this.eseguita;
        }
    }
}
