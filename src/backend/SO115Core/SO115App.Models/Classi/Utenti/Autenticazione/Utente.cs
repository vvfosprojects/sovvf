//-----------------------------------------------------------------------
// <copyright file="Utente.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.IO;

namespace SO115App.API.Models.Classi.Autenticazione
{
    /// <summary>
    ///   Modella un utente del sistema.
    /// </summary>
    public class Utente
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="id">id all'utente</param>
        /// <remarks>L'utenza viene create per default con il flag attivo impostato a true</remarks>
        [JsonConstructor]
        public Utente(string id, string nome, string cognome)
        {
            this.id = id;
            this.nome = nome;
            this.cognome = cognome;
            this.attivo = true;
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="username">La username associata all'utente</param>
        /// <remarks>L'utenza viene create per default con il flag attivo impostato a true</remarks>
        public Utente(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(username));
            }

            this.username = username;
            this.attivo = true;
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="username">La username associata all'utente</param>
        /// <param name="validoFinoA">La data di fine validità dell'utenza</param>
        /// <remarks>La data di inizio validità è il big bang</remarks>
        public Utente(string username, DateTime ValidoFinoA) : this(username)
        {
            if (ValidoFinoA == DateTime.MinValue)
            {
                throw new ArgumentOutOfRangeException(nameof(ValidoFinoA));
            }

            this.validoFinoA = ValidoFinoA;
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// ///
        /// <param name="username">La username associata all'utente</param>
        /// <param name="validoDa">La data di inizio validità dell'utenza</param>
        /// <param name="validoFinoA">La data di fine validità dell'utenza</param>
        public Utente(string username, DateTime ValidoDa, DateTime validoFinoA) : this(username, validoFinoA)
        {
            if (ValidoDa == DateTime.MinValue)
            {
                throw new ArgumentOutOfRangeException(nameof(ValidoDa));
            }

            this.validoDa = ValidoDa;
        }

        public Utente(string username, string nome, string cognome, string codiceFiscale)
        {
            this.username = username;
            this.nome = nome;
            this.cognome = cognome;
            this.codiceFiscale = codiceFiscale;
        }

        /// <summary>
        ///   Id
        /// </summary>
        public string id { get; set; }

        /// <summary>
        ///   Nome Operatore
        /// </summary>
        public string nome { get; set; }

        /// <summary>
        ///   Cognome Operatore
        /// </summary>
        public string cognome { get; set; }

        /// <summary>
        ///   La username
        /// </summary>
        public string username { get; set; }

        /// <summary>
        ///   Password dell'utente loggato
        /// </summary>
        public string password { get; set; }

        /// <summary>
        ///   Ruolo
        /// </summary>
        public List<Role> ruoli { get; set; }

        /// <summary>
        ///   Sede utente loggato
        /// </summary>
        public Sede sede { get; set; }

        /*         public List<Features> Privilegi { get; set; }
         */
        public string token { get; set; }

        /// <summary>
        ///   CodiceFiscale Operatore
        /// </summary>
        public string codiceFiscale { get; set; }

        /// <summary>
        ///   La data di inizio della validità dell'account. Se è null, la validità inizia dal big bang.
        /// </summary>
        public DateTime? validoDa { get; set; }

        /// <summary>
        ///   La data di fine della validità dell'account. Se è null, la validità ha durata indefinita.
        /// </summary>
        public DateTime? validoFinoA { get; set; }

        /// <summary>
        ///   Indica se l'account è attivo.
        /// </summary>
        public bool attivo { get; set; }

        /// <summary>
        ///   Qualifica utente loggato
        /// </summary>
        public string qualifica { get; set; }

        public static Utente FindUserByUsername(string username)
        {
            Utente userFind = new Utente(username);

            string filepath = "Fake/user.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<Utente> ListaUtenti = JsonConvert.DeserializeObject<List<Utente>>(json);

            userFind = ListaUtenti.Find(x => x.username.Equals(username));

            if (userFind != null)
                return userFind;
            else
                return null;
        }
    }

    public class Role
    {
        public Role(string _descrizione, Sede _sede)
        {
            this.sede = _sede;
            this.descrizione = _descrizione;
        }

        public string descrizione { get; set; }
        public Sede sede { get; set; }
    }

    /*
        public enum Ruolo
        {
            [Description("CallTracker")]
            CallTracker,
            [Description("GestoreRichieste")]
            GestoreRichieste
        }
     */
}