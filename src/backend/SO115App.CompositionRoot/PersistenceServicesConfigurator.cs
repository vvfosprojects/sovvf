//-----------------------------------------------------------------------
// <copyright file="PersistenceServicesConfigurator.cs" company="CNVVF">
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
using SimpleInjector;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.GeneratoreFakeRichieste;
using System;
using System.Collections.Generic;

namespace SO115App.CompositionRoot
{
    /// <summary>
    ///   Effettua il binding di tutti i servizi che vengono implementati dallo strato di
    ///   persistenza. La centralizzazione di queste regole permette di switchare agevolmente lo
    ///   strato di persistenza scegliendo alternativamente dei servizi basati su database, su
    ///   memoria o servizi fake.
    /// </summary>
    internal static class PersistenceServicesConfigurator
    {
        internal static void Configure(Container container)
        {
            //Configure_JsonDatabase(container);
            Configure_InMemoryDatabase(container, false);
        }

        private static void Configure_JsonDatabase(Container container)
        {
            // qui vanno inseriti i bindings dei servizi di persistenza affidati al modulo di
            // persistenza basato su files Json.
        }

        private static void Configure_InMemoryDatabase(Container container, bool generazioneInterventiFake = false)
        {
            // Indica quali sono le unità operative per le quali si generano interventi fake
            var codiciUnitaOperativeInterventiFake = new[] { "RM.1000", "VT.1000", "RI.1000", "LT.1000", "FR.1000" };

            // indica di quanti giorni andare indietro per la generazione degli interventi fake
            var giorniIndietroInterventiFake = 5;

            var richieste = new List<RichiestaAssistenza>();

            if (generazioneInterventiFake)
            {
                var quickGenerator = new QuickGenerator(codiciUnitaOperativeInterventiFake, giorniIndietroInterventiFake);
                richieste.AddRange(quickGenerator.Genera());
            }

            container.Register<SO115App.FakePersistence.InMemory.DbRichieste>(() =>
            {
                return new SO115App.FakePersistence.InMemory.DbRichieste(richieste);
            },
            Lifestyle.Singleton);

            container.Register<SO115App.FakePersistence.InMemory.DbCodiciRichieste>(Lifestyle.Singleton);

            //container.Register<
            //    Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta.IGeneraCodiceRichiesta,
            //    FakePersistence.InMemory.DbCodiciRichieste>(Lifestyle.Singleton);
        }
    }
}
