using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze
{
    public interface IGetCompetenzeByCoordinateIntervento
    {
        public CompetenzeRichiesta GetCompetenzeByCoordinateIntervento(Coordinate coordinate);
    }
}
