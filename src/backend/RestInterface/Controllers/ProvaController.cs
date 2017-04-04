//-----------------------------------------------------------------------
// <copyright file="ProvaController.cs" company="CNVVF">
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
using System.Diagnostics;
using System.Web.Http;
using RestInterface.Models;

namespace RestInterface.Controllers
{
    /// <summary>
    ///   Controller di prova per verificare il funzionamento dell'architettura rest WebApi
    /// </summary>
    public class ProvaController : ApiController
    {
        /// <summary>
        ///   Metodo di prova
        /// </summary>
        /// <param name="chiSei">Parametro del metodo</param>
        /// <returns>Restituisce qualcosa</returns>
        public string GetRisposta(string chiSei)
        {
            return "Ciao " + chiSei;
        }

        /// <summary>
        ///   Calcola la distanza tra due punti
        /// </summary>
        /// <param name="c">I punti dei quali calcolare la distanza</param>
        /// <returns>Distanza tra i due punti</returns>
        public Distanza CalcolaDistanza(CoppiaDiPunti c)
        {
            var stopwatch = new Stopwatch();
            stopwatch.Start();
            var p1 = c.P1;
            var p2 = c.P2;
            var distanza = Math.Sqrt(Math.Pow(p2.X - p1.X, 2) + Math.Pow(p2.Y - p1.Y, 2));
            stopwatch.Stop();
            var elapsedmsec = stopwatch.ElapsedMilliseconds;

            return new Distanza()
            {
                DistanzaCalcolata = distanza,
                Millisecondi = (int)elapsedmsec
            };
        }
    }
}
