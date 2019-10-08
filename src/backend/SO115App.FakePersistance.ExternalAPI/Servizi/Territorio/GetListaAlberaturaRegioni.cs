using Newtonsoft.Json;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Territorio
{
    public class GetListaAlberaturaRegioni : IGetAlberaturaISTAT
    {
        public List<Models.Classi.Condivise.Regione> ListaAlberaturaRegioni()
        {
            try
            {
                List<Regione> ListaRegioni = new List<Regione>();
                List<Provincia> ListaProvince = new List<Provincia>();
                List<Comune> ListaComuni = new List<Comune>();
                HttpClient client = new HttpClient();

                var responseRegioni = client.GetStringAsync(Costanti.TerritorioGetRegioniUrl);
                var responseProvince = client.GetStringAsync(Costanti.TerritorioGetProvinceUrl);
                var responseComuni = client.GetStringAsync(Costanti.TerritorioGetComuniUrl);

                var ListRegioni = JsonConvert.DeserializeObject<RegioneDTO>(responseRegioni.ToString());
                var ListProvince = JsonConvert.DeserializeObject<ProvinciaDTO>(responseProvince.ToString());
                var ListComuni = JsonConvert.DeserializeObject<ComuneDTO>(responseComuni.ToString());

                foreach (Regione regione in ListRegioni.dati)
                {
                    regione.ListaProvince = new List<Provincia>();
                    foreach (Provincia provincia in ListProvince.elenco)
                    {
                        if (provincia.codRegione.Length > 0)
                        {
                            if (Convert.ToInt32(regione.codRegioneISTAT).Equals(Convert.ToInt32(provincia.codRegione)))
                            {
                                regione.ListaProvince.Add(provincia);
                            }
                        }

                        provincia.ListaComuni = new List<Comune>();
                        foreach (Comune comune in ListComuni.dati)
                        {
                            if (comune.codProvincia.Length > 0)
                            {
                                if (provincia.codProvincia.Equals(comune.codProvincia))
                                {
                                    provincia.ListaComuni.Add(comune);
                                }
                            }
                        }
                    }
                    ListaRegioni.Add(regione);
                }

                return ListaRegioni;
            }
            catch (Exception ex)
            { return null; }
        }
    }
}
