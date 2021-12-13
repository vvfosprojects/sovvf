using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.Composizione
{
    public class ComposizioneSquadra
    {
        public string Id { get; set; }
        public string Codice { get; set; }
        public string Nome { get; set; }
        public char Turno { get; set; }
        public bool DiEmergenza { get; set; } = false;
        public StatoSquadraComposizione Stato { get; set; }
        public string Tipologia { get; set; }
        public DistaccamentoComposizione Distaccamento { get; set; }
        public List<MembroComposizione> Membri { get; set; } = null;
        public List<MezzoPreaccoppiato> MezziPreaccoppiati { get; set; } = null;
        public List<MezzoInRientro> MezziInRientro { get; set; } = null;
    }

    public class MezzoInRientro
    {
        [JsonPropertyName("Id")]
        public string IDD { get; set; }
        public MezzoPreaccoppiato Mezzo { get; set; }
    }

    public class MezzoPreaccoppiato
    {
        public string Codice { get; set; }
        public string Descrizione { get; set; }
        public string Distaccamento { get; set; }
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
        public Qualifiche[] Qualifications { get; set; }
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
