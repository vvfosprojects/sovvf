//-----------------------------------------------------------------------
// <copyright file="GetRichieste.cs" company="CNVVF">
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
using AutoMapper;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB
{
    public class GetRichiesta : IGetRichiestaById, IGetListaSintesi
    {
        private readonly DbContext _dbContext;
        private readonly IMapper _mapper;

        public GetRichiesta(DbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public RichiestaAssistenza Get(string idRichiestaAssistenza)
        {
            return _dbContext.RichiestaAssistenzaCollection
                .Find(s => s.Codice == idRichiestaAssistenza)
                .Single();
        }

        public List<SintesiRichiesta> GetListaSintesiRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            var ListaRichiesteAssistenza = _dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Empty).ToList();

            MapperRichiestaAssistenzaSuSintesi mapSintesi = new MapperRichiestaAssistenzaSuSintesi(_mapper);

            var ListaSistesiRichieste = new List<SintesiRichiesta>();

            foreach (RichiestaAssistenza richiesta in ListaRichiesteAssistenza)
            {
                SintesiRichiesta sintesi = new SintesiRichiesta();

                if (richiesta.CodUOCompetenza.Where(x => filtro.CodUOCompetenza.Contains(x)).ToList().Count > 0)
                {
                    sintesi = mapSintesi.Map(richiesta);
                    ListaSistesiRichieste.Add(sintesi);
                }
            }

            return ListaSistesiRichieste;
        }
    }
}
