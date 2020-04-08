//-----------------------------------------------------------------------
// <copyright file="GetComposizioneSquadre.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.GetFiltri;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetListaSquadre _getSquadre;
        private readonly IGetFiltri _getFiltri;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetRichiestaById _getRichiestaById;

        public GetComposizioneSquadre(IGetMezziUtilizzabili getMezziUtilizzabili, IGetListaSquadre getSquadre, IGetFiltri getFiltri, IGetStatoSquadra getStatoSquadre, IGetRichiestaById getRichiestaById)
        {
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getSquadre = getSquadre;
            _getFiltri = getFiltri;
            _getStatoSquadre = getStatoSquadre;
            _getRichiestaById = getRichiestaById;
        }

        public List<ComposizioneSquadre> Get(ComposizioneSquadreQuery query)
        {
            var listaSedi = new List<string>
            {
                query.CodiceSede
            };            
            var listaSquadre = _getSquadre.Get(listaSedi).Result;
            var statiOperativi = _getStatoSquadre.Get(listaSedi);
            var composizioneSquadre = new List<ComposizioneSquadre>();

            foreach (Squadra s in listaSquadre)
            {
                if (statiOperativi.Exists(x => x.IdSquadra.Equals(s.Id)))
                {
                    s.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(statiOperativi.Find(x => x.IdSquadra.Equals(s.Id)).StatoSquadra);
                }
                var c = new ComposizioneSquadre
                {
                    Squadra = s,
                    Id = s.Id
                };
                composizioneSquadre.Add(c);
            }

            return composizioneSquadre;
        }
    }
}
