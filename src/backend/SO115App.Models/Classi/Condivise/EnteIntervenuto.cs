//-----------------------------------------------------------------------
// <copyright file="EntiIntervenuti.cs" company="CNVVF">
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
using System.Collections.Generic;

namespace SO115App.API.Models.Classi.Condivise
{
    [BsonIgnoreExtraElements]
    public class EnteIntervenuto
    {
        /// <summary>
        ///   Codice dell'Ente intervenuto
        /// </summary>
        public int Codice { get; set; }

        /// <summary>
        ///   Descrizione dell'Ente intervenuto ( Es. ACEA )
        /// </summary>
        public string Descrizione { get; set; }
        public string CodSede { get; set; }
        public bool Ricorsivo { get; set; }
        public int CodCategoria { get; set; }
        public string Indirizzo { get; set; }
        public string Cap { get; set; }
        public int CodComune { get; set; }
        public string SiglaProvincia { get; set; }
        public string Zona { get; set; }
        public string NoteEnte { get; set; }
        public string Email { get; set; }
        public List<string> Telefoni { get; set; }
    }

    /// <summary>
    /// EntiIntervenuti.Categoria: DTO
    /// </summary>
    public class EnteCategoria
    {
        public int Codice { get; set; }
        public string Descrizione { get; set; }
        public string Cap { get; set; }
    }
}
