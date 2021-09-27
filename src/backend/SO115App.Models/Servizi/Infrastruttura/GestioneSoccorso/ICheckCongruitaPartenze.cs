using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso
{
    public interface ICheckCongruitaPartenze
    {
        bool CheckCongruenza(CambioStatoMezzo cambioStatoMezzo, string codicePartenza);
    }
}
