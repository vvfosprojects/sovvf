using System;
using Bogus;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    internal class ParametriMezzo
    {
        private static Faker faker = new Faker();
        private readonly DateTime dataSegnalazione;

        private ParametriMezzo(DateTime dataSegnalazione)
        {
            this.dataSegnalazione = dataSegnalazione;
        }

        /// <summary>
        ///   Indica il numero di secondi dalla data della segnalazione dopo i quali viene eseguita
        ///   la composizione. Solitamente è qualche secondo. Può essere molti secondi nel caso di un
        ///   mezzo la cui necessità viene individuata ad intervento in corso.
        /// </summary>
        public int SecondiComposizione { get; set; }

        public DateTime DataPrevistaComposizione
        {
            get { return this.dataSegnalazione.AddSeconds(this.SecondiComposizione); }
        }

        /// <summary>
        ///   Indica il tempo di viaggio del mezzo, in secondi.
        /// </summary>
        public int SecondiArrivoSulPosto { get; set; }

        public DateTime DataPrevistaArrivoSulPosto
        {
            get { return this.DataPrevistaComposizione.AddSeconds(this.SecondiArrivoSulPosto); }
        }

        /// <summary>
        ///   Indica il tempo di permanenza sul posto del mezzo, in secondi.
        /// </summary>
        public int SecondiPermanenzaSulPosto { get; set; }

        public DateTime DataPrevistaPartenzaDalPosto
        {
            get { return this.DataPrevistaArrivoSulPosto.AddSeconds(this.SecondiPermanenzaSulPosto); }
        }

        /// <summary>
        ///   Indica la durata del viaggio di ritorno del mezzo, in secondi.
        /// </summary>
        public int SecondiInRientro { get; set; }

        public DateTime DataPrevistaRientroInSede
        {
            get { return this.DataPrevistaPartenzaDalPosto.AddSeconds(this.SecondiInRientro); }
        }

        /// <summary>
        ///   E' il mezzo che, dinamicamente, viene selezionato per evadere la richiesta.
        /// </summary>
        public Mezzo MezzoUtilizzato { get; set; }

        internal static ParametriMezzo GenerateFake(
            DateTime dataSegnalazione,
            bool partenzaImmediata,
            Gaussiana secondiPartenzeSuccessive,
            Gaussiana secondiArrivoSulPosto,
            Gaussiana secondiPermanenzaSulPosto,
            Gaussiana secondiInRientro
            )
        {
            partenzaImmediata = partenzaImmediata || faker.Random.Number(1, 100) < 90;
            var parametri = new ParametriMezzo(dataSegnalazione);

            if (partenzaImmediata)
                parametri.SecondiComposizione = (int)new Gaussiana(60, 20).Genera();
            else
                parametri.SecondiComposizione = (int)secondiPartenzeSuccessive.Genera();

            parametri.SecondiArrivoSulPosto = (int)secondiArrivoSulPosto.Genera();
            parametri.SecondiPermanenzaSulPosto = (int)secondiPermanenzaSulPosto.Genera();
            parametri.SecondiInRientro = (int)secondiInRientro.Genera();

            return parametri;
        }
    }
}
