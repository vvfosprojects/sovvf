//-----------------------------------------------------------------------
// <copyright file="Movimentazione.cs" company="CNVVF">
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

namespace SO115App.Models.Classi.ServiziEsterni.Gac
{
    /// <summary>
    ///   la classe descrive l'oggetto Movimentazione che contine le informazioni utili da mandare
    ///   al GAC quando il mezzo viene assegnato ad una richiesta
    /// </summary>
    public class Movimentazione
    {
        /// <summary>
        ///   il codice della richiesta assistenza a cui è associato il mezzo
        /// </summary>
        public string IdRichiesta { get; set; }

        /// <summary>
        ///   indica se lo stato del mezzo è disponibile o no al gac
        /// </summary>
        public string StatoOperativo { get; set; }

        /// <summary>
        ///   la data di inizio movimentazione del mezzo
        /// </summary>
        public DateTime? DataMovimentazione { get; set; }
    }
}
