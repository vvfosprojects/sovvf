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
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;

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
            this.Id = id;
            this.Nome = nome;
            this.Cognome = cognome;
            this.Attivo = true;
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

            this.Username = username;
            this.Attivo = true;
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

            this.ValidoFinoA = ValidoFinoA;
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

            this.ValidoDa = ValidoDa;
        }

        public Utente(string username, string nome, string cognome, string codiceFiscale)
        {
            this.Username = username;
            this.Nome = nome;
            this.Cognome = cognome;
            this.CodiceFiscale = codiceFiscale;
        }

        /// <summary>
        ///   Id
        /// </summary>
        [Required(ErrorMessage = "Id obbligatorio.")]
        public string Id { get; set; }

        /// <summary>
        ///   Nome Operatore
        /// </summary>
        [Required(ErrorMessage = "Il nome utente è obbligatorio.")]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,40}$",
         ErrorMessage = "Nel nome sono presenti caratteri non ammessi")]
        public string Nome { get; set; }

        /// <summary>
        ///   Cognome Operatore
        /// </summary>
        [Required(ErrorMessage = "Il cognome utente è obbligatorio.")]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,40}$",
         ErrorMessage = "Nel cognome sono presenti caratteri non ammessi")]

        public string Cognome { get; set; }

        /// <summary>
        ///   CodiceFiscale Operatore
        /// </summary>
        public string CodiceFiscale { get; set; }

        /// <summary>
        ///   Sede utente loggato
        /// </summary>
        [Required]
        public Sede Sede { get; set; }

        /// <summary>
        ///   La username
        /// </summary>
        [Required]
        public string Username { get; set; }

        /// <summary>
        ///   Password dell'utente loggato
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        ///   Ruolo
        /// </summary>
        public List<Role> Ruoli { get; set; }

        /*         public List<Features> Privilegi { get; set; }
         */
        public string Token { get; set; }

        /// <summary>
        ///   La data di inizio della validità dell'account. Se è null, la validità inizia dal big bang.
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime? ValidoDa { get; set; }

        /// <summary>
        ///   La data di fine della validità dell'account. Se è null, la validità ha durata indefinita.
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime? ValidoFinoA { get; set; }

        /// <summary>
        ///   Indica se l'account è attivo.
        /// </summary>
        public bool Attivo { get; set; }

        /// <summary>
        ///   Qualifica utente loggato
        /// </summary>
        public string Qualifica { get; set; }

        public List<string> ListaUnitaOperativeAbilitate
        {
            get
            {
                List<string> ListaUOAbilitate = new List<string>();
                foreach (var ruolo in this.Ruoli)
                {
                    ListaUOAbilitate.Add(ruolo.Codicesede); //TODO COME SI COMPORTA CON IL CODICE DEL LAZIO, DALLA COMPOSIZIONE PARTENZA ED OLTRE.
                }

                return ListaUOAbilitate;
            }
        }

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

            userFind = ListaUtenti.Find(x => x.Username.Equals(username));

            if (userFind != null)
                return userFind;
            else
                return null;
        }

        //TODO DA MODIFICARE CON LA LOGICA DEL DB
        public static Utente VerificaLogIn(string username, string password)
        {
            Utente user = new Utente(username);

            string filepath = "Fake/user.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<Utente> ListaUtenti = JsonConvert.DeserializeObject<List<Utente>>(json);

            user = ListaUtenti.Find(x => x.Password.Equals(password) && x.Username.Equals(username));

            if (user != null)
                return user;
            else
                return null;
        }
    }

    public class Role
    {
        public Role(string _descrizione, string _sede)
        {
            this.Codicesede = _sede;
            this.descrizione = _descrizione;
        }

        public string descrizione { get; set; }
        public string Codicesede { get; set; }
    }
}
