﻿//-----------------------------------------------------------------------
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
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB
{
    public class GetBoxRichieste : IGetBoxRichieste
    {
        private readonly IGetListaSintesi _getListaSintesi;
        private readonly IGetTurno _getTurni;

        public GetBoxRichieste(IGetListaSintesi getListaSintesi, IGetTurno getTurni)
        {
            _getListaSintesi = getListaSintesi;
            _getTurni = getTurni;
        }

        public BoxInterventi Get(ISet<PinNodo> listaPin)
        {
            var turnoAttuale = _getTurni.Get();
            var turnoPrecedente = _getTurni.Get(turnoAttuale.DataOraInizio.AddMinutes(-1));
            var turnoSuccessivo = _getTurni.Get(turnoAttuale.DataOraInizio.AddMinutes(1));

            var filtro = new FiltroRicercaRichiesteAssistenza { UnitaOperative = listaPin, Chiuse = new string[] { "Chiamate chiuse", "Interventi chiusi" }, SoloboxRichieste = true };
            var listaSintesi = _getListaSintesi.GetListaSintesiRichieste(filtro);

            var interventi = new BoxInterventi();

            if (listaSintesi.Count > 0)
            {
                interventi.Assegnati = listaSintesi.Count(x => x.Partenze.Count > 0
                    && !x.Partenze.All(c => c.Partenza.Terminata || c.Partenza.PartenzaAnnullata || c.Partenza.Sganciata)
                    && !x.Chiusa && !x.Presidiata && !x.Sospesa && x.Aperta);
                interventi.Chiamate = listaSintesi.Count(x =>
                    (x.Partenze.Count == 0 || x.Partenze.All(c => c.Partenza.Terminata || c.Partenza.PartenzaAnnullata || c.Partenza.Sganciata))
                    && !x.Chiusa && !x.Sospesa);
                interventi.Presidiati = listaSintesi.Count(x => x.Presidiata);
                interventi.Chiusi = listaSintesi.Count(x => x.Chiusa);

                interventi.TotAnnoCorrente = listaSintesi.Count(x => x.IstanteRicezioneRichiesta.Year == DateTime.Now.Year && x.Chiusa);
                interventi.AnnoCorrente = DateTime.Now.Year;

                interventi.TotTurnoCorrente = listaSintesi.Count(x => x.trnInsChiamata.Contains(turnoAttuale.Codice.ToCharArray()[0]));
                interventi.TotTurnoPrecedente = listaSintesi.Count(x => x.trnInsChiamata.Contains(turnoPrecedente.Codice.ToCharArray()[0]));

                interventi.Totale = listaSintesi.Count(x => x.Aperta);
            }

            return interventi;
        }
    }
}
