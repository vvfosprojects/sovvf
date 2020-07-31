using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti
{
    /// <summary>
    /// Interfaccia che si occupa ottenere i dati della rubrica da MongoDb
    /// </summary>
    public interface IGetRubrica
    {
        /// <param name="CodSede">I codici della sede per cui vanno ricercati gli enti</param>
        /// <param name="Ricorsivo"></param>
        /// <returns>Elenco della rubrica secondo più codici sede e la ricorsività</returns>
        List<EnteIntervenuto> Get(string[] CodSede, bool Ricorsivo);
        List<EnteIntervenuto> GetBylstCodici(int[] lstCodici);
    }
}
