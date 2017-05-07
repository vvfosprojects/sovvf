//-----------------------------------------------------------------------
// <copyright file="ContestoMezzo.cs" company="CNVVF">
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

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.StatoMezzo
{
    internal class ContestoMezzo
    {
        public ContestoMezzo()
        {
            this.State = new InSede();
        }

        public IStatoMezzo State { get; set; }

        public void Composizione()
        {
            State.Composizione(this);
        }

        public void InSede()
        {
            State.InSede(this);
        }

        public void Uscita()
        {
            State.Uscita(this);
        }

        public void Rientro()
        {
            State.Rientro(this);
        }

        public void SulPosto()
        {
            State.SulPosto(this);
        }
    }
}
