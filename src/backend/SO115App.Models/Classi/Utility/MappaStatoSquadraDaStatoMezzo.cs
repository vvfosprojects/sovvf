using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Composizione;

namespace SO115App.Models.Classi.Utility
{
    public static class MappaStatoSquadraDaStatoMezzo
    {
        public static Squadra.StatoSquadra MappaStato(string statoSquadra)
        {
            if (statoSquadra == Costanti.MezzoInUscita)
            {
                return Squadra.StatoSquadra.InUscita;
            }
            else if (statoSquadra == Costanti.MezzoInViaggio)
            {
                return Squadra.StatoSquadra.InViaggio;
            }
            else if (statoSquadra == Costanti.MezzoSulPosto)
            {
                return Squadra.StatoSquadra.SulPosto;
            }
            else if (statoSquadra == Costanti.MezzoInRientro)
            {
                return Squadra.StatoSquadra.InRientro;
            }
            else
            {
                return Squadra.StatoSquadra.InSede;
            }
        }

        public static StatoSquadraComposizione MappaStatoComposizione(string statoSquadraComposizione)
        {
            if (statoSquadraComposizione == Costanti.MezzoInUscita)
            {
                return StatoSquadraComposizione.InUscita;
            }
            else if (statoSquadraComposizione == Costanti.MezzoInViaggio)
            {
                return StatoSquadraComposizione.InViaggio;
            }
            else if (statoSquadraComposizione == Costanti.MezzoSulPosto)
            {
                return StatoSquadraComposizione.SulPosto;
            }
            else if (statoSquadraComposizione == Costanti.MezzoInRientro)
            {
                return StatoSquadraComposizione.InRientro;
            }
            else
            {
                return StatoSquadraComposizione.InSede;
            }
        }

        public static Squadra.StatoSquadra Mappa(string statoSquadraComposizione)
        {
            if (statoSquadraComposizione == string.Concat(Costanti.MezzoInUscita.Split(' ')))
            {
                return Squadra.StatoSquadra.InUscita;
            }
            else if (statoSquadraComposizione == string.Concat(Costanti.MezzoInViaggio.Split(' ')))
            {
                return Squadra.StatoSquadra.InViaggio;
            }
            else if (statoSquadraComposizione == string.Concat(Costanti.MezzoSulPosto.Split(' ')))
            {
                return Squadra.StatoSquadra.SulPosto;
            }
            else if (statoSquadraComposizione == string.Concat(Costanti.MezzoInRientro.Split(' ')))
            {
                return Squadra.StatoSquadra.InRientro;
            }
            else
            {
                return Squadra.StatoSquadra.InSede;
            }
        }
    }
}
