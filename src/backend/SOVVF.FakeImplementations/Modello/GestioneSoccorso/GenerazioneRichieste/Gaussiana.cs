using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    internal class Gaussiana
    {
        private static Random rnd = new Random();

        private readonly float media;
        private readonly float devSt;

        public Gaussiana(float media, float devSt)
        {
            this.media = media;
            this.devSt = devSt;
        }

        /// <summary>
        ///   Genera variabili distribuite similmente ad una gaussiana.
        /// </summary>
        /// <returns>Il valore casuale</returns>
        /// <remarks><see cref="http://stackoverflow.com/questions/218060/random-gaussian-variables" /></remarks>
        public double Genera(bool ancheNegativo = false)
        {
            double u1 = 1.0 - rnd.NextDouble(); //uniform(0,1] random doubles
            double u2 = 1.0 - rnd.NextDouble();
            double randStdNormal = Math.Sqrt(-2.0 * Math.Log(u1)) *
                         Math.Sin(2.0 * Math.PI * u2); //random normal(0,1)
            double randNormal =
                         this.media + this.devSt * randStdNormal; //random normal(mean,stdDev^2)

            if (randNormal < 0 && !ancheNegativo)
                randNormal = 0;

            return randNormal;
        }
    }
}
