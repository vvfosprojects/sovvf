using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        private readonly IGetListaSquadre _getSquadre;

        public GetComposizioneSquadre(IGetListaSquadre getSquadre)
        {
            _getSquadre = getSquadre;
        }

        public List<ComposizioneSquadre> Get(ComposizioneSquadreQuery query)
        {
            List<string> ListaSedi = new List<string>();
            ListaSedi.Add(query.CodiceSede);
            var ListaSquadre = _getSquadre.Get(ListaSedi).Result;

            var composizioneSquadre = new List<ComposizioneSquadre>();

            foreach (Squadra s in ListaSquadre)
            {
                ComposizioneSquadre c = new ComposizioneSquadre();
                c.Squadra = s;
                c.Id = s.Id;
                composizioneSquadre.Add(c);
            }

            return composizioneSquadre;
        }
    }
}
