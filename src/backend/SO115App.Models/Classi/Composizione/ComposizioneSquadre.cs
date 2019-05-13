using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.API.Models.Classi.Composizione
{
    public class ComposizioneSquadre
    {
        public string id { get; set; }
        public Squadra1 squadra { get; set; }
        public bool selezionato { get; set; }
        public bool hover { get; set; }
    }

    public class Squadra1
    {
        public string nome { get; set; }
        public int stato { get; set; }
        public List<Componenti> componenti { get; set; }
        public Distaccamento distaccamento { get; set; }
    }

    public class Componenti
    {
        public string descrizioneQualifica { get; set; }
        public string nominativo { get; set; }
        public string tooltip { get; set; }
        public bool capoPartenza { get; set; }
        public bool autista { get; set; }
        public bool rimpiazzo { get; set; }
    }
}
