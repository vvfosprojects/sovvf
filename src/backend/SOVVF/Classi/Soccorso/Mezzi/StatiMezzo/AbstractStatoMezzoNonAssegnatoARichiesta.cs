using System;

namespace Modello.Classi.Soccorso.Mezzi.StatiMezzo
{
    public abstract class AbstractStatoMezzoNonAssegnatoARichiesta : AbstractStatoMezzo
    {
        public AbstractStatoMezzoNonAssegnatoARichiesta(DateTime istanteTransizione) : base(istanteTransizione)
        {
        }

        public sealed override bool AssegnatoARichiesta
        {
            get
            {
                return false;
            }
        }
    }
}
