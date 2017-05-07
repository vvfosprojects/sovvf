using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bogus;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    internal class ParametriRichiesta
    {
        private static Faker faker = null;

        /// <summary>
        ///   Indica la data alla quale giunge la segnalazione dell'intervento
        /// </summary>
        public DateTime DataSegnalazione { get; set; }

        /// <summary>
        ///   Ogni elemento dell'array indica la presenza di un mezzo, ed i relativi parametri
        /// </summary>
        public ParametriMezzo[] ParametriMezzi { get; set; }

        public static ParametriRichiesta GetParametriFake(
            DateTime dataMin,
            DateTime dataMax,
            float[] pesiNumeroMezziPartecipanti,
            Gaussiana secondiPartenzeSuccessive,
            Gaussiana secondiArrivoSulPosto,
            Gaussiana secondiPermanenzaSulPosto,
            Gaussiana secondiInRientro)
        {
            if (faker == null)
            {
                faker = new Faker();
            }

            var numeroMezzi = faker.Random.WeightedRandom(Enumerable.Range(1, pesiNumeroMezziPartecipanti.Length).ToArray(), pesiNumeroMezziPartecipanti);
            var dataSegnalazione = faker.Date.Between(dataMin, dataMax);
            var parametriRichiesta = new ParametriRichiesta()
            {
                DataSegnalazione = dataSegnalazione,
                ParametriMezzi = Enumerable.Range(1, numeroMezzi)
                    .Select(i =>
                        ParametriMezzo.GenerateFake(
                            dataSegnalazione,
                            i == 1, // la prima partenza è sempre immediata
                            secondiPartenzeSuccessive,
                            secondiArrivoSulPosto,
                            secondiPermanenzaSulPosto,
                            secondiInRientro))
                    .OrderBy(p => p.SecondiComposizione)
                    .ToArray()
            };

            return parametriRichiesta;
        }

        public override string ToString()
        {
            return string.Format("Data: {0} {1} - Mezzi: {2}",
                this.DataSegnalazione.ToShortDateString(),
                this.DataSegnalazione.ToShortTimeString(),
                string.Join(", ", this.ParametriMezzi.Select(p => p.SecondiComposizione.ToString())));
        }
    }
}
