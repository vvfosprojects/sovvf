using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.StatoMezzo
{
    internal interface IStatoMezzo
    {
        bool Disponibile { get; }

        void Composizione(ContestoMezzo context);

        void Uscita(ContestoMezzo context);

        void SulPosto(ContestoMezzo context);

        void Rientro(ContestoMezzo context);

        void InSede(ContestoMezzo context);
    }
}
