//-----------------------------------------------------------------------
// <copyright file="AggiungiArrivoSulPosto.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta
{
    /// <summary>
    ///   Azione di aggiunta dell'evento di arrivo sul posto in una richiesta di assistenza
    /// </summary>
    internal class AggiungiArrivoSulPosto : IAzioneSuRichiesta
    {
        /// <summary>
        ///   Istante previsto di esecuzione dell'azione
        /// </summary>
        private readonly DateTime istantePrevisto;

        /// <summary>
        ///   Parametri del mezzo
        /// </summary>
        private readonly ParametriMezzo parametriMezzo;

        /// <summary>
        ///   La richiesta con parametri su cui l'azione agisce
        /// </summary>
        private readonly RichiestaConParametri richiesta;

        /// <summary>
        ///   Indica se l'azione è stata eseguita
        /// </summary>
        private bool eseguita;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="istantePrevisto">L'istante previsto di esecuzione dell'azione</param>
        /// <param name="richiesta">La richiesta con parametri su cui l'azione agisce</param>
        /// <param name="parametriMezzo">I parametri del mezzo utilizzati dall'azione</param>
        public AggiungiArrivoSulPosto(DateTime istantePrevisto, RichiestaConParametri richiesta, ParametriMezzo parametriMezzo)
        {
            this.istantePrevisto = istantePrevisto;
            this.richiesta = richiesta;
            this.parametriMezzo = parametriMezzo;
        }

        /// <summary>
        ///   L'istante previsto di esecuzione dell'azione
        /// </summary>
        public DateTime IstantePrevisto
        {
            get
            {
                return this.istantePrevisto;
            }
        }

        /// <summary>
        ///   Esegue l'azione
        /// </summary>
        /// <param name="istanteEffettivo">
        ///   L'istante effettivo (simulato) in cui l'azione viene eseguita
        /// </param>
        /// <returns>Le azioni da eseguire a seguito dell'esecuzione della presente azione</returns>
        public IEnumerable<IAzioneSuRichiesta> Esegui(DateTime istanteEffettivo)
        {
            var mezzo = this.parametriMezzo.MezzoUtilizzato;

            if (mezzo == null)
            {
                yield break;
            }

            mezzo.ContestoMezzo.SulPosto();
            new ArrivoSulPosto(this.richiesta.Richiesta, this.parametriMezzo.MezzoUtilizzato.Codice, istanteEffettivo, "Fonte");
            this.eseguita = true;

            yield return new AggiungiPartenzaDalPosto(
                istanteEffettivo.AddSeconds(this.parametriMezzo.SecondiPermanenzaSulPosto),
                this.richiesta,
                this.parametriMezzo);
        }

        /// <summary>
        ///   Predicato che indica se l'azione è stata eseguita
        /// </summary>
        /// <returns>L'indicazione richiesta</returns>
        public bool Eseguita()
        {
            return this.eseguita;
        }
    }
}
