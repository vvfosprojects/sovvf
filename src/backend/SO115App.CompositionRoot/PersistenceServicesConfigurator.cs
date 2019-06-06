using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SimpleInjector;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.GeneratoreFakeRichieste;

namespace SO115App.CompositionRoot
{
    /// <summary>
    ///   Effettua il binding di tutti i servizi che vengono implementati dallo strato di
    ///   persistenza. La centralizzazione di queste regole permette di switchare agevolmente lo
    ///   strato di persistenza scegliendo alternativamente dei servizi basati su database, su
    ///   memoria o servizi fake.
    /// </summary>
    internal static class PersistenceServicesConfigurator
    {
        internal static void Configure(Container container)
        {
            // Indica se lo strato di persistenza inizializzato deve contenere interventi fake
            var generazioneInterventiFake = false;

            // Indica se la persistenza va effettuata in memoria
            var inMemoryPersistence = false;

            // Indica quali sono le unità operative per le quali si generano interventi fake
            var codiciUnitaOperativeInterventiFake = new[] { "RM.1000", "VT.1000", "RI.1000", "LT.1000", "FR.1000" };

            // indica di quanti giorni andare indietro per la generazione degli interventi fake
            var giorniIndietroInterventiFake = 5;

            var richieste = new List<RichiestaAssistenza>();

            if (generazioneInterventiFake)
            {
                var quickGenerator = new QuickGenerator(codiciUnitaOperativeInterventiFake, giorniIndietroInterventiFake);
                richieste.AddRange(quickGenerator.Genera());
            }

            if (inMemoryPersistence)
            {
                container.Register<SO115App.FakePersistence.InMemory.Richieste>(() =>
                {
                    return new SO115App.FakePersistence.InMemory.Richieste(richieste);
                },
                Lifestyle.Singleton);
            }
        }
    }
}
