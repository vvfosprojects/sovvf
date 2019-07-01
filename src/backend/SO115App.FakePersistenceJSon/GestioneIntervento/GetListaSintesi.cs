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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutoMapper;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Servizi.CustomMapper;

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
            MapperRichiestaAssistenzaSuSintesi Mapper = new MapperRichiestaAssistenzaSuSintesi(_mapper);
            List<SintesiRichiesta> ListaSintesiRichieste = new List<SintesiRichiesta>();
            List<RichiestaAssistenza> ListaRichiesteAssistenza = new List<RichiestaAssistenza>();
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);

            if (ListaRichieste != null)
            {
                foreach (RichiestaAssistenzaDTO richiesta in ListaRichieste)
                {
                    richiesta.Id = richiesta.CodiceRichiesta != null ? richiesta.CodiceRichiesta : richiesta.Codice;
                    ListaRichiesteAssistenza.Add(MapperDTO.MapRichiestaDTOtoRichiesta(richiesta));
                }

                foreach (RichiestaAssistenza richiesta in ListaRichiesteAssistenza)
                {
                    ListaSintesiRichieste.Add(Mapper.Map(richiesta));
                }

                ListaSintesiRichieste = ListaSintesiRichieste.OrderByDescending(x => x.IstanteRicezioneRichiesta).OrderBy(x => x.Stato).ToList();
                return ListaSintesiRichieste;
            }
            else
            {
                List<SintesiRichiesta> ListaSintesiRichiesteVuota = new List<SintesiRichiesta>();
                return ListaSintesiRichiesteVuota;
            }
        }

        private string MapStatoRichiesta(SintesiRichieste sintesi)
        {
            string stato = "Chiamata";

            if (sintesi.Chiusa)
                stato = "Chiusa";

            if (sintesi.Sospesa)
                stato = "Sospesa";

            if (sintesi.Aperta)
            {
                if (sintesi.Presidiato)
                    stato = "Presidiata";
                else if (sintesi.IstantePrimaAssegnazione != null)
                    stato = "Assegnata";
            }

            return stato;
        }
    }
}
