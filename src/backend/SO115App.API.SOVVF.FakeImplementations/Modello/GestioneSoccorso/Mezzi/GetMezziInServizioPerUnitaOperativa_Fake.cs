//-----------------------------------------------------------------------
// <copyright file="GetMezziInServizioPerUnitaOperativa_Fake.cs" company="CNVVF">
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
using Bogus;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Soccorso.Mezzi;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi
{
    /// <summary>
    ///   Restituisce una lista fittizia di mezzi a partire dal codice di un'unità operativa. Per le
    ///   unità operative che terminano per 1000, restituisce anche Autobotte e Autoscala.
    /// </summary>
    public class GetMezziInServizioPerUnitaOperativa_Fake : IGetMezziInServizioPerUnitaOperativa
    {
        private static Faker faker = new Faker();
        private readonly IEspandiPinNodoSuOrganigramma espandiPinNodoSuOrganigramma;

        public GetMezziInServizioPerUnitaOperativa_Fake(IEspandiPinNodoSuOrganigramma espandiPinNodoSuOrganigramma)
        {
            this.espandiPinNodoSuOrganigramma = espandiPinNodoSuOrganigramma ?? throw new ArgumentNullException(nameof(espandiPinNodoSuOrganigramma));
        }

        public IEnumerable<Mezzo> Get(IEnumerable<PinNodo> nodi)
        {
            var codiciSede = this.espandiPinNodoSuOrganigramma.Espandi(nodi);

            foreach (var codiceSede in codiciSede)
            {
                {
                    var targaAps = faker.Random.Number(20000, 20999);
                    yield return new Mezzo(
                        codiceSede + "." + targaAps,
                        "APS-" + targaAps,
                        "APS");
                }

                {
                    var haAps3Posti = faker.Random.Number() < .2;
                    if (haAps3Posti)
                    {
                        var targaAps3p = faker.Random.Number(21000, 21999);
                        yield return new Mezzo(
                                codiceSede + "." + targaAps3p,
                                "APS3p-" + targaAps3p,
                                "APS3p");
                    }
                }

                {
                    var comando = codiceSede.EndsWith("1000");
                    if (comando)
                    {
                        {
                            var haSecondaAps = faker.Random.Number() < .5;
                            if (haSecondaAps)
                            {
                                var targa2aAps = faker.Random.Number(23000, 23999);
                                yield return new Mezzo(
                                    codiceSede + "." + targa2aAps,
                                    "APS-" + targa2aAps,
                                    "APS");
                            }
                        }

                        {
                            var targaAutobotte = faker.Random.Number(24000, 24999);
                            yield return new Mezzo(
                                    codiceSede + "." + targaAutobotte,
                                    "AB-" + targaAutobotte,
                                    "AB");
                        }

                        {
                            var targaAutoscala = faker.Random.Number(25000, 25999);
                            yield return new Mezzo(
                                    codiceSede + "." + targaAutoscala,
                                    "AS-" + targaAutoscala,
                                    "AS");
                        }
                    }
                }
            }
        }
    }
}
