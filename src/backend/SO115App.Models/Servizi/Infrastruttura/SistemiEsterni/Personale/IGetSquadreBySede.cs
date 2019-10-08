using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using System;
using System.Collections.Generic;
using System.Text;

/// <summary>
///   Interfaccia del servizio che restituisce la lista dei componenti di una squadra
/// </summary>
namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetSquadreBySede
    {
        /// <summary>
        ///   Restituisce la lista dei componenti di una squadra
        /// </summary>
        /// <param name="CodiceSede"></param>
        /// <returns>La lista dei componenti di una squadra</returns>
        List<Turno> SquadreBySede(string codiceSede);
    }
}
