//-----------------------------------------------------------------------
// <copyright file="SituazioneMezzo.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.ResultDTO
{
    /// <summary>
    ///   Contiene la situazione di un mezzo di soccorso, cioè lo stato in cui si trova
    /// </summary>
    public class SituazioneMezzo
    {
        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        /// <param name="codiceMezzo">Il codice del mezzo</param>
        /// <param name="statoMezzo">E' lo stato del mezzo</param>
        /// <param name="codiceRichiestaAssistenza">
        ///   E' il codice della richiesta di assistenza che ha determinato lo stato indicato
        /// </param>
        /// <param name="istanteAggiornamento">E' l'istante al quale risale l'informazione</param>
        public SituazioneMezzo(
            string codiceMezzo,
            IStatoMezzo statoMezzo,
            string codiceRichiestaAssistenza,
            DateTime istanteAggiornamento)
        {
            if (string.IsNullOrWhiteSpace(codiceMezzo))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(codiceMezzo));
            }

            if (statoMezzo == null)
            {
                throw new ArgumentNullException(nameof(statoMezzo));
            }

            if (string.IsNullOrWhiteSpace(codiceRichiestaAssistenza))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(codiceRichiestaAssistenza));
            }

            if (istanteAggiornamento == DateTime.MinValue)
            {
                throw new ArgumentOutOfRangeException("Cannot be equal to DateTime.MinValue", nameof(istanteAggiornamento));
            }

            this.CodiceMezzo = codiceMezzo;
            this.StatoMezzo = statoMezzo;
            this.CodiceRichiestaAssistenza = codiceRichiestaAssistenza;
            this.IstanteAggiornamento = istanteAggiornamento;
        }

        /// <summary>
        ///   Il codice del mezzo
        /// </summary>
        public string CodiceMezzo { get; private set; }

        /// <summary>
        ///   Lo stato corrente del mezzo
        /// </summary>
        public IStatoMezzo StatoMezzo { get; private set; }

        /// <summary>
        ///   Il codice della richiesta di assistenza che determina la situazione
        /// </summary>
        public string CodiceRichiestaAssistenza { get; private set; }

        /// <summary>
        ///   La data di aggiornamento della corrente informazione sulla situazione
        /// </summary>
        public DateTime IstanteAggiornamento { get; private set; }

        /// <summary>
        ///   Rappresentazione dell'oggetto in forma testuale
        /// </summary>
        /// <returns>La rappresentazione</returns>
        public override string ToString()
        {
            return string.Format(
                "{0} {1} {2} {3}",
                this.CodiceMezzo,
                this.StatoMezzo,
                this.CodiceRichiestaAssistenza,
                this.IstanteAggiornamento);
        }
    }
}
