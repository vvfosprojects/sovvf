//-----------------------------------------------------------------------
// <copyright file="Tipologia.cs" company="CNVVF">
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
using SO115App.Models.Classi.Condivise;

namespace SO115App.API.Models.Classi.Condivise
{
    [BsonIgnoreExtraElements]
    public class Tipologia
    {
        public Tipologia(string codice, string descrizione, string icona)
        {
            this.Codice = codice;
            this.Descrizione = descrizione;
            this.Icona = icona;
        }

        /// <summary>
        ///   Codice della Tipologia
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Descrizione Tipologia
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Indica la tipologia di luogo nel quale è avvenuto il fatto (Es. Abitazione)
        /// </summary>
        public TipologiaLuogoEvento TipoLuogoEvento { get; set; }

        /// <summary>
        ///   Classe Icona Fontawsome corrispondente alla tipologia
        /// </summary>
        public string Icona { get; set; }

        /// <summary>
        ///   Definisce la categoria della Tipologia
        /// </summary>
        public string Categoria { get; set; }

        /// <summary>
        ///   Indica se questa tipologia sarà presente nei "preferiti" nella sezione Filtri
        /// </summary>
        public bool Star { get; set; }

        /// <summary>
        ///   Indica l'incendio è boschivo
        /// </summary>
        public bool Boschivo { get; set; }

        public AdeguatezzaMezzo AdeguatezzaMezzo { get; set; }

        public int OppSganc { get; set; }
    }
}
