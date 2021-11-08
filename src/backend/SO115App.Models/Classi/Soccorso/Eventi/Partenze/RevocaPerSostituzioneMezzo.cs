using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Partenze
{
    public class RevocaPerSostituzioneMezzo : Revoca
    {
        public RevocaPerSostituzioneMezzo(RichiestaAssistenza richiesta, string codiceMezzo, DateTime istante, string codiceFonte, string motivazione, string codicePartenza)
            : base(richiesta, codiceMezzo, istante, codiceFonte, codicePartenza)
        {
            Motivazione = motivazione;
        }

        /// <summary>
        ///   La motivazione della revoca
        /// </summary>
        public string Motivazione { get; private set; }
    }
}
