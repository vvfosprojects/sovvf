using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace SO115App.API.Models.Classi.Composizione
{
    public class MezzoPrenotato
    {
        [JsonRequired]
        public string IdOperatore { get; set; }

        public string NomeOperatore { get; set; }

        [JsonRequired]
        public string IdMezzoComposizione { get; set; }
    }
}
