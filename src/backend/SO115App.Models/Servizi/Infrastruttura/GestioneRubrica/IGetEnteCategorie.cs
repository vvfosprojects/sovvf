using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneRubrica
{
    public interface IGetEnteCategorie
    {
        List<CategorieEnti> Get(int[] codici);
    }
}
