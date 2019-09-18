using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

/// <summary>
///   Interfaccia del servizio che restituisce la lista dei componenti di una squadra
/// </summary>
namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ModuloServizi
{
    public interface IGetComposizioneSquadra
    {
        /// <summary>
        ///   Restituisce la lista dei componenti di una squadra
        /// </summary>
        /// <param name="CodiceSquadra"></param>
        /// <param name="Orario"></param>
        /// <returns>La lista dei componenti di una squadra</returns>
        List<Componente> GetComposizioneSquadra(string CodiceSquadra, string Orario);
    }
}
