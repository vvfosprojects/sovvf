using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.StatoMezzo
{
    internal class InRientro : IStatoMezzo
    {
        public bool Disponibile
        {
            get
            {
                return true;
            }
        }

        public void Composizione(ContestoMezzo context)
        {
            context.State = new Assegnato();
        }

        public void InSede(ContestoMezzo context)
        {
            context.State = new InSede();
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
            throw new InvalidOperationException();
        }
    }
}
