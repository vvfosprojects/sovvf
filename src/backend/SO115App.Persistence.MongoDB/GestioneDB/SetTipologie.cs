using Newtonsoft.Json;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneDB
{
    public class SetTipologie : ISetTipologie
    {
        private readonly IGetTipologieByCodice _readService;
        public SetTipologie(IGetTipologieByCodice readService)
        {
            _readService = readService;
        }

        public void SetUtilitaAFM()
        {
            string json;

            using (var r = new StreamReader($"C:/Users/francescodangelis/sovvf/src/backend/SO115App.Persistence.MongoDB/GestioneDB/tipologie.json"))
            {
                json = r.ReadToEnd();
            }

            var lstTipologieUtilita = JsonConvert.DeserializeObject<List<TipologiaUtilitaAFM>>(json);

            var lstTipologieVecchie = _readService.Get();

            var result = lstTipologieVecchie.Select(t =>
            {
                string value = "0";

                try
                {
                    value = lstTipologieUtilita.FirstOrDefault(tt => tt.COD_TIPOLOGIA == t.Codice)?.COD_UTILITA_SOCCORSO_AEREO.Split(".")[0] ?? "0";
                }
                catch (Exception e)
                {
                }

                t.UtilitaAFM = int.Parse(value);

                return t;
            }).ToList();

            _readService.Set(result);

        }
    }

    public class TipologiaUtilitaAFM
    {
        public string COD_TIPOLOGIA { get; set; }
        public string DESCRIZIONE { get; set; }
        public string COD_GRUPPO { get; set; }
        public string COD_PRIORITA { get; set; }
        public string COD_UTILITA_SOCCORSO_AEREO { get; set; }
    }

    public interface ISetTipologie
    {
        public void SetUtilitaAFM();
    }
}
