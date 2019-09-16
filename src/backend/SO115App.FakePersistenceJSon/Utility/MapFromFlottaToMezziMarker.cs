using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Marker;
using SO115App.FakePersistence.JSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.Utility;

namespace SO115App.FakePersistence.JSon.Utility
{
    public class MapFromFlottaToMezziMarker
    {
        public List<MezzoMarker> MappaFlottaMezziSuMezziMarker(List<MapperMezziFromGeoFleet> flottaMezzi)
        {
            var listaMezziFlotta = new List<MezzoMarker>();
            var codiceSede = "";
            var codiceTipo = "";

            foreach (var mezzoFlotta in flottaMezzi)
            {
                var statoMezzo = "";
                if (mezzoFlotta.infoSO115 != null)
                    statoMezzo = mezzoFlotta.infoSO115.stato;
                else
                    statoMezzo = "0";

                if (mezzoFlotta.classiMezzo[2].Length == 2)
                    codiceTipo = mezzoFlotta.classiMezzo[2];
                else if (mezzoFlotta.classiMezzo[0].Length == 2)
                    codiceTipo = mezzoFlotta.classiMezzo[0];
                else if (mezzoFlotta.classiMezzo[1].Length == 2)
                    codiceTipo = mezzoFlotta.classiMezzo[1];

                if (mezzoFlotta.classiMezzo[2].Contains(":"))
                    codiceSede = mezzoFlotta.classiMezzo[2];
                else if (mezzoFlotta.classiMezzo[0].Contains(":"))
                    codiceSede = mezzoFlotta.classiMezzo[0];
                else if (mezzoFlotta.classiMezzo[1].Contains(":"))
                    codiceSede = mezzoFlotta.classiMezzo[1];

                if (statoMezzo == "6" || statoMezzo == "7" || statoMezzo == "0") continue;

                var mezzo = new MezzoMarker()
                {
                    Mezzo = new Mezzo(mezzoFlotta.codiceMezzo, mezzoFlotta.codiceMezzo, codiceTipo, GetStatoMezzoByCodiceMezzo(statoMezzo), 0, GetSedeDiAppartenenza(codiceSede), CodificaLocalizzazione(mezzoFlotta.Localizzazione)),
                    Coordinate = CodificaLocalizzazione(mezzoFlotta.Localizzazione),
                    InfoRichiesta = GetInfoRichiestaByCodiceMezzo(mezzoFlotta.codiceMezzo)
                };
                listaMezziFlotta.Add(mezzo);
            }

            return listaMezziFlotta.Where(x => x.Mezzo.Distaccamento != null).ToList();
        }

        private static InfoRichiesta GetInfoRichiestaByCodiceMezzo(string codiceMezzo)
        {
            var getRichiesta = new GetRichiestaById();

            var filepath = CostantiJson.MezziComposizione;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var mezziComposizione = JsonConvert.DeserializeObject<List<MezzoMarker>>(json);

            var mezzoComp = mezziComposizione.Find(x => x.Mezzo.Codice.Equals(codiceMezzo));

            if (mezzoComp == null) return null;

            var richiesta = getRichiesta.Get(mezzoComp.Mezzo.IdRichiesta);
            if (richiesta == null) return null;

            return new InfoRichiesta()
            {
                CodiceRichiesta = richiesta.CodiceRichiesta,
                Indirizzo = richiesta.Localita.Indirizzo
            };
        }

        public Coordinate CodificaLocalizzazione(coordinate localizzazione)
        {
            var coordinate = new Coordinate(Convert.ToDouble(localizzazione.lat),
                Convert.ToDouble(localizzazione.lon));
            //return new Coordinate(Convert.ToDouble(localizzazione.lat.Replace(".", ",")), Convert.ToDouble(localizzazione.lon.Replace(".", ",")));
            return coordinate;
        }

        public Sede GetSedeDiAppartenenza(string codiceSede)
        {
            var getSedi = new GetSedi();
            var codiceSedePulito = codiceSede.Split(':')[1] + ".1000";

            return getSedi.GetSedeByCodiceSede(codiceSedePulito);
        }

        public List<Mezzo> MappaFlottaMezziSuMezzo(List<MapperMezziFromGeoFleet> flottaMezzi)
        {
            var listaMezzi = new List<Mezzo>();
            var codiceSede = "";
            var codiceTipo = "";

            foreach (var mezzoFlotta in flottaMezzi)
            {
                var statoMezzo = "";
                if (mezzoFlotta.infoSO115 != null)
                    statoMezzo = mezzoFlotta.infoSO115.stato;
                else
                    statoMezzo = "0";

                if (mezzoFlotta.classiMezzo[2].Length == 2)
                    codiceTipo = mezzoFlotta.classiMezzo[2];
                else if (mezzoFlotta.classiMezzo[0].Length == 2)
                    codiceTipo = mezzoFlotta.classiMezzo[0];
                else if (mezzoFlotta.classiMezzo[1].Length == 2)
                    codiceTipo = mezzoFlotta.classiMezzo[1];

                if (mezzoFlotta.classiMezzo[2].Contains(":"))
                    codiceSede = mezzoFlotta.classiMezzo[2];
                else if (mezzoFlotta.classiMezzo[0].Contains(":"))
                    codiceSede = mezzoFlotta.classiMezzo[0];
                else if (mezzoFlotta.classiMezzo[1].Contains(":"))
                    codiceSede = mezzoFlotta.classiMezzo[1];

                if (statoMezzo == "6" || statoMezzo == "7" || statoMezzo == "0") continue;

                var mezzo = new Mezzo(mezzoFlotta.codiceMezzo, mezzoFlotta.codiceMezzo, codiceTipo,
                    GetStatoMezzoByCodiceMezzo(statoMezzo), 0, GetSedeDiAppartenenza(codiceSede), CodificaLocalizzazione(mezzoFlotta.Localizzazione));
                listaMezzi.Add(mezzo);
            }

            return listaMezzi;
        }

        public string GetStatoMezzoByCodiceMezzo(string statoMezzo)
        {
            string statoMezzoDecodificato;
            switch (statoMezzo)
            {
                case "0":
                    statoMezzoDecodificato = Costanti.MezzoStatoSconosciuto;
                    break;

                case "1":
                    statoMezzoDecodificato = Costanti.MezzoInViaggio;
                    break;

                case "2":
                    statoMezzoDecodificato = Costanti.MezzoSulPosto;
                    break;

                case "3":
                    statoMezzoDecodificato = Costanti.MezzoInRientro;
                    break;

                case "4":
                    statoMezzoDecodificato = Costanti.MezzoInSede;
                    break;

                case "5":
                    statoMezzoDecodificato = Costanti.MezzoIstituto;
                    break;

                case "6":
                    statoMezzoDecodificato = Costanti.PosizioneRadioSenzaMezzo;
                    break;

                case "7":
                    statoMezzoDecodificato = Costanti.MezzoFuoriServizio;
                    break;

                default:
                    statoMezzoDecodificato = Costanti.MezzoInSede;
                    break;
            }

            return statoMezzoDecodificato;
        }
    }
}
