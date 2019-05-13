using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.API.Models.Classi.Composizione
{
    public class ComposizioneSquadre
    {
        public string Id { get; set; }
        public Squadra1 Squadra { get; set; }
        public bool Selezionato { get; set; }
        public bool Hover { get; set; }
    }

    public class Squadra1
    {
        public string Nome { get; set; }
        public int Stato { get; set; }
        public List<Componenti> Componenti { get; set; }
        public Distaccamento Distaccamento { get; set; }
    }

    public class Componenti
    {
        public string DescrizioneQualifica { get; set; }
        public string Nominativo { get; set; }
        public string Tooltip { get; set; }
        public bool CapoPartenza { get; set; }
        public bool Autista { get; set; }
        public bool Rimpiazzo { get; set; }
    }
}
