﻿using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class AggiornaRichiestaSoccorsoAereo : BaseService, IAggiornaRichiestaSoccorsoAereo
    {
        public AggiornaRichiestaSoccorsoAereo(HttpClient client, IConfiguration configuration, IMemoryCache cache, IWriteLog log, IHttpContextAccessor accessor)
        : base(client, configuration, cache, log, accessor) { }

        public void Aggiorna(NuovaRichiestaSoccorsoAereo richiesta)
        {
            throw new NotImplementedException();
        }
    }
}
