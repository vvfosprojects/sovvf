using System;

namespace Modello.Classi.Soccorso.Mezzi.StatiMezzo
{
    public abstract class AbstractStatoMezzoAssegnatoARichiesta : AbstractStatoMezzo, IStatoMezzoAssegnatoARichiesta
    {
        public AbstractStatoMezzoAssegnatoARichiesta(DateTime istanteTransizione, string codiceRichiesta) : base(istanteTransizione)
        {
            this.CodiceRichiesta = codiceRichiesta;
        }

        public sealed override bool AssegnatoARichiesta
        {
            get
            {
                return true;
            }
        }

        public string CodiceRichiesta { get; private set; }
    }
}
