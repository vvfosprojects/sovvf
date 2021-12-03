using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Composizione;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Emergenza
{
    public class ModuliColonnaMobile
    {
        public string Id { get; set; }
        public string NomeModulo { get; set; }
        public string Stato { get; set; }
        public string CodComando { get; set; }
        public List<MembroComposizione> Componenti { get; set; }
        public List<Mezzo> Mezzi { get; set; }
        public bool SediAllertate { get; set; }
    }
}
