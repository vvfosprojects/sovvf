using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    internal class ParcoMezzi
    {
        private Mezzo[] mezzi;

        public ParcoMezzi(int numeroMezzi, string codiceUnitaOperativa)
        {
            this.mezzi = new Mezzo[numeroMezzi];

            for (int i = 0; i < numeroMezzi; i++)
            {
                mezzi[i] = Mezzo.CreateMezzoFake(codiceUnitaOperativa);
            }
        }

        public Mezzo GetPrimoMezzoDisponibile()
        {
            return mezzi.FirstOrDefault(m => m.ContestoMezzo.State.Disponibile);
        }
    }
}
