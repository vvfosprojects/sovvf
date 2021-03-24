﻿//-----------------------------------------------------------------------
// <copyright file="SetMovimentazione.cs" company="CNVVF">
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
using SO115App.ExternalAPI.Fake.Servizi.Gac.Mock;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    /// <summary>
    ///   Servizio scrive la movimentazione del mezzo sul servizio esterno GAC fake.
    /// </summary>
    public class SetMovimentazione : ISetMovimentazione
    {
        private readonly SetMezzo _setMezzo;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="setMezzo">mock del servizio Gac</param>
        public SetMovimentazione(SetMezzo setMezzo)
        {
            _setMezzo = setMezzo;
        }

        /// <summary>
        ///   scrive la movimentazione
        /// </summary>
        /// <param name="codiceMezzo">il codice del mezzo in movimentaizone</param>
        /// <param name="idRichiesta">il codice della richiesta</param>
        /// <param name="statoOperativo">lo stato operativo del mezzo</param>
        /// <param name="timeStamp">la data di inizio movimentazione</param>
        public void Set(string codiceMezzo, string idRichiesta, string statoOperativo, DateTime timeStamp)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            _setMezzo.SetMovimentazione(codiceMezzo, idRichiesta, statoOperativo, timeStamp);

            //---------------------------------------------------------------------------------------
        }
    }
}
