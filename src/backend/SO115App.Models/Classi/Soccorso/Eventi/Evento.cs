//-----------------------------------------------------------------------
// <copyright file="Evento.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   L'evento è una classe astratta che modella il generico evento di interesse per la richiesta
    ///   di assistenza. Ogni evento è caratterizzato dall'istante in cui esso si verifica ed un
    ///   identificativo univoco della sorgente dell'informazione (per es. l'operatore di SO, l'id di
    ///   un sensore che individua una geo-localizzazione, ecc.). A seconda della natura del
    ///   particolare evento, esiste una classe concreta derivata da Evento, con gli attributi del caso.
    /// </summary>
    public abstract class Evento : IEvento
    {
        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="istante">L'istante in cui avviene l'evento.</param>
        /// <param name="codiceFonte">Il codice della fonte informativa dell'evento.</param>
        public Evento(RichiestaAssistenza richiesta, DateTime Istante, string CodiceFonte)
        {
            if (richiesta == null)
            {
                throw new ArgumentNullException(nameof(richiesta));
            }

            //if (istante == DateTime.MinValue)
            //{
            //    throw new ArgumentOutOfRangeException(nameof(istante));
            //}

            //if (string.IsNullOrWhiteSpace(codiceFonte))
            //{
            //    throw new ArgumentException("Cannot be null or whitespace", nameof(CodiceFonte));
            //}

            this.istante = Istante;
            this.codiceFonte = CodiceFonte;
            richiesta.AddEvento(this);
            this.istanteCreazione = DateTime.UtcNow;
            this.codiceRichiesta = richiesta.Codice;
        }

        /// <summary>
        ///   E' l'istante in cui si è verificato l'evento.
        /// </summary>
        public DateTime istante { get; private set; }

        /// <summary>
        ///   E' l'identificativo univoco della fonte informativa sull'evento, che ha anche la
        ///   responsabilità di garantirne la veridicità. Può essere per esempio un operatore SO, un
        ///   sensore, un altro sistema informativo, lo stesso SOVVF.
        /// </summary>
        public string codiceFonte { get; private set; }

        /// <summary>
        ///   Il codice della <see cref="RichiestaAssistenza" /> a cui l'evento appartiene.
        /// </summary>
        public string codiceRichiesta { get; private set; }

        /// <summary>
        ///   E' la data in cui l'evento è stato creato. Può differire da <see cref="Istante" /> nel
        ///   caso in cui la registrazione di un evento avvenga posticipata.
        /// </summary>
        private DateTime istanteCreazione { get; set; }
    }
}