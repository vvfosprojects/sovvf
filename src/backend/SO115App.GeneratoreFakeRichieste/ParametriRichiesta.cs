//-----------------------------------------------------------------------
// <copyright file="ParametriRichiesta.cs" company="CNVVF">
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
using Bogus;
using System;
using System.Linq;

namespace SO115App.GeneratoreRichiesteFake
{
    /// <summary>
    ///   Indica i parametri di una richiesta di assistenza, calcolati in maniera random secondo la
    ///   caratterizzazione scelta
    /// </summary>
    internal class ParametriRichiesta
    {
        /// <summary>
        ///   Il generatore di dati casuali
        /// </summary>
        private static readonly Faker FAKER = new Faker();

        /// <summary>
        ///   Indica la data alla quale giunge la segnalazione dell'intervento
        /// </summary>
        public DateTime DataSegnalazione { get; set; }

        /// <summary>
        ///   Ogni elemento dell'array indica la presenza di un mezzo, ed i relativi parametri
        /// </summary>
        public ParametriMezzo[] ParametriMezzi { get; set; }

        /// <summary>
        ///   Metodo per la generazione di parametri di una richiesta fake
        /// </summary>
        /// <param name="dataMin">
        ///   L'estremo inferiore dell'intervallo in cui le richieste possono essere generate
        /// </param>
        /// <param name="dataMax">
        ///   L'estremo superiore dell'intervallo in cui le richieste possono essere generate
        /// </param>
        /// <param name="pesiNumeroMezziPartecipanti">
        ///   Pesi del numero di mezzi partecipanti ad un intervento (per es. se i pesi sono[0.75,
        ///   0.20, 0.05] significa che al 75% un intervento ha un solo mezzo, al 20% ne ha due, al
        ///   5% ne ha tre).
        /// </param>
        /// <param name="secondiPartenzeSuccessive">
        ///   Gaussiana per la generazione del tempo dopo il quale vengono inviate le partenza
        ///   successive alla prima
        /// </param>
        /// <param name="secondiArrivoSulPosto">
        ///   Gaussiana per la generazione del tempo di viaggio verso il luogo del sinistro
        /// </param>
        /// <param name="secondiPermanenzaSulPosto">
        ///   Gaussiana per la generazione del tempo di permanenza del mezzo sul posto
        /// </param>
        /// <param name="secondiInRientro">
        ///   Gaussiana per la generazione del tempo di viaggio dal luogo del sinistro verso la sede
        ///   (sempre che il mezzo non venga rediretto su altra richiesta)
        /// </param>
        /// <returns>L'istanza fake creata</returns>
        public static ParametriRichiesta GetParametriFake(
            DateTime dataMin,
            DateTime dataMax,
            float[] pesiNumeroMezziPartecipanti,
            Gaussiana secondiPartenzeSuccessive,
            Gaussiana secondiArrivoSulPosto,
            Gaussiana secondiPermanenzaSulPosto,
            Gaussiana secondiInRientro)
        {
            var numeroMezzi = FAKER.Random.WeightedRandom(Enumerable.Range(1, pesiNumeroMezziPartecipanti.Length).ToArray(), pesiNumeroMezziPartecipanti);
            var dataSegnalazione = FAKER.Date.Between(dataMin, dataMax);
            var parametriRichiesta = new ParametriRichiesta()
            {
                DataSegnalazione = dataSegnalazione,
                ParametriMezzi = Enumerable.Range(1, numeroMezzi)
                    .Select(i =>
                        ParametriMezzo.GenerateFake(
                            i == 1, // la prima partenza è sempre immediata
                            secondiPartenzeSuccessive,
                            secondiArrivoSulPosto,
                            secondiPermanenzaSulPosto,
                            secondiInRientro))
                    .OrderBy(p => p.SecondiComposizione)
                    .ToArray()
            };

            return parametriRichiesta;
        }
    }
}