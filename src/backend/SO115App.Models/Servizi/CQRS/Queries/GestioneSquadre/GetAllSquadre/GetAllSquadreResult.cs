using SO115App.Models.Classi.Composizione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSquadre.GetAllSquadre
{
    public class GetAllSquadreResult
    {
        public List<ComposizioneSquadra> DataArray { get; set; }
    }
}
