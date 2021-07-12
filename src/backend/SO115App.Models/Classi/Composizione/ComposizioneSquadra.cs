using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Composizione
{
    public class ComposizioneSquadra
    {
        public string Codice { get; set; }
        public string Nome { get; set; }
        public StatoSquadraComposizione Stato { get; set; }
        public List<MembroComposizione> Membri { get; set; }
        public DistaccamentoComposizione Distaccamento { get; set; }
        public char Turno { get; set; }
        public List<MezzoPreaccoppiato> MezziPreaccoppiati { get; set; } = null;
        public bool DiEmergenza { get; set; } = false;
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

    public class DistaccamentoComposizione
    {
        public string Codice { get; set; }
        public string Descrizione { get; set; }
        public Coordinate Coordinate { get; set; }
        public string Indirizzo { get; set; }
        public string Tipo { get; set; }
        public string Regione { get; set; }
        public string Provincia { get; set; }
    }

    public enum StatoSquadraComposizione { InSede, InRientro, InViaggio, SulPosto, Istituto, InUscita }
}
