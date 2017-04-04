//-----------------------------------------------------------------------
// <copyright file="ComponiPartenzaCommandHandler.cs" company="CNVVF">
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
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza.CommandDTO;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza
{
    /// <summary>
    ///   Per una specifica richiesta di assistenza dispone l'invio di risorse (uomini e mezzi). Il
    ///   command crea tante istanze di evento <see cref="ComposizionePartenza" /> quanti sono i
    ///   capo-partenza presenti nei componenti. Rilascia tutte le risorse selezionate.
    /// </summary>
    public class ComponiPartenzaCommandHandler : ICommandHandler<ComponiPartenzaCommand>
    {
        /// <summary>
        ///   Servizio che eroga il contenuto di una Richiesta di Assistenza
        /// </summary>
        private readonly IGetRichiestaAssistenzaById getRichiestaAssistenzaById;

        /// <summary>
        ///   Servizio che salva una Richiesta di Assistenza
        /// </summary>
        private readonly ISaveRichiestaAssistenza saveRichiestaAssistenza;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getRichiestaAssistenzaById">Istanza del servizio <see cref="getRichiestaAssistenzaById" />.</param>
        /// <param name="saveRichiestaAssistenza">Istanza del servizio <see cref="saveRichiestaAssistenza" /></param>
        public ComponiPartenzaCommandHandler(
            IGetRichiestaAssistenzaById getRichiestaAssistenzaById,
            ISaveRichiestaAssistenza saveRichiestaAssistenza)
        {
            this.getRichiestaAssistenzaById = getRichiestaAssistenzaById;
            this.saveRichiestaAssistenza = saveRichiestaAssistenza;
        }

        /// <summary>
        ///   Metodo per l'esecuzione del command.
        /// </summary>
        /// <param name="command">Il DTO del command.</param>
        public void Handle(ComponiPartenzaCommand command)
        {
            var richiestaAssistenza = this.getRichiestaAssistenzaById.Get(command.IdRichiestaAssistenza);

            foreach (var cp in command.ComposizioniPartenza)
            {
                richiestaAssistenza.Eventi.Add(cp);
            }

            this.saveRichiestaAssistenza.Save(richiestaAssistenza);
        }
    }
}
