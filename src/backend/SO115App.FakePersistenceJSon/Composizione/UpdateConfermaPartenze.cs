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
using SO115App.API.Models.Classi.Soccorso;
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
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            RichiestaAssistenzaDTO richiestaDTO = new RichiestaAssistenzaDTO();
            ConfermaPartenze conferma = new ConfermaPartenze();
            RichiestaAssistenzaDTO richiestaNew = new RichiestaAssistenzaDTO();
            List<RichiestaAssistenzaDTO> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);

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

            //richiestaDTO = ListaRichieste.Where(x => x.Codice == command.ConfermaPartenze.richiesta.Codice).FirstOrDefault();
            //ListaRichieste.Remove(richiestaDTO);
            //richiestaNew = new RichiestaAssistenzaDTO
            //{
            //    Codice = command.ConfermaPartenze.richiesta.Codice,
            //    CodiceUnitaOperativaCompetente = command.ConfermaPartenze.richiesta.CodiceUnitaOperativaCompetente,
            //    CodiciUOCompetenza = command.ConfermaPartenze.richiesta.CodiciUOCompetenza,
            //    CodiciUnitaOperativeAllertate = command.ConfermaPartenze.richiesta.CodiciUnitaOperativeAllertate,
            //    Competenze = command.ConfermaPartenze.richiesta.Competenze,
            //    Descrizione = command.ConfermaPartenze.richiesta.Descrizione,
            //    IstanteChiusura = command.ConfermaPartenze.richiesta.IstanteChiusura,
            //    ListaEntiIntervenuti = command.ConfermaPartenze.richiesta.ListaEntiIntervenuti,
            //    Localita = command.ConfermaPartenze.richiesta.Localita,
            //    ObiettivoSensibile = command.ConfermaPartenze.richiesta.ObiettivoSensibile,
            //    Operatore = command.ConfermaPartenze.richiesta.Operatore,
            //    Richiedente = command.ConfermaPartenze.richiesta.Richiedente,
            //    RilevanzaStArCu = command.ConfermaPartenze.richiesta.RilevanteStArCu,
            //    Tags = command.ConfermaPartenze.richiesta.Tags,
            //    Tipologie = command.ConfermaPartenze.richiesta.Tipologie,
            //    TipoTerreno = command.ConfermaPartenze.richiesta.TipoTerreno,
            //    TurnoInserimentoChiamata = command.ConfermaPartenze.richiesta.TurnoInserimentoChiamata,
            //    TurnoIntervento = command.ConfermaPartenze.richiesta.TurnoIntervento,
            //    ZoneEmergenza = command.ConfermaPartenze.richiesta.ZoneEmergenza
            //};
            //ListaRichieste.Add(richiestaNew);
            //string fileText = System.IO.File.ReadAllText(@"Fake/ListaRichiesteAssistenza.json");
            //string jsonNew = JsonConvert.SerializeObject(ListaRichieste);
            //System.IO.File.WriteAllText(@"Fake/ListaRichiesteAssistenza.json", jsonNew);
            conferma.CodiceSede = command.ConfermaPartenze.CodiceSede;
            conferma.IdRichiesta = command.ConfermaPartenze.IdRichiesta;
            conferma.richiesta = command.ConfermaPartenze.richiesta;
            return conferma;
        }
    }
}
