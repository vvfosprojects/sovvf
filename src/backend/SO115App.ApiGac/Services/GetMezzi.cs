using Newtonsoft.Json;
using SO115App.ApiGac.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.ApiGac.Services
{
    public class GetMezzi
    {
        private const string MezzoJson = "Fake/Mezzo.json";
        private const string FuoriServizio = "Fuori Servizio";

        public static List<Mezzo> Get()
        {
            const string filepath = MezzoJson;
            string json;

            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<List<Mezzo>>(json);
        }

        public List<Mezzo> GetMezziUtilizzabili(List<Sede> sedi, string genereMezzo, string siglaMezzo)
        {
            var listaMezzi = Get();
            var listaMezziFromSede = sedi.Select(sede => listaMezzi.Find(x => x.Distaccamento.Equals(sedi) && x.Movimentazione.StatoOperativo != FuoriServizio)).ToList();

            if (genereMezzo != null && siglaMezzo != null) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo) && x.Descrizione.Equals(siglaMezzo));
            if (genereMezzo != null) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo));
            if (siglaMezzo != null) return listaMezziFromSede.FindAll(x => x.Descrizione.Equals(siglaMezzo));

            return listaMezziFromSede;
        }

        public List<Mezzo> GetMezziFuoriServizio(List<Sede> sedi, string genereMezzo, string siglaMezzo)
        {
            var listaMezzi = Get();
            var listaMezziFromSede = sedi.Select(sede => listaMezzi.Find(x => x.Distaccamento.Equals(sede) && x.Movimentazione.StatoOperativo == FuoriServizio)).ToList();

            if (genereMezzo != null && siglaMezzo != null) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo) && x.Descrizione.Equals(siglaMezzo));
            if (genereMezzo != null) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo));
            if (siglaMezzo != null) return listaMezziFromSede.FindAll(x => x.Descrizione.Equals(siglaMezzo));

            return listaMezziFromSede;
        }

        public List<Mezzo> GetMezziFromICCID(List<string> iccid)
        {
            var listaMezzi = Get();
            return iccid.Select(x => listaMezzi.Find(y => y.ICCID.Equals(x))).ToList();
        }

        public List<Mezzo> GetMezziFromRadioId(List<string> radioId)
        {
            var listaMezzi = Get();
            return radioId.Select(x => listaMezzi.Find(y => y.IdRadio.Equals(x))).ToList();
        }

        public List<Mezzo> GetMezziFromCodiceMezzo(List<string> codiceMezzo)
        {
            var listaMezzi = Get();
            return codiceMezzo.Select(codice => listaMezzi.Find(x => x.Codice.Equals(codice))).ToList();
        }
    }
}
