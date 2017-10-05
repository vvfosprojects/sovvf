//-----------------------------------------------------------------------
// <copyright file="FuoriSincro.cs" company="CNVVF">
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
    ///   Stato iniziale del processore che non ha evidenza del fatto che il mezzo sia nello stato
    ///   <see cref="InSede" /> oppure <see cref="InViaggio" />. Il processore si porta in uno stato
    ///   ben noto dopo aver processato il primo evento che è un evento
    ///   <see cref="ComposizionePartenze" />. Questo evento reca anche informazioni sullo stato
    ///   iniziale. Di conseguenza calcola lo stato successivo che può essere
    ///   <see cref="Assegnato" /> oppure <see cref="InViaggio" />.
    /// </summary>
    internal class FuoriSincro : AbstractStatoMezzo
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="istanteTransizione">
        ///   L'istante in cui avviene la transizione in questo stato
        /// </param>
        public FuoriSincro(DateTime istanteTransizione) : base(istanteTransizione)
        {
        }

        /// <summary>
        ///   In questo stato non ha senso chiedere se il mezzo è assegnato ad una richiesta.
        /// </summary>
        public override bool AssegnatoARichiesta
        {
            get
            {
                throw new InvalidOperationException();
            }
        }

        /// <summary>
        ///   Codice identificativo dello stato
        /// </summary>
        public override string Codice
        {
            get
            {
                return nameof(FuoriSincro);
            }
        }

        /// <summary>
        ///   Descrizione dello stato
        /// </summary>
        /// <remarks>
        ///   Se il flusso applicativo esegue questo metodo sullo stato FuoriSincro c'è sertamente un
        ///   errore logico. Il metodo pertanto solleva un'eccezione.
        /// </remarks>
        public override string Descrizione
        {
            get
            {
                throw new InvalidOperationException("Non ha senso chiedere la descrizione nello stato fuori sincro.");
            }
        }

        /// <summary>
        ///   In questo stato non ha senso chiedere se il mezzo è disponibile per l'assegnazione.
        /// </summary>
        public override bool Disponibile
        {
            get
            {
                throw new InvalidOperationException();
            }
        }

        /// <summary>
        ///   Non ha senso invocare il metodo per lo stato <see cref="FuoriSincro" />.
        /// </summary>
        public override DateTime IstanteTransizione
        {
            get
            {
                throw new InvalidOperationException();
            }
        }

        /// <summary>
        ///   Nello stato <see cref="FuoriSincro" /> un evento <see cref="ComposizionePartenze" /> fa
        ///   transire verso lo stato <see cref="Assegnato" /> se la composizione avviene col mezzo
        ///   in sede, oppure verso lo stato <see cref="Libero" /> se la composizione avviene mentre
        ///   il mezzo non è in sede.
        /// </summary>
        /// <param name="composizionePartenze">Il visitor</param>
        /// <returns>Il nuovo stato a valle dell'evento di composizione</returns>
        public override IStatoMezzo AcceptVisitor(ComposizionePartenze composizionePartenze)
        {
            if (composizionePartenze.FuoriSede)
            {
                return new Libero(composizionePartenze.Istante);
            }
            else
            {
                return new Assegnato(composizionePartenze.Istante, composizionePartenze.CodiceRichiesta);
            }
        }

        /// <summary>
        ///   Nello stato <see cref="FuoriSincro" /> non può essere gestito l'evento <see cref="VaInFuoriServizio" />
        /// </summary>
        /// <param name="vaInFuoriServizio">Il visitor</param>
        /// <returns>Nulla perché solleva un'eccezione</returns>
        public override IStatoMezzo AcceptVisitor(VaInFuoriServizio vaInFuoriServizio)
        {
            return new FuoriServizio(vaInFuoriServizio.Istante);
        }
    }
}
