using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.RubricaDTO;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti
{
    /// <summary>
    ///   Interfaccia che si occupa ottenere i dati della rubrica da MongoDb
    /// </summary>
    public interface IGetRubrica
    {
        /// <param name="CodSede">I codici della sede per cui vanno ricercati gli enti</param>
        /// <param name="Ricorsivo"></param>
        /// <returns>Elenco della rubrica secondo più codici sede e la ricorsività</returns>
        List<EnteDTO> Get(string[] CodSede, string search = null);

        List<EnteDTO> GetBylstCodici(int[] lstCodici);

        EnteDTO Get(string Id);
    }
}
