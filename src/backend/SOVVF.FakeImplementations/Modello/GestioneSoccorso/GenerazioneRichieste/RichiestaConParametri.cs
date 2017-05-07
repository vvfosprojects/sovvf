//-----------------------------------------------------------------------
// <copyright file="RichiestaConParametri.cs" company="CNVVF">
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
using Modello.Classi.Soccorso;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    /// <summary>
    ///   Una richiesta ed i relativi parametri casuali, utilizzati per la creazione degli eventi
    ///   nella richiesta, in competizione per le risorse disponibili con tutte le altre richieste.
    /// </summary>
    internal class RichiestaConParametri
    {
        /// <summary>
        ///   I parametri della richiesta
        /// </summary>
        public ParametriRichiesta Parametri { get; set; }

        /// <summary>
        ///   La richiesta alla quale vanno aggiunti gli eventi secondo i parametri e secondo
        ///   l'evoluzione di tutte le altre richieste in competizione per l'acquisizione delle risorse.
        /// </summary>
        public RichiestaAssistenza Richiesta { get; set; }
    }
}
