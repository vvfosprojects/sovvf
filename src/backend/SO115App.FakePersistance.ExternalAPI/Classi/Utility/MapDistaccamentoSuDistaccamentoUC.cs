using SO115App.ExternalAPI.Fake.Classi.DistaccamentiUtenteComune;
using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Classi.Utility
{
    /// <summary>
    ///   classe che mappa il Distaccamento di Utenti Comuni sul distaccamento di SO
    /// </summary>
    public static class MapDistaccamentoSuDistaccamentoUC
    {
        /// <summary>
        ///   metodo della classe che effettua il mapping
        /// </summary>
        /// <param name="distaccamentiUC">
        ///   la lista dei distaccamenti provenienti dal servizio Utente Comune
        /// </param>
        /// <returns>i ditaccamenti SO</returns>
        public static Distaccamento Map(DistaccamentoUC distaccamentoUC)
        {
            return new Distaccamento
            {
                Cap = distaccamentoUC.Cap,
                CodSede = distaccamentoUC.Id,
                DescDistaccamento = distaccamentoUC.Descrizione,
                Indirizzo = distaccamentoUC.Indirizzo
            };
        }
    }
}
