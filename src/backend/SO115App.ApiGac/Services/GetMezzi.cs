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

        public static List<MezzoDTO> Get()
        {
            const string filepath = MezzoJson;
            string json;

            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<List<MezzoDTO>>(json);
        }

        public List<MezzoDTO> GetMezziUtilizzabili(List<string> codiceSedi, string genereMezzo, string siglaMezzo)
        {
            var listaMezzi = Get().FindAll(x => x.Movimentazione.StatoOperativo != FuoriServizio);
            var listaMezziFromSede = new List<MezzoDTO>();

            foreach (var sede in codiceSedi)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (sede.Equals(mezzo.Distaccamento.Codice))
                    {
                        listaMezziFromSede.Add(mezzo);
                    }
                }
            }

            if (genereMezzo != null && siglaMezzo != null) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo) && x.Descrizione.Equals(siglaMezzo));
            if (genereMezzo != null) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo));
            if (siglaMezzo != null) return listaMezziFromSede.FindAll(x => x.Descrizione.Equals(siglaMezzo));

            return listaMezziFromSede;
        }

        public List<MezzoDTO> GetMezziFuoriServizio(List<string> codiceSedi, string genereMezzo, string siglaMezzo)
        {
            var listaMezzi = Get().FindAll(x => x.Movimentazione.StatoOperativo == FuoriServizio);
            var listaMezziFromSede = new List<MezzoDTO>();

            foreach (var sede in codiceSedi)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (sede.Equals(mezzo.Distaccamento.Codice))
                    {
                        listaMezziFromSede.Add(mezzo);
                    }
                }
            }
            if (genereMezzo != null && siglaMezzo != null) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo) && x.Descrizione.Equals(siglaMezzo));
            if (genereMezzo != null) return listaMezziFromSede.FindAll(x => x.Genere.Equals(genereMezzo));
            if (siglaMezzo != null) return listaMezziFromSede.FindAll(x => x.Descrizione.Equals(siglaMezzo));

            return listaMezziFromSede;
        }

        public List<MezzoDTO> GetMezziFromICCID(List<string> iccid)
        {
            var listaMezzi = Get();
            var listaMezziFromSede = new List<MezzoDTO>();

            foreach (var codice in iccid)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (codice.Equals(mezzo.ICCID))
                    {
                        listaMezziFromSede.Add(mezzo);
                    }
                }
            }

            return listaMezziFromSede;
        }

        public List<MezzoDTO> GetMezziFromRadioId(List<string> radioId)
        {
            var listaMezzi = Get();
            var listaMezziFromSede = new List<MezzoDTO>();

            foreach (var codice in radioId)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (codice.Equals(mezzo.IdRadio))
                    {
                        listaMezziFromSede.Add(mezzo);
                    }
                }
            }
            return listaMezziFromSede;
        }

        public List<MezzoDTO> GetMezziFromCodiceMezzo(List<string> codiciMezzo)
        {
            var listaMezzi = Get();
            var listaMezziFromCodici = new List<MezzoDTO>();

            foreach (var codice in codiciMezzo)
            {
                foreach (var mezzo in listaMezzi)
                {
                    if (codice.Equals(mezzo.Codice))
                    {
                        listaMezziFromCodici.Add(mezzo);
                    }
                }
            }
            return listaMezziFromCodici;
        }
    }
}
