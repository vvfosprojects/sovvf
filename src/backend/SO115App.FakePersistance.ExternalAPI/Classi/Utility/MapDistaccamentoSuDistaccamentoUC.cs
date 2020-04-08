using SO115App.ExternalAPI.Fake.Classi.DistaccamentiUtenteComune;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.CoordinateTask;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Classi.Utility
{
    /// <summary>
    ///   classe che mappa il Distaccamento di Utenti Comuni sul distaccamento di SO
    /// </summary>
    public class MapDistaccamentoSuDistaccamentoUC
    {
        private readonly IGetCoordinateDistaccamento _getCoordinateDistaccamento;

        public MapDistaccamentoSuDistaccamentoUC(IGetCoordinateDistaccamento getCoordinateDistaccamento)
        {
            _getCoordinateDistaccamento = getCoordinateDistaccamento;
        }

        /// <summary>
        ///   metodo della classe che effettua il mapping
        /// </summary>
        /// <param name="distaccamentoUC">
        ///   la lista dei distaccamenti provenienti dal servizio Utente Comune
        /// </param>
        /// <returns>i ditaccamenti SO</returns>
        public Distaccamento Map(DistaccamentoUC distaccamentoUC)
        {
            return new Distaccamento
            {
                Cap = distaccamentoUC.Cap,
                CodSede = distaccamentoUC.Id,
                DescDistaccamento = distaccamentoUC.Descrizione,
                Indirizzo = distaccamentoUC.Indirizzo,
                Coordinate = _getCoordinateDistaccamento.Get(distaccamentoUC.Id).Result
            };
        }
    }
}
