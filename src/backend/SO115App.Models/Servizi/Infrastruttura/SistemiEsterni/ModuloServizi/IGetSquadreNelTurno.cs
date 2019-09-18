using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

/// <summary>
///   Interfaccia del servizio che restituisce le squadre nel turno indicato
/// </summary>
namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ModuloServizi
{
    public interface IGetSquadreNelTurno
    {
        /// <summary>
        ///   Restituisce le squadre nel turno indicato
        /// </summary>
        /// <param name="CodiceTurno">Opzionale</param>
        /// <returns>La lista delle squadre</returns>
        List<Squadra> GetSquadreNelTurno(string CodiceTurno);
    }
}
