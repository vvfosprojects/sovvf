using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using System.Collections.Generic;


namespace SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre
{
    public interface IGetComposizioneSquadre
    {
        List<ComposizioneSquadre> Get(ComposizioneSquadreQuery query);
    }
}

