//-----------------------------------------------------------------------
// <copyright file="GetListaSintesi.cs" company="CNVVF">
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
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CustomMapper;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetListaSintesi : IGetListaSintesi
    {
        private readonly IMapper _mapper;

        public GetListaSintesi(IMapper mapper)
        {
            _mapper = mapper;
        }

        public List<SintesiRichiesta> GetListaSintesiRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            var mapper = new MapperRichiestaAssistenzaSuSintesi(_mapper);
            var listaSintesiRichieste = new List<SintesiRichiesta>();
            var listaSintesiRichiesteVuota = new List<SintesiRichiesta>();
            var listaRichiesteAssistenza = new List<RichiestaAssistenza>();
            string filepath = CostantiJson.ListaRichiesteAssistenza;
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);

            if (listaRichieste != null)
            {
                foreach (RichiestaAssistenzaDTO richiesta in listaRichieste)
                {
                    richiesta.Id = richiesta.Cod;
                    listaRichiesteAssistenza.Add(MapperDTO.MapRichiestaDTOtoRichiesta(richiesta));
                }

                foreach (RichiestaAssistenza richiesta in listaRichiesteAssistenza)
                {
                    listaSintesiRichieste.Add(mapper.Map(richiesta));
                }

                listaSintesiRichieste = listaSintesiRichieste.OrderByDescending(x => x.Stato == Costanti.Chiamata)
                    .ThenByDescending(x => x.PrioritaRichiesta)
                    .ThenBy(x => x.IstanteRicezioneRichiesta)
                    .ToList();

                return listaSintesiRichieste;
            }

            return listaSintesiRichiesteVuota;
        }
    }
}
