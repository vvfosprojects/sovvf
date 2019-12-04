using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistence.JSon.Composizione
{
    /// <summary>
    ///   La classe recupera sul json i mezzi prenotati qualora ci fossero
    /// </summary>
    public class GetMezziPrenotati : IGetMezziPrenotati
    {
        /// <summary>
        ///   Metodo della classe che si occupa del reperimento dei mezzi prenotati sul Json.
        /// </summary>
        /// <param name="codiceSede">il codice della sede</param>
        /// <returns>Lista di MezzoPrenotato</returns>
        public List<MezzoPrenotato> Get(string codiceSede)
        {
            var filepath = CostantiJson.PrenotazioneMezzo;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<List<MezzoPrenotato>>(json);
        }
    }
}
