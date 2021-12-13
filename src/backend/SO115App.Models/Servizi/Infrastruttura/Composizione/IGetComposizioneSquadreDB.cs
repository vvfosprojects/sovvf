using SO115App.Models.Classi.Composizione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.Composizione
{
    public interface IGetComposizioneSquadreDB
    {
        List<ComposizioneSquadra> Get();
    }
}
