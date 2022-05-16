using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneDB
{
    public interface IGetExternalLog
    {
        public List<ExternalApiLog> Get();
    }
}
