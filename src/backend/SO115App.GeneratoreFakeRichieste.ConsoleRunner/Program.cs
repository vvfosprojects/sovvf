//-----------------------------------------------------------------------
// <copyright file="Program.cs" company="CNVVF">
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
using System.Linq;
using Newtonsoft.Json;
using Persistence.MongoDB;
using Serilog;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma.Implementazioni;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi;
using SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma;
using SO115App.GeneratoreRichiesteFake;
using SO115App.Persistence.MongoDB;

namespace SO115App.GeneratoreFakeRichieste.ConsoleRunner
{
    internal class Program
    {
        /// <summary>
        ///   Questo metodo utilizza la classe <see cref="GeneratoreRichieste" /> per generare una
        ///   serie di interventi fake.
        /// </summary>
        /// <param name="args">Inutilizzato</param>
        private static void Main(string[] args)
        {
            ConfigureLog();

            var DBContext = new DbContext("mongodb://localhost:27017", "sovvf");
            var Salvataggio = new SaveRichiesta(DBContext);

            var getUnitaOperativaRadice = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var espandiPinNodoSuOrganigramma = new EspandiPinNodoSuOrganigramma(getUnitaOperativaRadice);
            var getMezziInServizioPerUnitaOperativa_Fake = new GetMezziInServizioPerUnitaOperativa_Fake(espandiPinNodoSuOrganigramma);
            var generatoreCoordinateIntervento = new GeneratoreCoordinateInterventoPerUO();
            var generatoreFakeRichieste = new GeneratoreRichieste(
                "TO.1000",
                getMezziInServizioPerUnitaOperativa_Fake,
                DateTime.UtcNow.AddDays(-5),
                DateTime.UtcNow,
                50,
                45 * 60,
                15 * 60,
                50 * 60,
                25 * 60,
                new[] { 0.70f, 0.23f, 0.05f, 0.02f },
                generatoreCoordinateIntervento
                );

            var richieste = generatoreFakeRichieste.Genera().ToArray();

            int indice = 00000;
            int anno = DateTime.Now.Year;
            foreach (var richiesta in richieste)
            {
                if (richiesta.Partenze.Count > 0)
                {
                    int ultimeDueCifreAnno = anno % 100;
                    int maxNumero = indice;
                    string returnFormatString = string.Format("{0}{1}{2:D5}", richiesta.CodSOCompetente.Split('.')[0], ultimeDueCifreAnno, maxNumero);
                    string codiceMezzo = "";

                    if (richiesta.Eventi.ToList().Find(x => x is UscitaPartenza) != null)
                        codiceMezzo = ((UscitaPartenza)richiesta.Eventi.ToList().Find(x => x is UscitaPartenza)).CodiceMezzo;

                    foreach (var evento in richiesta.Eventi)
                    {
                        if (evento is ComposizionePartenze)
                        {
                            ((ComposizionePartenze)evento).Partenza = generatoreFakeRichieste.GeneraListaPartenze(richiesta.CodSOCompetente.Split('.')[0], codiceMezzo).First();
                            ((ComposizionePartenze)evento).Componenti = new List<ComponentePartenza>().ToHashSet();
                        }
                    }

                    richiesta.CodRichiesta = returnFormatString;
                }

                Salvataggio.Save(richiesta);
                indice++;
            }

            //Log.Debug(JsonConvert.SerializeObject(richieste));
        }

        private static void ConfigureLog()
        {
            var log = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.Trace()
                .CreateLogger();

            Log.Logger = log;

            Log.Debug("Log configured");
        }
    }
}
