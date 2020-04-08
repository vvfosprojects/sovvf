//-----------------------------------------------------------------------
// <copyright file="IUpDateRichiestaAssistenza.cs" company="CNVVF">
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

namespace SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso
{
    /// <summary>
    ///   Servizio di salvataggio di una richiesta di assistenza. Nel caso in cui sia una nuova
    ///   richiesta, identificata dall'assenza di un codice, imposta il codice della richiesta e il
    ///   codice dell'unità operativa competente in base all'utente autenticato.
    /// </summary>
    public interface IUpDateRichiestaAssistenza
    {
        /// <summary>
        ///   Salva una Richiesta di Assistenza
        /// </summary>
        /// <param name="richiestaAssistenza">Richiesta di Assistenza da salvare</param>
        void UpDate(RichiestaAssistenza richiestaAssistenza);
    }
}
