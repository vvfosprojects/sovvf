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
using System.Linq;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    /// <summary>
    ///   Classe per la simulazione di un parco mezzi. Crea una serie di mezzi fake secondo i
    ///   parametri indicati e consente di prelevare il mezzo disponibile tra tutti quelli in servizio.
    /// </summary>
    internal class ParcoMezzi
    {
        /// <summary>
        ///   L'array dei mezzi fake
        /// </summary>
        private Mezzo2[] mezzi;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="numeroMezzi">Il numero dei mezzi costituente il parco</param>
        /// <param name="codiceUnitaOperativa">
        ///   L'unità operativa alla quale appartengono i mezzi (l'etichetta viene usata per creare
        ///   il codice di un mezzo)
        /// </param>
        public ParcoMezzi(int numeroMezzi, string codiceUnitaOperativa)
        {
            this.mezzi = new Mezzo2[numeroMezzi];

            for (int i = 0; i < numeroMezzi; i++)
            {
                this.mezzi[i] = Mezzo2.CreateMezzoFake(codiceUnitaOperativa);
            }
        }

        /// <summary>
        ///   Restituisce il primo mezzo disponibile, se esistente
        /// </summary>
        /// <returns>Il primo mezzo disponibile, null se nessun mezzo è disponibile</returns>
        public Mezzo2 GetPrimoMezzoDisponibile()
        {
            return this.mezzi.FirstOrDefault(m => m.ContestoMezzo.State.Disponibile);
        }
    }
}
