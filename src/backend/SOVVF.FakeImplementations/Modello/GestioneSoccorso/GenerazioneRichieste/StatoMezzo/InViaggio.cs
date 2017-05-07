using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.StatoMezzo
{
    internal class InViaggio : IStatoMezzo
    {
        public bool Disponibile
        {
            get
            {
                return false;
            }
        }

        public void Composizione(ContestoMezzo context)
        {
            throw new InvalidOperationException();
        }

        public void InSede(ContestoMezzo context)
        {
            throw new InvalidOperationException();
        }

        public void Uscita(ContestoMezzo context)
        {
            throw new InvalidOperationException();
        }

        public void Rientro(ContestoMezzo context)
        {
            throw new InvalidOperationException();
        }

        public void SulPosto(ContestoMezzo context)
        {
            context.State = new SulPosto();
        }
    }
}
