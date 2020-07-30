using SO115App.Models.Classi.RubricaDTO;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneRubrica
{
    public interface IGetEnteTelefoni
    {
        List<EnteTelefoni> Get(string[] codici);
    }
}
