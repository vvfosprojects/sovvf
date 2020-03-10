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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB
{
    public class GetRichiesta : IGetRichiestaById, IGetListaSintesi, IGetSintesiRichiestaAssistenzaByCodice
    {
        private readonly DbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IGetTipologieByCodice _getTipologiaByCodice;
        private readonly IGetListaDistaccamentiByCodiceSede _getAnagraficaDistaccamento;
        private readonly MapperRichiestaAssistenzaSuSintesi _mapperSintesi;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetRichiesta(DbContext dbContext, IMapper mapper, IGetTipologieByCodice getTipologiaByCodice, IGetListaDistaccamentiByCodiceSede getAnagraficaDistaccamento, MapperRichiestaAssistenzaSuSintesi mapperSintesi, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _getTipologiaByCodice = getTipologiaByCodice;
            _getAnagraficaDistaccamento = getAnagraficaDistaccamento;
            _mapperSintesi = mapperSintesi;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public RichiestaAssistenza GetByCodice(string codiceRichiesta)
        {
            return _dbContext.RichiestaAssistenzaCollection
                .Find(s => s.Codice == codiceRichiesta)
                .Single();
        }

        public RichiestaAssistenza GetById(string idRichiesta)
        {
            return _dbContext.RichiestaAssistenzaCollection.Find(s => s.Id == idRichiesta).Single();
        }

        public List<SintesiRichiesta> GetListaSintesiRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            var listaRichiesteAssistenza = new List<RichiestaAssistenza>();
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            foreach (var figlio in listaSediAlberate.GetSottoAlbero(filtro.UnitaOperative))
            {
                listaRichiesteAssistenza.AddRange(_dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Eq(x => x.CodSOCompetente, figlio.Codice)).ToList());
            }

            var listaSistesiRichieste = new List<SintesiRichiesta>();

            foreach (RichiestaAssistenza richiesta in listaRichiesteAssistenza)
            {
                SintesiRichiesta sintesi = new SintesiRichiesta();

                if (richiesta.CodUOCompetenza != null)
                {
                    sintesi = _mapperSintesi.Map(richiesta);
                    sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
                    listaSistesiRichieste.Add(sintesi);
                }
            }

            return listaSistesiRichieste.OrderByDescending(x => x.Stato == Costanti.Chiamata)
                    .ThenByDescending(x => x.PrioritaRichiesta)
                    .ThenBy(x => x.IstanteRicezioneRichiesta)
                    .ToList();
        }

        private List<Sede> MapCompetenze(string[] codUOCompetenza)
        {
            var ListaDistaccamenti = _getAnagraficaDistaccamento.GetListaDistaccamenti(codUOCompetenza[0].Split('.')[0]);
            List<Sede> ListaSedi = new List<Sede>();

            foreach (var codCompetenza in codUOCompetenza)
            {
                var Distaccamento = ListaDistaccamenti.Find(x => x.CodDistaccamento == Convert.ToInt32(codCompetenza.Split('.')[1]));
                Sede sede = Distaccamento == null ? null : new Sede(codCompetenza, Distaccamento.DescDistaccamento, Distaccamento.Indirizzo, Distaccamento.Coordinate, "", "", "", "", "");
                ListaSedi.Add(sede);
            }

            return ListaSedi;
        }

        public SintesiRichiesta GetSintesi(string codiceRichiesta)
        {
            var richiesta = GetByCodice(codiceRichiesta);
            var sintesi = new SintesiRichiesta();

            if (richiesta.CodUOCompetenza != null)
            {
                sintesi = _mapperSintesi.Map(richiesta);
                sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
            }

            return sintesi;
        }
    }
}
