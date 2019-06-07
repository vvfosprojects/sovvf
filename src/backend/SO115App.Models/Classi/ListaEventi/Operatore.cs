//-----------------------------------------------------------------------
// <copyright file="Operatore.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Classi.ListaEventi
{
    public class Operatore
    {
        public string Id { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public string CodiceFiscale { get; set; }
        public Sede Sede { get; set; }
        public string Username { get; set; }
        public object Password { get; set; }
        public object Ruoli { get; set; }
        public object Token { get; set; }
        public object ValidoDa { get; set; }
        public object ValidoFinoA { get; set; }
        public bool Attivo { get; set; }
        public object Qualifica { get; set; }
    }
}
