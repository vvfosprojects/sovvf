using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze
{
    public interface IGetListaCompetenze
    {
        List<CompetenzeRichiesta> GetListaCompetenze(string codSede);
    }
}
