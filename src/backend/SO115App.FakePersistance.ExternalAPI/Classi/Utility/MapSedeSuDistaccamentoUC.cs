using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DistaccamentiUtenteComune;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.CoordinateTask;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Utility
{
    public class MapSedeSuDistaccamentoUC
    {
        private readonly IGetCoordinateDistaccamento _getCoordinateDistaccamento;

        public MapSedeSuDistaccamentoUC(IGetCoordinateDistaccamento getCoordinateDistaccamento)
        {
            _getCoordinateDistaccamento = getCoordinateDistaccamento;
        }

        public Sede Map(Distaccamento distaccamento) => new Sede(
            distaccamento.CodSede,
            distaccamento.DescDistaccamento,
            distaccamento.Indirizzo,
            distaccamento.Coordinate,
            "",
            "",
            "",
            "",
            "");
    }
}
