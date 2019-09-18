using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement
{
    public interface IGetPersonaleByCodiciFiscali
    {
        List<Componente> GetPersonaleByCodiciFiscali(List<string> ListaCodiciFiscali);
    }
}
