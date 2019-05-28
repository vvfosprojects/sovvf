using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace SO115App.Models.Classi.Composizione
{
   public class FiltriComposizionePartenza
    {
        [JsonRequired]
        public string[] CodiceDistaccamento { get; set; }

        [JsonRequired]
        public string[] CodiceTipoMezzo { get; set; }

        [JsonRequired]
        public string[] CodiceStatoMezzo { get; set; }

        [JsonRequired]
        public string[] CodiceMezzo { get; set; }

        [JsonRequired]
        public string[] CodiceSquadra { get; set; }

    }
}
