using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta
{
    internal interface IAzioneSuRichiesta
    {
        DateTime IstantePrevisto { get; }

        IEnumerable<IAzioneSuRichiesta> Esegui(DateTime istanteEffettivo);

        bool Eseguita();
    }
}
