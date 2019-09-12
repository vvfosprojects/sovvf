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

namespace SO115App.FakePersistence.JSon.Utility
{
    public class MapFromFlottaToMezziMarker
    {
        public List<MezzoMarker> MappaFlottaMezziSuMezziMarker(List<MapperMezziFromGeoFleet> flottaMezzi)
        {
            List<MezzoMarker> ListaMezziFlotta = new List<MezzoMarker>();
            String StatoMezzo = "";
            String CodiceSede = "";
            String CodiceTipo = "";
            String IdRic = "";

            foreach (MapperMezziFromGeoFleet mezzoFlotta in flottaMezzi)
            {
                if (mezzoFlotta.infoSO115 != null)
                    StatoMezzo = mezzoFlotta.infoSO115.stato;
                else
                    StatoMezzo = "0";

                if (mezzoFlotta.classiMezzo[2].Length == 2)
                    CodiceTipo = mezzoFlotta.classiMezzo[2];
                else if (mezzoFlotta.classiMezzo[0].Length == 2)
                    CodiceTipo = mezzoFlotta.classiMezzo[0];
                else if (mezzoFlotta.classiMezzo[1].Length == 2)
                    CodiceTipo = mezzoFlotta.classiMezzo[1];

                if (mezzoFlotta.classiMezzo[2].Contains(":"))
                    CodiceSede = mezzoFlotta.classiMezzo[2];
                else if (mezzoFlotta.classiMezzo[0].Contains(":"))
                    CodiceSede = mezzoFlotta.classiMezzo[0];
                else if (mezzoFlotta.classiMezzo[1].Contains(":"))
                    CodiceSede = mezzoFlotta.classiMezzo[1];

                if (StatoMezzo != "6" && StatoMezzo != "7" && StatoMezzo != "0")
                {
                    MezzoMarker mezzo = new MezzoMarker()
                    {
                        Mezzo = new API.Models.Classi.Condivise.Mezzo(mezzoFlotta.codiceMezzo, mezzoFlotta.codiceMezzo, CodiceTipo, GetStatoMezzoByCodiceMezzo(StatoMezzo), 0, GetSedeDiAppartenenza(CodiceSede)),
                        Coordinate = CodificaLocalizzazione(mezzoFlotta.Localizzazione),
                        InfoRichiesta = GetInfoRichiestaByCodiceMezzo(mezzoFlotta.codiceMezzo)
                    };
                    ListaMezziFlotta.Add(mezzo);
                }
            }

            return ListaMezziFlotta.Where(x => x.Mezzo.Distaccamento != null).ToList();
        }

        private InfoRichiesta GetInfoRichiestaByCodiceMezzo(string codiceMezzo)
        {
            MezzoMarker mezzoComp = new MezzoMarker();
            GetRichiestaById getRichiesta = new GetRichiestaById();
            RichiestaAssistenza richiesta = new RichiestaAssistenza();

            string idRichiesta;
            string filepath = CostantiJson.MezziComposizione;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<MezzoMarker> MezziComposizione = JsonConvert.DeserializeObject<List<MezzoMarker>>(json);

            mezzoComp = MezziComposizione.FirstOrDefault(x => x.Mezzo.Codice.Equals(codiceMezzo));

            if (mezzoComp != null)
            {
                richiesta = getRichiesta.Get(mezzoComp.Mezzo.IdRichiesta);
                InfoRichiesta info = new InfoRichiesta()
                {
                    CodiceRichiesta = richiesta.CodiceRichiesta,
                    Indirizzo = richiesta.Localita.Indirizzo
                };

                return info;
            }
            else
                return null;
        }

        public Coordinate CodificaLocalizzazione(coordinate localizzazione)
        {
            Coordinate coordinateMezzo = new Coordinate(Convert.ToDouble(localizzazione.lat.Replace(".", ",")), Convert.ToDouble(localizzazione.lon.Replace(".", ",")));

            return coordinateMezzo;
        }

        public Sede GetSedeDiAppartenenza(string codiceSede)
        {
            GetSedi getSedi = new GetSedi();
            string CodiceSedePulito = codiceSede.Split(':')[1] + ".1000";

            return getSedi.GetSedeByCodiceSede(CodiceSedePulito);
        }

        public string GetStatoMezzoByCodiceMezzo(string StatoMezzo)
        {
            string StatoMezzoDecodificato;
            switch (StatoMezzo)
            {
                case "0":
                    StatoMezzoDecodificato = "StatoSconosciuto";
                    break;

                case "1":
                    StatoMezzoDecodificato = "InViaggio";
                    break;

                case "2":
                    StatoMezzoDecodificato = "SulPosto";
                    break;

                case "3":
                    StatoMezzoDecodificato = "InRientro";
                    break;

                case "4":
                    StatoMezzoDecodificato = "InSede";
                    break;

                case "5":
                    StatoMezzoDecodificato = "Istituto";
                    break;

                case "6":
                    StatoMezzoDecodificato = "PosizioneRadioSenzaMezzo";
                    break;

                case "7":
                    StatoMezzoDecodificato = "FuoriServizio";
                    break;

                default:
                    StatoMezzoDecodificato = "InSede";
                    break;
            }

            return StatoMezzoDecodificato;
        }
    }
}
