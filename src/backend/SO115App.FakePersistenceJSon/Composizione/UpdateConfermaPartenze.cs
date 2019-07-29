//-----------------------------------------------------------------------
// <copyright file="UpDateRichiesta.cs" company="CNVVF">
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

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class UpdateConfermaPartenze : IUpdateConfermaPartenze
    {
        public ConfermaPartenze Update(ConfermaPartenzeCommand command)
        {
            var filepath = CostantiJson.ListaRichiesteAssistenza;
            var filePathMezzi = CostantiJson.MezziComposizione;
            var filePathSquadre = CostantiJson.SquadreComposizione;
            string json;
            string jsonMezzi;
            string jsonSquadre;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            using (StreamReader r = new StreamReader(filePathMezzi))
            {
                jsonMezzi = r.ReadToEnd();
            }

            using (StreamReader r = new StreamReader(filePathSquadre))
            {
                jsonSquadre = r.ReadToEnd();
            }

            var richiestaDTO = new RichiestaAssistenzaDTO();
            var conferma = new ConfermaPartenze();
            var richiestaNew = new RichiestaAssistenzaDTO();
            var listaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);
            var listaMezzi = JsonConvert.DeserializeObject<List<ComposizioneMezzi>>(jsonMezzi);
            var listaSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(jsonSquadre);
            var listaRichiesteNew = new List<RichiestaAssistenza>();

            if (listaRichieste != null)
            {
                richiestaDTO = listaRichieste.Find(x => x.Codice == command.ConfermaPartenze.richiesta.Codice);
                listaRichieste.Remove(richiestaDTO);

                foreach (var richiesta in listaRichieste)
                {
                    listaRichiesteNew.Add(MapperDTO.MapRichiestaDTOtoRichiesta(richiesta));
                }

                listaRichiesteNew.Add(command.ConfermaPartenze.richiesta);

                var jsonListaPresente = JsonConvert.SerializeObject(listaRichiesteNew);
                System.IO.File.WriteAllText(CostantiJson.ListaRichiesteAssistenza, jsonListaPresente);
            }
            else
            {
                listaRichiesteNew = new List<RichiestaAssistenza>
                {
                    command.ConfermaPartenze.richiesta
                };

                var jsonNew = JsonConvert.SerializeObject(listaRichiesteNew);
                System.IO.File.WriteAllText(CostantiJson.ListaRichiesteAssistenza, jsonNew);
            }

            foreach (var composizione in command.ConfermaPartenze.richiesta.Partenze)
            {
                foreach (var composizioneMezzo in listaMezzi)
                {
                    if (composizioneMezzo.Mezzo.Codice != composizione.Partenza.Mezzo.Codice) continue;
                    composizioneMezzo.Mezzo.Stato = Costanti.MezzoInViaggio;
                    composizioneMezzo.Mezzo.IdRichiesta = command.ConfermaPartenze.IdRichiesta;
                }

                foreach (var composizioneSquadra in listaSquadre)
                {
                    foreach (var squadra in composizione.Partenza.Squadre)
                    {
                        if (composizioneSquadra.Squadra.Id == squadra.Id)
                        {
                            composizioneSquadra.Squadra.Stato = Squadra.StatoSquadra.InViaggio;
                        }
                    }
                }
            }

            var jsonListaMezzi = JsonConvert.SerializeObject(listaMezzi);
            System.IO.File.WriteAllText(CostantiJson.MezziComposizione, jsonListaMezzi);

            var jsonListaSquadre = JsonConvert.SerializeObject(listaSquadre);
            System.IO.File.WriteAllText(CostantiJson.SquadreComposizione, jsonListaSquadre);

            conferma.CodiceSede = command.ConfermaPartenze.CodiceSede;
            conferma.IdRichiesta = command.ConfermaPartenze.IdRichiesta;
            conferma.richiesta = command.ConfermaPartenze.richiesta;
            return conferma;
        }
    }
}
