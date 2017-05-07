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

        void Esegui(DateTime istanteEffettivo);

        bool Eseguita();
    }
}
