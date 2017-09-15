//-----------------------------------------------------------------------
// <copyright file="TestMapperRichiestaSuSintesi.cs" company="CNVVF">
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
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Eventi.Segnalazioni;
using Modello.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestMapperRichiestaSuSintesi
    {
        [Test]
        public void LIdRichiestaECorrettamenteMappato()
        {
            var now = DateTime.Now;
            var richiesta = this.GetRichiestaBenFormata(istanteRicezione: now);
            richiesta.Id = "TestId";
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Id, Is.EqualTo(richiesta.Id));
        }

        [Test]
        public void IlCodiceRichiestaECorrettamenteMappato()
        {
            var now = DateTime.Now;
            var richiesta = this.GetRichiestaBenFormata(istanteRicezione: now);
            richiesta.Codice = "TestCod";
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Codice, Is.EqualTo(richiesta.Codice));
        }

        [Test]
        public void UnaRichiestaRilevanteHaLaRilevanzaCorrettamenteMappata()
        {
            var now = DateTime.Now;
            var richiesta = this.GetRichiestaBenFormata(istanteRicezione: now);
            new MarcaRilevante(richiesta, DateTime.Now, "fonte", "motivazioneTest");
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Rilevante, Is.True);
        }

        [Test]
        public void UnaRichiestaNonRilevanteHaLaRilevanzaCorrettamenteMappata()
        {
            var now = DateTime.Now;
            var richiesta = this.GetRichiestaBenFormata(istanteRicezione: now);
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Rilevante, Is.False);
        }

        [Test]
        public void UnaRichiestaHaLIstanteRicezioneRichiestaCorrettamenteMappato()
        {
            var now = DateTime.Now;
            var richiesta = this.GetRichiestaBenFormata(istanteRicezione: now);
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.IstanteRicezioneRichiesta, Is.EqualTo(richiesta.IstanteRicezioneRichiesta));
        }

        [Test]
        public void UnaRichiestaHaLIstantePrimaAssegnazioneCorrettamenteMappato()
        {
            var now = DateTime.Now;
            var richiesta = this.GetRichiestaBenFormata(istanteRicezione: now);
            new ComposizionePartenze(richiesta, now.AddSeconds(5), "fonte", false);
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.IstantePrimaAssegnazione, Is.EqualTo(richiesta.IstantePrimaAssegnazione));
        }

        private RichiestaAssistenza GetRichiestaBenFormata(DateTime istanteRicezione)
        {
            var richiesta = new RichiestaAssistenza();
            new Telefonata(richiesta, "TestCode", istanteRicezione, "fonte");

            return richiesta;
        }
    }
}
