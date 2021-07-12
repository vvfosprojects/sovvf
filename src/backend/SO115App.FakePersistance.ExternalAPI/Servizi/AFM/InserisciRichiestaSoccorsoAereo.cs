﻿using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class InserisciRichiestaSoccorsoAereo : IInserisciRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<InfoAFM> _client;
        public InserisciRichiestaSoccorsoAereo(IHttpRequestManager<InfoAFM> client) => _client = client;

        public void Inserisci(NuovaRichiestaAFM richiesta)
        {
            var jsonString = JsonConvert.SerializeObject(richiesta);
            var content = new StringContent(jsonString);

            //TODO SOSTITUIRE UTENZA
            var result = _client.PutAsync(new Uri(Costanti.AFM + "rescueRequest"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q", content).Result;
        }
    }
}
