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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    /// <summary>
    ///   La classe aggiorna i dati dell'intervento (squadre, mezzo e richiesta) in seguito al
    ///   cambio stato di un mezzo sull'intervento
    /// </summary>
    public class UpdateStatoPartenzaExt : IUpdateStatoPartenze
    {
        private readonly ISetStatoOperativoMezzo _setStatoOperativoMezzo;
        private readonly ISetMezzoOccupato _setMezzoOccupato;
        private readonly ISetMezzoLibero _setMezzoLibero;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;
        private readonly ISetStatoSquadra _setStatoSquadra;
        private readonly IGetTipologieByCodice _getTipologieByCodice;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public UpdateStatoPartenzaExt(ISetStatoOperativoMezzo setStatoOperativoMezzo, IUpDateRichiestaAssistenza upDateRichiestaAssistenza, ISetStatoSquadra setStatoSquadra, IGetTipologieByCodice getTipologieByCodice, ISetMezzoOccupato setMezzoOccupato, ISetMezzoLibero setMezzoLibero)
        {
            _setStatoOperativoMezzo = setStatoOperativoMezzo;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
            _setStatoSquadra = setStatoSquadra;
            _getTipologieByCodice = getTipologieByCodice;
            _setMezzoOccupato = setMezzoOccupato;
            this._setMezzoLibero = setMezzoLibero;
        }

        /// <summary>
        ///   Il metodo accetta in firma il command, e in seguito al cambio di stato di uno o più
        ///   mezzi aggiorna le informazioni relative alla richiesta a cui quel mezzo è associato
        /// </summary>
        /// <param name="command">il command in ingresso</param>

        public void Update(AggiornaStatoMezzoCommand command)
        {
            _upDateRichiestaAssistenza.UpDate(command.Richiesta);
            var tipologia = _getTipologieByCodice.Get(command.Richiesta.Tipologie)[0];

            //if (command.StatoMezzo.Equals(Costanti.MezzoSulPosto) || command.StatoMezzo.Equals(Costanti.MezzoInViaggio))
            //{
            //    _setMezzoOccupato.Set(command.IdMezzo, DateTime.UtcNow, command.Richiesta.Id, tipologia.Codice, tipologia.Descrizione);
            //}
            //else
            //{
            //    _setMezzoLibero.Set(command.IdMezzo, DateTime.UtcNow, command.Richiesta.Id);
            //}
            _setStatoOperativoMezzo.Set(command.CodiceSede, command.IdMezzo, command.StatoMezzo, command.Richiesta.Codice);

            foreach (var partenza in command.Richiesta.Partenze)
            {
                foreach (var squadra in partenza.Partenza.Squadre)
                {
                    _setStatoSquadra.SetStato(squadra.Codice, command.Richiesta.Id, command.StatoMezzo, command.CodiceSede);
                }
            }
        }
    }
}
