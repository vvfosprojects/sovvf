using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.API.Models.Classi.Composizione
{
    public class PreAccoppiati
    {
        public string IdPreAccoppiato { get; set; }
        public ComposizioneMezzi MezzoComposizione { get; set; }
        public List<ComposizioneSquadre> SquadraComposizione { get; set; }
        public bool Selezionato { get; set; }
        public bool Hover { get; set; }
    }
}
