//-----------------------------------------------------------------------
// <copyright file="Telefonate.cs" company="CNVVF">
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
using System.Text;

namespace SO115App.Models.Classi.ListaEventi
{
    public class Telefonate
    {
        public string CodiceOrigine { get; set; }
        public string CognomeChiamante { get; set; }
        public string NomeChiamante { get; set; }
        public string NumeroTelefono { get; set; }
        public string RagioneSociale { get; set; }
        public object CodiceSchedaContatto { get; set; }
        public string Codice { get; set; }
        public string Motivazione { get; set; }
        public object NotePubbliche { get; set; }
        public object NotePrivate { get; set; }
        public string Esito { get; set; }
        public DateTime Istante { get; set; }
        public string CodiceFonte { get; set; }
        public string CodiceRichiesta { get; set; }
    }
}
