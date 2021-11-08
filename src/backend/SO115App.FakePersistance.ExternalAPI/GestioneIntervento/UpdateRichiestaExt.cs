﻿//-----------------------------------------------------------------------
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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;

namespace SO115App.ExternalAPI.Fake.GestioneIntervento
{
    /// <summary>
    ///   La classe aggiorna i dati dell'intervento qualora l'intervento sia stato chiuso o riaperto
    /// </summary>
    public class UpDateRichiestaExt : IUpDateRichiestaAssistenza
    {
        private readonly ISetMovimentazione _setMovimentazione;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;

        public UpDateRichiestaExt(ISetMovimentazione setMovimentazione,
                                  IUpDateRichiestaAssistenza upDateRichiestaAssistenza)
        {
            _setMovimentazione = setMovimentazione;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
        }

        /// <summary>
        ///   Il metodo accetta in firma la richiesta, e in seguito alla chiusura o riapertura della
        ///   richiesta aggiorna i dati relativi a quella richiesta
        /// </summary>
        /// <param name="richiestaAssistenza">la richiesta assistenza</param>
        public void UpDate(RichiestaAssistenza richiestaAssistenza)
        {
            _upDateRichiestaAssistenza.UpDate(richiestaAssistenza);
        }
    }
}
