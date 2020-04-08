using GeoCoordinatePortable;
using Newtonsoft.Json;
using SO115App.ApiNUE.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.ApiNUE.Services
{
    public class GetSchedeContatto
    {
        private const string SchedeContattoJson = "Fake/SchedeContatto.json";

        public List<SchedaContatto> GetList()
        {
            const string filepath = SchedeContattoJson;
            string json;

            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<List<SchedaContatto>>(json);
        }

        public SchedaContatto GetSchedaContattoAttuale(string codiceSede, string codiceOperatore)
        {
            var listaSchedeContatto = GetList();

            if (codiceOperatore == null) return listaSchedeContatto.Find(x =>
                 x.OperatoreChiamata.CodiceSede.Equals(codiceSede));

            return listaSchedeContatto.Find(x =>
                x.OperatoreChiamata.CodiceSede.Equals(codiceSede)
                && x.OperatoreChiamata.CodicePostazioneOperatore.Equals(codiceOperatore));
        }

        public List<SchedaContatto> GetSchede(string codiceSede)
        {
            return GetList().FindAll(x => x.OperatoreChiamata.CodiceSede.Equals(codiceSede));
        }

        public List<SchedaContatto> GetSchedeContattoFromCodiciFiscali(List<string> codiciFiscali)
        {
            var listaSchedeContatto = GetList();
            var listaSchedeContattoFiltered = new List<SchedaContatto>();

            foreach (var codice in codiciFiscali)
            {
                foreach (var scheda in listaSchedeContatto)
                {
                    if (scheda.OperatoreChiamata.CodiceFiscale.Equals(codice)) listaSchedeContattoFiltered.Add(scheda);
                }
            }

            return listaSchedeContattoFiltered;
        }

        public List<SchedaContatto> GetSchedeContattoTimeSpan(DateTime dataDa, DateTime dataA)
        {
            return GetList().FindAll(x => x.DataInserimento >= dataDa && x.DataInserimento <= dataA);
        }

        public List<SchedaContatto> GetSchedeContattoLetta(bool letta)
        {
            return GetList().FindAll(x => x.Letta.Equals(letta));
        }

        public List<SchedaContatto> GetSchedeContattoGestita(bool gestita)
        {
            return GetList().FindAll(x => x.Gestita.Equals(gestita));
        }

        public List<SchedaContatto> GetSchedeContattoFromListTipo(List<string> classificazione)
        {
            var listaSchedeContatto = GetList();
            var listaSchedeContattoFiltered = new List<SchedaContatto>();

            foreach (var classe in classificazione)
            {
                foreach (var scheda in listaSchedeContatto)
                {
                    if (scheda.Classificazione.Equals(classe)) listaSchedeContattoFiltered.Add(scheda);
                }
            }

            return listaSchedeContattoFiltered;
        }

        public List<SchedaContatto> GetSchedeContattoFromText(string testolibero)
        {
            var listaSchede = GetList();

            return (from schedaContatto in listaSchede let schedacontattoJson = JsonConvert.SerializeObject(schedaContatto) where schedacontattoJson.Contains(testolibero) select schedaContatto).ToList();
        }

        public List<SchedaContatto> GetSchedeContattoBySpatialArea(GeoCoordinate topRight, GeoCoordinate bottomLeft)
        {
            var listaSchede = GetList();
            var listaSchedeFiltered = new List<SchedaContatto>();

            listaSchedeFiltered.AddRange(listaSchede.Where(x => (x.Localita.Coordinate.Latitudine >= bottomLeft.Latitude) && (x.Localita.Coordinate.Latitudine <= topRight.Latitude) && ((x.Localita.Coordinate.Longitudine >= bottomLeft.Longitude) && (x.Localita.Coordinate.Longitudine <= topRight.Longitude))));

            return listaSchedeFiltered;
        }
    }
}
