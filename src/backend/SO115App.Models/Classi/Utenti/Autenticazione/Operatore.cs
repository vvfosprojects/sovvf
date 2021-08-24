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
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SO115App.API.Models.Classi.Autenticazione
{
    /// <summary>
    ///   Modella un utente del sistema.
    /// </summary>
    [BsonIgnoreExtraElements]
    public class Operatore
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="id">id all'utente</param>
        /// <remarks>L'utenza viene create per default con il flag attivo impostato a true</remarks>
        [JsonConstructor]
        public Operatore(string codiceFiscale, string nome, string cognome)
        {
            this.CodiceFiscale = codiceFiscale;
            this.Nome = nome;
            this.Cognome = cognome;
        }

        /// <summary>
        ///   Id
        /// </summary>
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
    }
}
