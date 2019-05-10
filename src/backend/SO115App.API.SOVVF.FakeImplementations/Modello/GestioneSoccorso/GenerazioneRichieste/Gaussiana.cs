//-----------------------------------------------------------------------
// <copyright file="Gaussiana.cs" company="CNVVF">
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

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    /// <summary>
    ///   Generatore di una variabile pseudo-random con distribuzione gaussiana.
    /// </summary>
    internal class Gaussiana
    {
        /// <summary>
        ///   Generatore random
        /// </summary>
        private static Random rnd = new Random();

        /// <summary>
        ///   La media della gaussiana
        /// </summary>
        private readonly float media;

        /// <summary>
        ///   La deviazione standard della gaussiana
        /// </summary>
        private readonly float devSt;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="media">La media della gaussiana</param>
        /// <param name="devSt">La varianza della gaussiana</param>
        public Gaussiana(float media, float devSt)
        {
            this.media = media;
            this.devSt = devSt;
        }

        /// <summary>
        ///   Genera variabili distribuite similmente ad una gaussiana.
        /// </summary>
        /// <param name="ancheNegativo">
        ///   Indica se un valore negativo è ammesso. L'eventuale valore negativo viene cimato a zero.
        /// </param>
        /// <returns>Il valore casuale</returns>
        /// <remarks><see cref="http://stackoverflow.com/questions/218060/random-gaussian-variables" /></remarks>
        public double Genera(bool ancheNegativo = false)
        {
            double u1 = 1.0 - rnd.NextDouble(); // uniform(0,1] random doubles
            double u2 = 1.0 - rnd.NextDouble();
            double randStdNormal = Math.Sqrt(-2.0 * Math.Log(u1)) *
                         Math.Sin(2.0 * Math.PI * u2); // random normal(0,1)
            double randNormal =
                         this.media + (this.devSt * randStdNormal); // random normal(mean,stdDev^2)

            if (randNormal < 0 && !ancheNegativo)
            {
                randNormal = 0;
            }

            return randNormal;
        }
    }
}