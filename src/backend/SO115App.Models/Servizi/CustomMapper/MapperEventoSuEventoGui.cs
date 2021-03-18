using SO115App.API.Models.Classi.Autenticazione;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperEventoSuEventoGui
    {
        public string Id { get; set; }
        public string NomeClasseEvento { get; set; }
        public DateTime IstanteEvento { get; set; }
        public string Targa { get; set; }
        public string Note { get; set; }
        public object HTMLLinkElement { get; set; }
        public String Operatore { get; set; }
    }
}
