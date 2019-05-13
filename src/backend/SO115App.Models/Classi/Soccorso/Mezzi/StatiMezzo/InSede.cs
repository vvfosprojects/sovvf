//-----------------------------------------------------------------------
// <copyright file="InSede.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using System;
using System.Diagnostics.CodeAnalysis;

namespace SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo
{
    [SuppressMessage("StyleCop.CSharp.ReadabilityRules", "SA1126:PrefixCallsCorrectly", Justification = "https://stackoverflow.com/questions/37189518/stylecop-warning-sa1126prefixcallscorrectly-on-name-of-class")]

    /// <summary>
    ///   Presente presso la sede di servizio
    /// </summary>
    public class InSede : AbstractStatoMezzoNonAssegnatoARichiesta
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="istanteTransizione">
        ///   L'istante in cui avviene la transizione in questo stato
        /// </param>
        public InSede(DateTime istanteTransizione) : base(istanteTransizione)
        {
        }

        /// <summary>
        ///   Codice identificativo dello stato
        /// </summary>
        public override string Codice
        {
            get
            {
                return nameof(InSede);
            }
        }

        /// <summary>
        ///   Descrizione dello stato
        /// </summary>
        public override string Descrizione
        {
            get
            {
                return "In Sede";
            }
        }

        /// <summary>
        ///   In questo stato il mezzo risulta disponibile per l'assegnazione
        /// </summary>
        public override bool Disponibile
        {
            get
            {
                return true;
            }
        }

        /// <summary>
        ///   Nello stato <see cref="InSede" /> l'evento <see cref="VaInFuoriServizio" /> produce la
        ///   transizione nello stato <see cref="FuoriServizio" />.
        /// </summary>
        /// <param name="vaInFuoriServizio">Il visitor</param>
        /// <returns>Lo stato <see cref="FuoriServizio" /></returns>
        public override IStatoMezzo AcceptVisitor(VaInFuoriServizio vaInFuoriServizio)
        {
            return new FuoriServizio(vaInFuoriServizio.Istante);
        }

        /// <summary>
        ///   Nello stato <see cref="InSede" /> l'evento <see cref="ComposizionePartenze" /> produce
        ///   la transizione nello stato <see cref="Assegnato" />.
        /// </summary>
        /// <param name="composizionePartenze">Il visitor</param>
        /// <returns>Lo stato <see cref="Assegnato" /></returns>
        public override IStatoMezzo AcceptVisitor(ComposizionePartenze composizionePartenze)
        {
            return new Assegnato(composizionePartenze.Istante, composizionePartenze.CodiceRichiesta);
        }
    }
}