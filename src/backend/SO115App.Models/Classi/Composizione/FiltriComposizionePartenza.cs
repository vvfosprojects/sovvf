using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace SO115App.Models.Classi.Composizione
{
   public class FiltriComposizionePartenza
    {
        public string[] CodiceDistaccamento { get; set; }

        public string[] CodiceTipoMezzo { get; set; }

        public string[] CodiceStatoMezzo { get; set; }

        public string[] CodiceMezzo { get; set; }

        public string[] CodiceSquadra { get; set; }

    }
}
