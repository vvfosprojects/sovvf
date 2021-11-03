using SO115App.API.Models.Classi.Composizione;
using SO115App.Models.Classi.Composizione;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Emergenza
{
    public class ModuliColonnaMobile
    {
        public string NomeModulo { get; set; }
        public string Stato { get; set; }
        public List<ComposizioneSquadra> Squadre { get; set; }
        public List<ComposizioneMezzi> Mezzi { get; set; }
    }
}
