using System;
using System.Collections.Generic;
using System.Text;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma.Implementazioni;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi;
using SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma;
using SO115App.GeneratoreRichiesteFake;

namespace SO115App.GeneratoreFakeRichieste
{
    public class QuickGenerator
    {
        private readonly string[] codiciUnitaOperative;
        private readonly int giorniIndietro;

        /// <summary>
        ///   Genera una collezione di <see cref="RichiestaAssistenza" /> con parametri di default verosimili.
        /// </summary>
        /// <param name="codiciUnitaOperative">
        ///   I codici delle unità operative per le quali devono essere generate le richieste
        /// </param>
        /// <param name="giorniIndietro">Il numero di ultimi giorni in cui ricadono le richieste</param>
        public QuickGenerator(string[] codiciUnitaOperative,
            int giorniIndietro)
        {
            this.codiciUnitaOperative = codiciUnitaOperative;
            this.giorniIndietro = giorniIndietro;
        }

        public IEnumerable<RichiestaAssistenza> Genera()
        {
            var getUnitaOperativaRadice = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var espandiPinNodoSuOrganigramma = new EspandiPinNodoSuOrganigramma(getUnitaOperativaRadice);
            var getMezziInServizioPerUnitaOperativa_Fake = new GetMezziInServizioPerUnitaOperativa_Fake(espandiPinNodoSuOrganigramma);
            var generatoreCoordinateIntervento = new GeneratoreCoordinateInterventoPerUO();

            foreach (var codiceUo in this.codiciUnitaOperative)
            {
                var generatoreFakeRichieste = new GeneratoreRichiesteFake.GeneratoreRichieste(
                    codiceUo,
                    getMezziInServizioPerUnitaOperativa_Fake,
                    DateTime.UtcNow.AddDays(this.giorniIndietro),
                    DateTime.UtcNow,
                    50,
                    45 * 60,
                    15 * 60,
                    50 * 60,
                    25 * 60,
                    new[] { 0.70f, 0.23f, 0.05f, 0.02f },
                    generatoreCoordinateIntervento
                    );

                var richieste = generatoreFakeRichieste.Genera();
                foreach (var richiesta in richieste)
                    yield return richiesta;
            }
        }
    }
}
