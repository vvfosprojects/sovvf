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
using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.FakePersistence.JSon.Classi;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Box;

namespace SO115App.FakePersistenceJSon.Box
{
    public class GetRichieste : IGetBoxRichieste
    {
        public BoxInterventi Get()
        {
            BoxInterventi interventi = new BoxInterventi();
            List<RichiestaAssistenza> ListaRichiesteAssistenza = new List<RichiestaAssistenza>();
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            try
            {
                List<RichiestaAssistenzaDTO> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);

                interventi.AnnoCorrente = DateTime.Now.Year;

                if (ListaRichieste != null)
                {
                    foreach (RichiestaAssistenzaDTO richiesta in ListaRichieste)
                    {
                        richiesta.Id = richiesta.Codice;
                        ListaRichiesteAssistenza.Add(MapperDTO.MapRichiestaDTOtoRichiesta(richiesta));
                    }

                    interventi.Assegnati = ListaRichiesteAssistenza.FindAll(x => x.StatoRichiesta is Assegnata).Count;
                    interventi.Chiamate = ListaRichiesteAssistenza.FindAll(x => x.StatoRichiesta is InAttesa).Count;
                    interventi.NomeTurnoCorrente = "B";
                    interventi.NomeTurnoPrecedente = "A";
                    interventi.Presidiati = ListaRichiesteAssistenza.FindAll(x => x.StatoRichiesta is Presidiata).Count;
                    interventi.Sospesi = ListaRichiesteAssistenza.FindAll(x => x.StatoRichiesta is Sospesa).Count;
                    interventi.TotAnnoCorrente = ListaRichiesteAssistenza.FindAll(x => x.IstanteRicezioneRichiesta.Value.Year == DateTime.Now.Year).Count;
                    interventi.TotTurnoCorrente = ListaRichiesteAssistenza.FindAll(x => x.IstanteRicezioneRichiesta.Value.Year == DateTime.Now.Year).Count;
                    interventi.TotTurnoPrecedente = 0;
                    interventi.Totale = ListaRichiesteAssistenza.Count;
                }
            }
            catch (Exception ex) { }

            return interventi;
        }
    }
}
