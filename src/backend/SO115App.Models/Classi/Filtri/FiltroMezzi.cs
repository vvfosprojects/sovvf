using System.Collections.Generic;

namespace SO115App.Models.Classi.Filtri
{
    public class FiltroMezzi
    {
        public List<string> Tipologia;
        public List<string> Stato;
        public bool FiltraPerAreaMappa { get; set; } = false;
    }
}
