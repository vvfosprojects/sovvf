// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

namespace Modello.Classi.Soccorso.Eventi.Segnalazioni
{
    /// <summary>
    ///   Modella una chiamata telefonica proveniente ad una linea della sala operativa.
    /// </summary>
#warning Non è chiaro se Telefonata debba diventare una classe astratta e avere come derivate TelefonataEsterna, TelefonataNUE, ecc.

    public class Telefonata : Segnalazione
    {
        /// <summary>
        ///   Il codice origine è mappato sul numero di telefono per una telefonata
        /// </summary>
        public override string CodiceOrigine
        {
            get
            {
                return this.NumeroTelefono;
            }
        }

        /// <summary>
        ///   E' il cognome del chiamante.
        /// </summary>
        public string CognomeChiamante { get; set; }

        /// <summary>
        ///   E' il nome del chiamante
        /// </summary>
        public string NomeChiamante { get; set; }

        /// <summary>
        ///   E' il numero di telefono del chiamante
        /// </summary>
        public string NumeroTelefono { get; set; }

        /// <summary>
        ///   E' la ragione sociale del chiamante. Ad es.: Carabinieri, CC, Polizia Municipale, 118, ecc.
        /// </summary>
        public string RagioneSociale { get; set; }

        /// <summary>
        ///   E' il codice della scheda contatto legata alla telefonata. In linea di principio, una
        ///   scheda contatto potrebbe non avere seguito e non generare un'istanza di telefonata,
        ///   anche se questa possibilità indica una potenziale anomalia di processo.
        /// </summary>
        public string CodiceSchedaContatto { get; set; }
    }
}
