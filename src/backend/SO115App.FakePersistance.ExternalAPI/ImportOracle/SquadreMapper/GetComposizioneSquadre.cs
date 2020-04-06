using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.GetFiltri;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetListaSquadre _getSquadre;
        private readonly IGetFiltri _getFiltri;
        private readonly IGetRichiestaById _getRichiestaById;

        public GetComposizioneSquadre(IGetMezziUtilizzabili getMezziUtilizzabili, IGetListaSquadre getSquadre, IGetFiltri GetFiltri, IGetRichiestaById getRichiestaById)
        {
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getSquadre = getSquadre;
            _getFiltri = GetFiltri;
            _getRichiestaById = getRichiestaById;
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
