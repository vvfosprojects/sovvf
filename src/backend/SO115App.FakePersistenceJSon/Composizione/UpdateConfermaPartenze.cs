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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class UpdateConfermaPartenze : IUpdateConfermaPartenze
    {
        public ConfermaPartenze Update(ConfermaPartenzeCommand command)
        {
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string filePathMezzi = "Fake/MezziComposizione.json";
            string filePathSquadre = "Fake/SquadreComposizione.json";
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

            RichiestaAssistenzaDTO richiestaDTO = new RichiestaAssistenzaDTO();
            ConfermaPartenze conferma = new ConfermaPartenze();
            RichiestaAssistenzaDTO richiestaNew = new RichiestaAssistenzaDTO();
            List<RichiestaAssistenzaDTO> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);
            List<ComposizioneMezzi> ListaMezzi = JsonConvert.DeserializeObject<List<ComposizioneMezzi>>(jsonMezzi);
            List<ComposizioneSquadre> ListaSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(jsonSquadre);

            if (ListaRichieste != null)
            {
                List<RichiestaAssistenza> ListaRichiesteNew = new List<RichiestaAssistenza>();
                richiestaDTO = ListaRichieste.Where(x => x.Codice == command.ConfermaPartenze.richiesta.Codice).FirstOrDefault();
                ListaRichieste.Remove(richiestaDTO);

                foreach (RichiestaAssistenzaDTO richiesta in ListaRichieste)
                {
                    ListaRichiesteNew.Add(MapperDTO.MapRichiestaDTOtoRichiesta(richiesta));
                }

                ListaRichiesteNew.Add(command.ConfermaPartenze.richiesta);

                string jsonListaPresente = JsonConvert.SerializeObject(ListaRichiesteNew);
                System.IO.File.WriteAllText(@"Fake/ListaRichiesteAssistenza.json", jsonListaPresente);
            }
            else
            {
                List<RichiestaAssistenza> ListaRichiesteNew = new List<RichiestaAssistenza>();
                ListaRichiesteNew.Add(command.ConfermaPartenze.richiesta);

                string jsonNew = JsonConvert.SerializeObject(ListaRichiesteNew);
                System.IO.File.WriteAllText(@"Fake/ListaRichiesteAssistenza.json", jsonNew);
            }

            foreach (ComposizionePartenze composizione in command.ConfermaPartenze.richiesta.Partenze)
            {
                foreach (ComposizioneMezzi composizioneMezzo in ListaMezzi)
                {
                    if (composizioneMezzo.Mezzo.Codice == composizione.Partenza.Mezzo.Codice)
                    {
                        composizioneMezzo.Mezzo.Stato = "In Viaggio";
                    }
                }

                foreach (ComposizioneSquadre composizioneSquadra in ListaSquadre)
                {
                    foreach (Squadra squadra in composizione.Partenza.Squadre)
                    {
                        if (composizioneSquadra.Squadra.Id == squadra.Id)
                        {
                            composizioneSquadra.Squadra.Stato = Squadra.StatoSquadra.InViaggio;
                        }
                    }
                }
            }

            string jsonListaMezzi = JsonConvert.SerializeObject(ListaMezzi);
            System.IO.File.WriteAllText(@"Fake/MezziComposizione.json", jsonListaMezzi);

            string jsonListaSquadre = JsonConvert.SerializeObject(ListaSquadre);
            System.IO.File.WriteAllText(@"Fake/SquadreComposizione.json", jsonListaSquadre);

            conferma.CodiceSede = command.ConfermaPartenze.CodiceSede;
            conferma.IdRichiesta = command.ConfermaPartenze.IdRichiesta;
            conferma.richiesta = command.ConfermaPartenze.richiesta;
            return conferma;
        }
    }
}
