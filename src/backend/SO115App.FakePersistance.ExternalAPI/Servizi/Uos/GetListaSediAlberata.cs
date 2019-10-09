using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.Uos;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Uos
{
    public class GetListaSediAlberata
    {
        public List<Sede> ListaSediAlberata()
        {
            try
            {
                List<UosDTO> ListaISP = new List<UosDTO>();
                List<UosDTO> ListaCMD = new List<UosDTO>();
                List<UosDTO> ListaDST = new List<UosDTO>();
                List<AssociativaDTO> ListaAssociazioni = new List<AssociativaDTO>();
                List<SedeDTO> ListaSedi = new List<SedeDTO>();

                HttpClient client = new HttpClient();

                var responseISP = client.GetStringAsync(Costanti.UosUrl + Costanti.UosUOUrl + String.Format("?codTipologia={0}&pageSize={1}", "ISP", "100"));
                var responseCMD = client.GetStringAsync(Costanti.UosUrl + Costanti.UosUOUrl + String.Format("?codTipologia={0}&pageSize={1}", "CMD", "100"));
                var responseDST = client.GetStringAsync(Costanti.UosUrl + Costanti.UosUOUrl + String.Format("?codTipologia={0}&pageSize={1}", "DST", "100"));
                var responseAss = client.GetStringAsync(Costanti.UosUrl + Costanti.UosAssUrl);
                var responseSedi = client.GetStringAsync(Costanti.UosUrl + Costanti.UosSediUrl);

                var ListIPS = JsonConvert.DeserializeObject<UosDTO>(responseISP.ToString());
                var ListCMD = JsonConvert.DeserializeObject<UosDTO>(responseCMD.ToString());
                var ListDST = JsonConvert.DeserializeObject<UosDTO>(responseDST.ToString());
                var ListAss = JsonConvert.DeserializeObject<AssociativaDTO>(responseAss.ToString());
                var ListSedi = JsonConvert.DeserializeObject<SedeDTO>(responseSedi.ToString());

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
