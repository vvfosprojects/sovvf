using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiGateway.Classi
{
    public class Componente
    {
        /// <summary>
        ///   Descrizione codice fiscale Componente
        /// </summary>
        public string CodiceFiscale { get; set; }

        public string DescrizioneQualifica { get; set; }

        public DateTime OrarioInizio { get; set; }

        public DateTime OrarioFine { get; set; }
    }
}
