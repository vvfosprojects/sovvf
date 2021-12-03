using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Emergenza
{
    public class EmergenzaDTO
    {
        public string Id { get; set; }
        public string CodEmergenza { get; set; }
        public string Descrizione { get; set; }
        public Localita Localita { get; set; }
        public string CodComandoRichiedente { get; set; }
        public TipologiaEmergenza Tipologia { get; set; }
        public string CodSedePresaInCarico { get; set; }
        public bool Annullata { get; set; }
        public bool Allertata { get; set; }
        public string[] Dirigenti { get; set; }
        public CraModel Cra { get; set; }
        public List<ModuliColonnaMobile> ListaModuliImmediata { get; set; }
        public List<ModuliColonnaMobile> ListaModuliPotInt { get; set; }
        public List<ModuliColonnaMobile> ListaModuliConsolidamento { get; set; }
        public List<Evento> ListaEventi { get; set; }
    }
}
