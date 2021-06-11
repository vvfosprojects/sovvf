using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Composizione
{
    public class ComposizioneSquadra
    {
        public string Id { get; set; }
        public string Codice { get; set; }
        public string Nome { get; set; }
        public StatoSquadraComposizione Stato { get; set; }
        public List<MembroComposizione> Membri { get; set; }
        public string Distaccamento { get; set; }
        public char Turno { get; set; }
        public DateTime DataInServizio { get; set; }
        public MezzoPreaccoppiato MezzoPreaccoppiato { get; set; }
        public bool DiEmergenza { get; set; } = false;

        //public string[] MezziInRientro { get; set; }
    }
    
    public class MezzoPreaccoppiato
    {
        public string Codice { get; set; }
        public string Descrizione { get; set; }
        public string Genere { get; set; }
        public string Stato { get; set; }
    }

    public class MembroComposizione
    {
        public string CodiceFiscale { get; set; }
        public string DescrizioneQualifica { get; set; }
        public string Nominativo { get; set; }
        public bool CapoPartenza => DescrizioneQualifica == "TEAM_LEADER";
        public bool Autista => DescrizioneQualifica == "DRIVER";
        public bool Rimpiazzo => DescrizioneQualifica == "";
    }

    /// <summary>
    /// In questa enum non è presente lo stato "In uscita"
    /// </summary>
    public enum StatoSquadraComposizione { InSede, InRientro, InViaggio, SulPosto, Istituto, }
}
