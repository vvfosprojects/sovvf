using Persistence.MongoDB;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneEmergenza
{
    public class GetCodiceEmergenza : IGetCodiceEmergenza
    {
        private readonly IGetEmergenzeByCodComando _emergenzeByCodComando;

        public GetCodiceEmergenza(IGetEmergenzeByCodComando emergenzeByCodComando)
        {
            _emergenzeByCodComando = emergenzeByCodComando;
        }

        public string Get(string codComando, string Tipologia)
        {
            var MaxCodiceEmergenze = _emergenzeByCodComando.Get(codComando).FindAll(e => e.CodComandoRichiedente.Equals(codComando) && e.Tipologia.ToString().Equals(Tipologia)).LastOrDefault();

            if (MaxCodiceEmergenze != null)
            {
                return $"{Tipologia.ToString().Substring(0, 3)}{DateTime.Now.Year}{DateTime.Now.Month}{DateTime.Now.Day}-{Convert.ToInt32(MaxCodiceEmergenze.CodEmergenza.Split('-')[1]) + 1}";
            }
            else
            {
                return $"{Tipologia.ToString().Substring(0, 3)}{DateTime.Now.Year}{DateTime.Now.Month}{DateTime.Now.Day}-1";
            }
        }
    }
}
