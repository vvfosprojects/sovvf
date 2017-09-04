//-----------------------------------------------------------------------
// <copyright file="InViaggio.cs" company="CNVVF">
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
using System.Diagnostics.CodeAnalysis;
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace Modello.Classi.Soccorso.Mezzi.StatiMezzo
{
    [SuppressMessage("StyleCop.CSharp.ReadabilityRules", "SA1126:PrefixCallsCorrectly", Justification = "https://stackoverflow.com/questions/37189518/stylecop-warning-sa1126prefixcallscorrectly-on-name-of-class")]

    /// <summary>
    ///   In viaggio verso il luogo del sinistro.
    /// </summary>
    public class InViaggio : AbstractStatoMezzoAssegnatoARichiesta
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="istanteTransizione">
        ///   L'istante in cui avviene la transizione in questo stato
        /// </param>
        /// <param name="codiceRichiesta">Il codice della richiesta proprietaria dell'evento</param>
        public InViaggio(DateTime istanteTransizione, string codiceRichiesta) : base(istanteTransizione, codiceRichiesta)
        {
        }

        /// <summary>
        ///   Codice identificativo dello stato
        /// </summary>
        public override string Codice
        {
            get
            {
                return nameof(InViaggio);
            }
        }

        /// <summary>
        ///   In questo stato il mezzo non risulta disponibile per l'assegnazione
        /// </summary>
        public override bool Disponibile
        {
            get
            {
                return false;
            }
        }

        /// <summary>
        ///   Nello stato <see cref="InViaggio" /> l'evento <see cref="Revoca" /> produce la
        ///   transizione nello stato <see cref="Libero" />.
        /// </summary>
        /// <param name="revoca">Il visitor</param>
        /// <returns>Lo stato <see cref="Libero" /></returns>
        public override IStatoMezzo AcceptVisitor(Revoca revoca)
        {
            return new Libero(revoca.Istante);
        }

        /// <summary>
        ///   Nello stato <see cref="InViaggio" /> l'evento <see cref="VaInFuoriServizio" /> produce
        ///   la transizione nello stato <see cref="FuoriServizio" />.
        /// </summary>
        /// <param name="vaInFuoriServizio">Il visitor</param>
        /// <returns>Lo stato <see cref="FuoriServizio" /></returns>
        public override IStatoMezzo AcceptVisitor(VaInFuoriServizio vaInFuoriServizio)
        {
            return new FuoriServizio(vaInFuoriServizio.Istante);
        }

        /// <summary>
        ///   Nello stato <see cref="InViaggio" /> l'evento <see cref="ArrivoSulPosto" /> produce la
        ///   transizione nello stato <see cref="SulPosto" />.
        /// </summary>
        /// <param name="arrivoSulPosto">Il visitor</param>
        /// <returns>Lo stato <see cref="SulPosto" /></returns>
        public override IStatoMezzo AcceptVisitor(ArrivoSulPosto arrivoSulPosto)
        {
            return new SulPosto(arrivoSulPosto.Istante, arrivoSulPosto.CodiceRichiesta);
        }
    }
}
