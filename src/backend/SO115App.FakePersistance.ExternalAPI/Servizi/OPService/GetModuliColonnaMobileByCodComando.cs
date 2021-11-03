using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class GetModuliColonnaMobileByCodComando : IGetModuliColonnaMobileByCodComando
    {
        public List<ModuliColonnaMobile> Get(string codComando, TipologiaEmergenza Tipologia)
        {
            throw new NotImplementedException();
        }
    }
}
