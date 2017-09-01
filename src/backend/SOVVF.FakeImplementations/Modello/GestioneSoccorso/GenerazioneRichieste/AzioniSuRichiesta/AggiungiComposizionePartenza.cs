//-----------------------------------------------------------------------
// <copyright file="AggiungiComposizionePartenza.cs" company="CNVVF">
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
using System.Linq;
using Modello.Classi.Soccorso.Eventi.Partenze;
using static Modello.Classi.Soccorso.Squadre.Componente;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta
{
    /// <summary>
    ///   Azione di aggiunta dell'evento di composizione partenza in una richiesta di assistenza
    /// </summary>
    internal class AggiungiComposizionePartenza : IAzioneSuRichiesta
    {
        /// <summary>
        ///   Istante previsto di esecuzione dell'azione
        /// </summary>
        private readonly DateTime istantePrevisto;

        /// <summary>
        ///   Il parco mezzi sul quale l'azione agisce per selezionare il mezzo disponibile per la
        ///   composizione partenza
        /// </summary>
        private readonly ParcoMezzi parcoMezzi;

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
        /// <param name="parcoMezzi">
        ///   Il parco mezzi sul quale l'azione agisce per selezionare il mezzo disponibile per la
        ///   composizione partenza
        /// </param>
        public AggiungiComposizionePartenza(DateTime istantePrevisto, RichiestaConParametri richiesta, ParametriMezzo parametriMezzo, ParcoMezzi parcoMezzi)
        {
            this.istantePrevisto = istantePrevisto;
            this.richiesta = richiesta;
            this.parametriMezzo = parametriMezzo;
            this.parcoMezzi = parcoMezzi;
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
            var mezzoSelezionato = this.parcoMezzi.GetPrimoMezzoDisponibile();
            if (mezzoSelezionato == null)
            {
                yield break;
            }

            mezzoSelezionato.ContestoMezzo.Composizione();
            this.parametriMezzo.MezzoUtilizzato = mezzoSelezionato; // questa assegnazione alimenta l'esecuzione di tutti gli altri eventi successivi
            var composizione = new ComposizionePartenze(this.richiesta.Richiesta, istanteEffettivo, "Fonte", false)
            {
                Componenti = new HashSet<ComponentePartenza>(mezzoSelezionato.Membri
                    .Select((m, i) =>
                        new ComponentePartenza(m, mezzoSelezionato.Codice, "Ticket")
                        {
                            Ruoli = i == 0 ? new HashSet<Ruolo>() { Ruolo.CapoPartenza } : i == 1 ? new HashSet<Ruolo> { Ruolo.Autista } : new HashSet<Ruolo> { Ruolo.Vigile }
                        }))
            };
            this.eseguita = true;

            yield return new AggiungiPartenzaDallaSede(
                istanteEffettivo.AddMinutes(1), // la partenza avviene un minuto dopo la composizione
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
