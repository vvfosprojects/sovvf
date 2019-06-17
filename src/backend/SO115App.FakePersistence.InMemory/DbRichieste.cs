//-----------------------------------------------------------------------
// <copyright file="Richieste.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.FakePersistence.InMemory
{
    public class DbRichieste : ISaveRichiestaAssistenza
    {
        private readonly Dictionary<string, RichiestaAssistenza> richieste = new Dictionary<string, RichiestaAssistenza>();

        public DbRichieste(IEnumerable<RichiestaAssistenza> richieste = null)
        {
            if (richieste != null)
                foreach (var richiesta in richieste)
                    this.richieste.Add(richiesta.Id, richiesta);
        }

        public RichiestaAssistenza GetById(string id)
        {
            return this.richieste[id];
        }

        public IEnumerable<RichiestaAssistenza> GetRichieste()
        {
            return this.richieste.Values;
        }

        public void Save(RichiestaAssistenza richiestaAssistenza)
        {
            if (richiestaAssistenza.Id != null)
                throw new InvalidOperationException("L'id di una nuova richiesta da inserire nel database deve essere null");

            richiestaAssistenza.Id = Guid.NewGuid().ToString();
            this.richieste[richiestaAssistenza.Id] = richiestaAssistenza;
        }
    }
}
