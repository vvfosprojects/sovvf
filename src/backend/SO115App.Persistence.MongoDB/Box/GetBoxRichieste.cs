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
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.Models.Servizi.Infrastruttura.Box;
using System;
using System.Linq;

namespace SO115App.Persistence.MongoDB
{
    public class GetBoxRichieste : IGetBoxRichieste
    {
        private readonly DbContext _dbContext;

        public GetBoxRichieste(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public BoxInterventi Get()
        {
            var interventi = new BoxInterventi();
            var ListaRichiesteAssistenza = _dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Empty).ToList();

            if (ListaRichiesteAssistenza.Count > 0)
            {
                interventi.Assegnati = ListaRichiesteAssistenza.FindAll(x => x.StatoRichiesta is Assegnata).Count;
                interventi.Chiamate = ListaRichiesteAssistenza.FindAll(x => x.StatoRichiesta is InAttesa).Count;
                interventi.Presidiati = ListaRichiesteAssistenza.FindAll(x => x.StatoRichiesta is Presidiata).Count;
                interventi.Sospesi = ListaRichiesteAssistenza.FindAll(x => x.StatoRichiesta is Sospesa).Count;
                interventi.TotAnnoCorrente = ListaRichiesteAssistenza.FindAll(x => x.IstanteRicezioneRichiesta.Value.Year == DateTime.Now.Year).Count;
                interventi.TotTurnoCorrente = ListaRichiesteAssistenza.FindAll(x => x.IstanteRicezioneRichiesta.Value.Year == DateTime.Now.Year).Count;
                interventi.TotTurnoPrecedente = 0;
                interventi.Totale = ListaRichiesteAssistenza.Count;
            }

            return interventi;
        }
    }
}
