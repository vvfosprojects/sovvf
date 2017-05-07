using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.StatoMezzo
{
    internal class ContestoMezzo
    {
        public ContestoMezzo()
        {
            this.State = new InSede();
        }

        public IStatoMezzo State { get; set; }

        public void Composizione()
        {
            State.Composizione(this);
        }

        public void InSede()
        {
            State.InSede(this);
        }

        public void Uscita()
        {
            State.Uscita(this);
        }

        public void Rientro()
        {
            State.Rientro(this);
        }

        public void SulPosto()
        {
            State.SulPosto(this);
        }
    }
}
