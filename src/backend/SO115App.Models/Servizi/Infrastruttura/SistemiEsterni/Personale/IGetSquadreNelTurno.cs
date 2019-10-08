using SO115App.API.Models.Classi.Utenti;
using System.Collections.Generic;

/// <summary>
///   Interfaccia del servizio che restituisce le squadre nel turno indicato
/// </summary>
namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetSquadreNelTurno
    {
        /// <summary>
        ///   Restituisce le squadre nel turno indicato
        /// </summary>
        /// <param name="CodiceTurno"></param>
        /// <param name="codiceSede"></param>
        /// <returns>La lista delle squadre</returns>
        List<Turno> SquadreNelTurno(string codiceSede, string codiceTurno);
    }
}
