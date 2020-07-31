using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneRubrica
{
    public interface IGetEnteTelefoni
    {
        List<EnteTelefoni> Get(string[] codici);
    }
}
