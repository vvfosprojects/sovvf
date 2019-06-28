//-----------------------------------------------------------------------
// <copyright file="Segnalazione.cs" company="CNVVF">
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
using Newtonsoft.Json;
using System;

namespace SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni
{
    /// <summary>
    ///   Modella una segnalazione per assistenza da parte dei VVF. Può essere una telefonata, un
    ///   SMS, una scheda contatto, ecc.
    /// </summary>
    public abstract class Segnalazione : Evento
    {
        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="codice">
        ///   E' l'identificativo univoco della segnalazione, utilizzabile anche a scopi
        ///   giuridici/amministrativi. Potrebbe essere un codice del tipo AX554HN.
        /// </param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        public Segnalazione(
            RichiestaAssistenza richiesta,
            string codice,
            DateTime istante,
            string codiceFonte) : base(richiesta, istante, codiceFonte)
        {
            if (string.IsNullOrWhiteSpace(codice))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(codice));
            }

            this.Codice = codice;
        }

        [JsonConstructor]
        protected Segnalazione(string codice, DateTime istante, string codiceFonte) : base(istante, codiceFonte, codice)
        {
            this.Codice = codice;
        }

        /// <summary>
        ///   E' l'identificativo univoco della segnalazione, utilizzabile anche a scopi
        ///   giuridici/amministrativi. Potrebbe essere un codice del tipo AX554HN.
        /// </summary>
        public string Codice { get; private set; }

        /// <summary>
        ///   E' un codice che identifica univocamente la sorgente da cui proviene la segnalazione.
        /// </summary>
        /// <remarks>
        ///   Viene implementato dalle classi derivate. Per es. nel caso di telefonata o SMS o fax è
        ///   il numero di telefono. Nel caso di email è l'indirizzo del mittente.
        /// </remarks>
        public abstract string CodiceOrigine { get; }

        /// <summary>
        ///   E' la geolocalizzazione della segnalazione. Proviene per esempio dall'integrazione col
        ///   112 (scheda contatto) nella forma di un punto, una poligonale, un cerchio, ecc.
        ///   Nota: non è la geolocalizzazione dell'evento calamitoso, vigilanza, ecc.
        /// </summary>
        //public Geolocalizzazione Geolocalizzazione { get; set; }

        /// <summary>
        ///   Indica la motivazione per la quale è stata inoltrata segnalazione ai VVF
        /// </summary>
        public string Motivazione { get; set; }

        /// <summary>
        ///   Note aggiuntive relative alla segnalazione ritenute pubblicamente divulgabili
        /// </summary>
        public string NotePubbliche { get; set; }

        /// <summary>
        ///   Note aggiuntive relative alla segnalazione da non divulgurare pubblicamente per motivi
        ///   di riservatezza dell'informazione.
        /// </summary>
        public string NotePrivate { get; set; }

        /// <summary>
        ///   E' l'esito che l'operatore assegna alla segnalazione.
        /// </summary>
        /// <remarks>
        ///   Al momento è un testo libero che non è elaborato dal sistema, ma è una semplice
        ///   annotazione. Non salviamo l'istante della definizione dell'esito perché sovrapponibile
        ///   con l'istante dell'evento di salvataggio contenuto nella classe antenata.
        /// </remarks>
        public string Esito { get; set; }
    }
}
