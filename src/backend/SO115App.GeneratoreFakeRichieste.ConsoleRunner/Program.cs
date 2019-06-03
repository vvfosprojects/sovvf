using SO115App.API.Models.Servizi.Infrastruttura.Organigramma.Implementazioni;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi;
using SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma;
using SO115App.GeneratoreRichiesteFake;
using System;
using System.Linq;

namespace SO115App.GeneratoreFakeRichieste.ConsoleRunner
{
    internal class Program
    {
        /// <summary>
        ///   Questo metodo utilizza la classe <see cref="GeneratoreRichieste" /> per generare una
        ///   serie di interventi fake.
        /// </summary>
        /// <param name="args">Inutilizzato</param>
        private static void Main(string[] args)
        {
            var getUnitaOperativaRadice = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var espandiPinNodoSuOrganigramma = new EspandiPinNodoSuOrganigramma(getUnitaOperativaRadice);
            var getMezziInServizioPerUnitaOperativa_Fake = new GetMezziInServizioPerUnitaOperativa_Fake(espandiPinNodoSuOrganigramma);
            var generatoreCoordinateIntervento = new GeneratoreCoordinateInterventoPerUO();
            var generatoreFakeRichieste = new GeneratoreRichieste(
                "TO",
                getMezziInServizioPerUnitaOperativa_Fake,
                DateTime.UtcNow.AddDays(-5),
                DateTime.UtcNow,
                50,
                45 * 60,
                15 * 60,
                50 * 60,
                25 * 60,
                new[] { 0.70f, 0.23f, 0.05f, 0.02f },
                generatoreCoordinateIntervento
                );

            var richieste = generatoreFakeRichieste.Genera().ToArray();
        }
    }
}
