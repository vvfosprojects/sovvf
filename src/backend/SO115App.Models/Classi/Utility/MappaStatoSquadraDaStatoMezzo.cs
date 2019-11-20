using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Classi.Utility
{
    public static class MappaStatoSquadraDaStatoMezzo
    {
        public static Squadra.StatoSquadra MappaStato(string statoMezzo)
        {
            if (statoMezzo == Costanti.MezzoInRientro)
            {
                return Squadra.StatoSquadra.InRientro;
            }
            else if (statoMezzo == Costanti.MezzoInViaggio)
            {
                return Squadra.StatoSquadra.InViaggio;
            }
            else if (statoMezzo == Costanti.MezzoSulPosto)
            {
                return Squadra.StatoSquadra.SulPosto;
            }
            else
            {
                return Squadra.StatoSquadra.InSede;
            }
        }
    }
}
