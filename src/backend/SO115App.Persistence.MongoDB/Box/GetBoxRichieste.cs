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
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB
{
    public class GetBoxRichieste : IGetBoxRichieste
    {
        private readonly IGetListaSintesi _getListaSintesi;

        public GetBoxRichieste(IGetListaSintesi getListaSintesi)
        {
            _getListaSintesi = getListaSintesi;
        }

        public BoxInterventi Get(ISet<PinNodo> listaPin)
        {
            var interventi = new BoxInterventi();

            var filtro = new FiltroRicercaRichiesteAssistenza { UnitaOperative = listaPin };
            var listaSintesi = _getListaSintesi.GetListaSintesiRichieste(filtro);

            if (listaSintesi.Count > 0)
            {
                interventi.Assegnati = listaSintesi.FindAll(x => x.Partenze.Count > 0).Count;
                interventi.Chiamate = listaSintesi.FindAll(x => x.Partenze.Count == 0).Count;
                interventi.Presidiati = listaSintesi.FindAll(x => x.Presidiata).Count;
                interventi.Sospesi = listaSintesi.FindAll(x => x.Sospesa).Count;
                interventi.TotAnnoCorrente = listaSintesi.FindAll(x => x.IstanteRicezioneRichiesta.Year == DateTime.Now.Year).Count;
                interventi.TotTurnoCorrente = listaSintesi.FindAll(x => x.IstanteRicezioneRichiesta.Year == DateTime.Now.Year).Count;
                interventi.TotTurnoPrecedente = 0;
                interventi.Totale = listaSintesi.Count;
            }

            return interventi;
        }
    }
}
