using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Emergenza
{
    public class CreazioneCraDTO
    {
        public string IdEmergenza { get; set; }
        public DateTime istanteRichiestaCra { get; set; }
        public CraModel Cra { get; set; }
    }
}
