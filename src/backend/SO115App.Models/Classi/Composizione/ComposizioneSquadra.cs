using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Composizione
{
    public class ComposizioneSquadra
    {
        public string Id { get; set; }
        public string Codice { get; set; }
        public string Nome { get; set; }
        public string Stato { get; set; }
        public List<Componente> Componenti { get; set; }
        public string Distaccamento { get; set; }
        public string Turno { get; set; }
        public DateTime DataInServizio { get; set; }
        public List<MezzoPreaccoppiato> MezziPreaccoppiati { get; set; }
        public DateTime IstanteScadenzaSelezione { get; set; }
        public bool ColonnaMobile { get; set; } = false;
        public bool DiEmergenza { get; set; } = false;
    }
    
    public class MezzoPreaccoppiato
    {
        public string Codice { get; set; }
        public string Tipo { get; set; }
        public string Stato { get; set; }
    }
}
