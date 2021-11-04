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

        public string GetCodProvinciale(string Regione, string Provincia, string Tipologia)
        {
            //Primi 2 identificano l'emergenza ( Es. Terremoto = TE )
            //Successivi 3 identificano la Regione
            //Successivi 2 identificano la Provincia
            //Successivi 8 identificano Giorno/Mese/Anno (ggMMAAAA)
            return $"{Tipologia.ToString().Substring(0, 2)}{Regione.ToString().Substring(0, 3)}{Provincia.ToString().Substring(0, 2)}{DateTime.Now.Day}{DateTime.Now.Month}{DateTime.Now.Year}";
        }

        public string GetCodRegionale(string Regione, string Tipologia)
        {
            //Primi 2 identificano l'emergenza ( Es. Terremoto = TE )
            //Successivi 3 identificano la Regione
            //Successivi 8 identificano Giorno/Mese/Anno (ggMMAAAA)
            return $"{Tipologia.ToString().Substring(0, 2)}{Regione.ToString().Substring(0, 3)}{DateTime.Now.Day}{DateTime.Now.Month}{DateTime.Now.Year}";
        }

        public string GetCodCon(string Tipologia)
        {
            var CodEmergenzeEsistenti = _emergenzeByCodComando.Get("CON").Select(p => p.CodEmergenza);

            List<int> ListaProgressivi = new List<int>();
            foreach (var codice in CodEmergenzeEsistenti)
            {
                ListaProgressivi.Add(Convert.ToInt32(codice.Substring(5, 2)));
            }

            var NuovoProgressivo = ListaProgressivi.Max() + 1;

            //Primi 2 identificano l'emergenza ( Es. Terremoto = TE )
            //Successivi 3 identificano CON
            //Successivi 2 identificano un progressivo da 01 a 99
            //Successivi 8 identificano Giorno/Mese/Anno (ggMMAAAA)
            return $"{Tipologia.ToString().Substring(0, 2)}CON{string.Format("{0:D2}", NuovoProgressivo)}{DateTime.Now.Day}{DateTime.Now.Month}{DateTime.Now.Year}";
        }
    }
}
