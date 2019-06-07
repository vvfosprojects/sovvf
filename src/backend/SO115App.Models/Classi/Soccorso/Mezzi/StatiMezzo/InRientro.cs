//-----------------------------------------------------------------------
// <copyright file="InRientro.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;

namespace SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo
{
    [SuppressMessage("StyleCop.CSharp.ReadabilityRules", "SA1126:PrefixCallsCorrectly", Justification = "https://stackoverflow.com/questions/37189518/stylecop-warning-sa1126prefixcallscorrectly-on-name-of-class")]

    /// <summary>
    ///   In viaggio verso la sede di servizio
    /// </summary>
    public class InRientro : AbstractStatoMezzoAssegnatoARichiesta
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="istanteTransizione">
        ///   L'istante in cui avviene la transizione in questo stato
        /// </param>
        /// <param name="codiceRichiesta">Il codice della richiesta proprietaria dell'evento</param>
        public InRientro(DateTime istanteTransizione, string codiceRichiesta) : base(istanteTransizione, codiceRichiesta)
        {
        }

        /// <summary>
        ///   Codice identificativo dello stato
        /// </summary>
        public override string Codice
        {
            get
            {
                return nameof(InRientro);
            }
        }

        /// <summary>
        ///   Descrizione dello stato
        /// </summary>
        public override string Descrizione
        {
            get
            {
                return "In Rientro";
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
        ///   Nello stato <see cref="InRientro" /> l'evento <see cref="PartenzaRientrata" /> produce
        ///   la transizione nello stato <see cref="InSede" />.
        /// </summary>
        /// <param name="partenzaRientrata">Il visitor</param>
        /// <returns>Lo stato <see cref="InSede" /></returns>
        public override IStatoMezzo AcceptVisitor(PartenzaRientrata partenzaRientrata)
        {
            return new InSede(partenzaRientrata.Istante);
        }

        /// <summary>
        ///   Nello stato <see cref="InRientro" /> l'evento <see cref="Revoca" /> produce la
        ///   transizione nello stato <see cref="Libero" />.
        /// </summary>
        /// <param name="revoca">Il visitor</param>
        /// <returns>Lo stato <see cref="Libero" /></returns>
        public override IStatoMezzo AcceptVisitor(Revoca revoca)
        {
            return new Libero(revoca.Istante);
        }

        /// <summary>
        ///   Nello stato <see cref="InRientro" /> l'evento <see cref="VaInFuoriServizio" /> produce
        ///   la transizione nello stato <see cref="FuoriServizio" />.
        /// </summary>
        /// <param name="vaInFuoriServizio">Il visitor</param>
        /// <returns>Lo stato <see cref="FuoriServizio" /></returns>
        public override IStatoMezzo AcceptVisitor(VaInFuoriServizio vaInFuoriServizio)
        {
            return new FuoriServizio(vaInFuoriServizio.Istante);
        }

        /// <summary>
        ///   Nello stato <see cref="InRientro" /> l'evento <see cref="ComposizionePartenze" />
        ///   produce la transizione nello stato <see cref="InViaggio" />.
        /// </summary>
        /// <param name="composizionePartenze">Il visitor</param>
        /// <returns>Lo stato <see cref="Assegnato" /></returns>
        public override IStatoMezzo AcceptVisitor(ComposizionePartenze composizionePartenze)
        {
            return new Assegnato(composizionePartenze.Istante, composizionePartenze.CodiceRichiesta);
        }
    }
}
