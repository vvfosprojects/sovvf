//-----------------------------------------------------------------------
// <copyright file="QuickGenerator.cs" company="CNVVF">
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
using System.Text;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma.Implementazioni;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi;
using SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma;
using SO115App.GeneratoreRichiesteFake;

namespace SO115App.GeneratoreFakeRichieste
{
    public class QuickGenerator
    {
        private readonly string[] codiciUnitaOperative;
        private readonly int giorniIndietro;

        /// <summary>
        ///   Genera una collezione di <see cref="RichiestaAssistenza" /> con parametri di default verosimili.
        /// </summary>
        /// <param name="codiciUnitaOperative">
        ///   I codici delle unità operative per le quali devono essere generate le richieste
        /// </param>
        /// <param name="giorniIndietro">Il numero di ultimi giorni in cui ricadono le richieste</param>
        public QuickGenerator(string[] codiciUnitaOperative,
            int giorniIndietro)
        {
            this.codiciUnitaOperative = codiciUnitaOperative;
            this.giorniIndietro = giorniIndietro;
        }

        public IEnumerable<RichiestaAssistenza> Genera()
        {
            var getUnitaOperativaRadice = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var espandiPinNodoSuOrganigramma = new EspandiPinNodoSuOrganigramma(getUnitaOperativaRadice);
            var getMezziInServizioPerUnitaOperativa_Fake = new GetMezziInServizioPerUnitaOperativa_Fake(espandiPinNodoSuOrganigramma);
            var generatoreCoordinateIntervento = new GeneratoreCoordinateInterventoPerUO();

            foreach (var codiceUo in this.codiciUnitaOperative)
            {
                var generatoreFakeRichieste = new GeneratoreRichiesteFake.GeneratoreRichieste(
                    codiceUo,
                    getMezziInServizioPerUnitaOperativa_Fake,
                    DateTime.UtcNow.AddDays(this.giorniIndietro),
                    DateTime.UtcNow,
                    50,
                    45 * 60,
                    15 * 60,
                    50 * 60,
                    25 * 60,
                    new[] { 0.70f, 0.23f, 0.05f, 0.02f },
                    generatoreCoordinateIntervento
                    );

                var richieste = generatoreFakeRichieste.Genera();
                foreach (var richiesta in richieste)
                    yield return richiesta;
            }
        }
    }
}
