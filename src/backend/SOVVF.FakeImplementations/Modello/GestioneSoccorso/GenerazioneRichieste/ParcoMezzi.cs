//-----------------------------------------------------------------------
// <copyright file="ParcoMezzi.cs" company="CNVVF">
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
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    internal class ParcoMezzi
    {
        private Mezzo[] mezzi;

        public ParcoMezzi(int numeroMezzi, string codiceUnitaOperativa)
        {
            this.mezzi = new Mezzo[numeroMezzi];

            for (int i = 0; i < numeroMezzi; i++)
            {
                mezzi[i] = Mezzo.CreateMezzoFake(codiceUnitaOperativa);
            }
        }

        public Mezzo GetPrimoMezzoDisponibile()
        {
            return mezzi.FirstOrDefault(m => m.ContestoMezzo.State.Disponibile);
        }
    }
}
