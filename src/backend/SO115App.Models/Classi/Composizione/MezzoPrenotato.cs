using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace SO115App.API.Models.Classi.Composizione
{
    public class MezzoPrenotato
    {
        [JsonRequired]
        public string IdRichiesta { get; set; }

        [JsonRequired]
        public string IdMezzoComposizione { get; set; }
    }
}
