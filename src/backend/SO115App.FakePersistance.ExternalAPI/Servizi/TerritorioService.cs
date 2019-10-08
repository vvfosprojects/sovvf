using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake
{
    public class TerritorioService
    {
        public async Task<List<Regione>> GetListaAlberaturaRegioni()
        {
            try
            {
                List<Regione> ListaRegioni = new List<Regione>();
                List<Provincia> ListaProvince = new List<Provincia>();
                List<Comune> ListaComuni = new List<Comune>();
                HttpClient client = new HttpClient();

                var responseRegioni = await client.GetStringAsync(Costanti.TerritorioGetRegioniUrl);
                var responseProvince = await client.GetStringAsync(Costanti.TerritorioGetProvinceUrl);
                var responseComuni = await client.GetStringAsync(Costanti.TerritorioGetComuniUrl);

                var ListRegioni = JsonConvert.DeserializeObject<RegioneDTO>(responseRegioni);
                var ListProvince = JsonConvert.DeserializeObject<ProvinciaDTO>(responseProvince);
                var ListComuni = JsonConvert.DeserializeObject<ComuneDTO>(responseComuni);

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
