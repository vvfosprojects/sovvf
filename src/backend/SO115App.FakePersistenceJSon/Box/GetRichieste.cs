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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Servizi.Infrastruttura.Box;

namespace SO115App.FakePersistenceJSon.Box
{
    public class GetRichieste : IGetBoxRichieste
    {
        public BoxInterventi Get()
        {
            BoxInterventi interventi = new BoxInterventi();
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<SintesiRichiesta> ListaRichieste = JsonConvert.DeserializeObject<List<SintesiRichiesta>>(json);

            if (ListaRichieste != null)
            {
                interventi.AnnoCorrente = DateTime.Now.Year;
                interventi.Assegnati = ListaRichieste.FindAll(x => x.Stato == "Assegnata").Count;
                interventi.Chiamate = ListaRichieste.FindAll(x => x.Stato == "Chiamata").Count;
                interventi.NomeTurnoCorrente = "B";
                interventi.NomeTurnoPrecedente = "A";
                interventi.Presidiati = ListaRichieste.FindAll(x => x.Stato == "Presidiata").Count;
                interventi.Sospesi = ListaRichieste.FindAll(x => x.Stato == "Sospesa").Count;
                interventi.TotAnnoCorrente = ListaRichieste.FindAll(x => x.IstanteRicezioneRichiesta.Year == DateTime.Now.Year).Count;
                interventi.TotTurnoCorrente = ListaRichieste.FindAll(x => x.IstanteRicezioneRichiesta.Year == DateTime.Now.Year).Count;
                interventi.TotTurnoPrecedente = 0;
                interventi.Totale = ListaRichieste.Count;
            }

            return interventi;
        }
    }
}
