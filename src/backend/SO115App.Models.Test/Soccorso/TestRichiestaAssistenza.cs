//-----------------------------------------------------------------------
// <copyright file="TestRichiestaAssistenza.cs" company="CNVVF">
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
using NUnit.Framework;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Fonogramma;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestRichiestaAssistenza
    {
        [Test]
        public void SeLaListaDiEventiEVuotaNonCiSonoChiamate()
        {
            var richiesta = new RichiestaAssistenza();

            var chiamate = richiesta.Telefonate;

            Assert.That(chiamate.Count, Is.Zero);
        }

        [Test]
        public void UnaSingolaChiamataECorrettamenteInserita()
        {
            var richiesta = new RichiestaAssistenza();
            var telefonata = new Telefonata(richiesta, "ABC", DateTime.Now, "Fonte");

            var telefonate = richiesta.Telefonate;

            Assert.That(telefonate.Count, Is.EqualTo(1));
        }

        [Test]
        public void LaPrioritaEMediaInAssenzaDiEventi()
        {
            var richiesta = new RichiestaAssistenza();

            var priorita = richiesta.PrioritaRichiesta;

            Assert.That(priorita, Is.EqualTo(RichiestaAssistenza.Priorita.Media));
        }

        [Test]
        public void LaPrioritaECorrettamenteRestituita()
        {
            var richiesta = new RichiestaAssistenza();
            new AssegnazionePriorita(richiesta, RichiestaAssistenza.Priorita.Alta, DateTime.Now, "Fonte");

            var priorita = richiesta.PrioritaRichiesta;

            Assert.That(priorita, Is.EqualTo(RichiestaAssistenza.Priorita.Alta));
        }

        [Test]
        public void ValeLUltimoDiDueEventiDiAssegnazionePriorita()
        {
            var time = DateTime.Now.AddSeconds(-10);
            var richiesta = new RichiestaAssistenza();
            new AssegnazionePriorita(richiesta, RichiestaAssistenza.Priorita.Alta, time, "Fonte");
            new AssegnazionePriorita(richiesta, RichiestaAssistenza.Priorita.Bassa, time.AddSeconds(5), "Fonte");

            var priorita = richiesta.PrioritaRichiesta;

            Assert.That(priorita, Is.EqualTo(RichiestaAssistenza.Priorita.Bassa));
        }

        [Test]
        public void InAssenzaDiSegnalazioniLIstanteRichiestaENull()
        {
            var richiesta = new RichiestaAssistenza();

            var istanteRicezioneRichiesta = richiesta.IstanteRicezioneRichiesta;

            Assert.That(istanteRicezioneRichiesta, Is.Null);
        }

        [Test]
        public void LIstanteRichiestaECorrettamenteRestituito()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new Telefonata(richiesta, "codice", now, "fonte");

            var istanteRichiesta = richiesta.IstanteRicezioneRichiesta;

            Assert.That(istanteRichiesta, Is.EqualTo(now));
        }

        [Test]
        public void IlPrimoIstanteRichiestaERestituito()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new Telefonata(richiesta, "codice1", now, "fonte");
            new Telefonata(richiesta, "codice2", now.AddSeconds(5), "fonte");

            var istanteRichiesta = richiesta.IstanteRicezioneRichiesta;

            Assert.That(istanteRichiesta, Is.EqualTo(now));
        }

        [Test]
        public void LIstantePrimaAssegnazioneECorrettamenteRestituito()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new ComposizionePartenze(richiesta, now, "fonte", false);

            var istantePrimaAssegnazione = richiesta.IstantePrimaAssegnazione;

            Assert.That(istantePrimaAssegnazione, Is.EqualTo(now));
        }

        [Test]
        public void IlPrimoIstanteDiPrimaAssegnazioneERestituito()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new ComposizionePartenze(richiesta, now, "fonte", false);
            new ComposizionePartenze(richiesta, now.AddSeconds(5), "fonte", false);

            var istantePrimaAssegnazione = richiesta.IstantePrimaAssegnazione;

            Assert.That(istantePrimaAssegnazione, Is.EqualTo(now));
        }

        [Test]
        public void InAssenzaDiAssegnazioniLIstantePrimaAssegnazioneENull()
        {
            var richiesta = new RichiestaAssistenza();

            var istantePrimaAssegnazione = richiesta.IstantePrimaAssegnazione;

            Assert.That(istantePrimaAssegnazione, Is.Null);
        }

        [Test]
        public void InAssenzaDiTelefonateIlCodiceSchedaNueENull()
        {
            var richiesta = new RichiestaAssistenza();

            var codiceSchedaNue = richiesta.CodNue;

            Assert.That(codiceSchedaNue, Is.Null);
        }

        [Test]
        public void IlCodiceSchedaNueEQuelloDellaPrimaTelefonata()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new Telefonata(richiesta, "CodRichiesta", now, "fonte") { CodiceSchedaContatto = "CodNue1" };
            new Telefonata(richiesta, "CodRichiesta", now.AddSeconds(5), "fonte") { CodiceSchedaContatto = "CodNue2" };
            var codiceSchedaNue = richiesta.CodNue;

            Assert.That(codiceSchedaNue, Is.EqualTo("CodNue1"));
        }

        [Test]
        public void IlCodiceSchedaNueEQuelloDellaPrimaTelefonataCheNonHaIlCodiceNull()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new Telefonata(richiesta, "CodRichiesta", now, "fonte");
            new Telefonata(richiesta, "CodRichiesta", now.AddSeconds(5), "fonte") { CodiceSchedaContatto = "CodNue2" };
            var codiceSchedaNue = richiesta.CodNue;

            Assert.That(codiceSchedaNue, Is.EqualTo("CodNue2"));
        }

        [Test]
        public void FonogrammaNonNecessarioPerUnaRichiestaSenzaEventiFonogramma()
        {
            var richiesta = new RichiestaAssistenza();

            var statoInvioFonogramma = richiesta.StatoInvioFonogramma;

            Assert.That(statoInvioFonogramma, Is.InstanceOf<SO115App.API.Models.Classi.Soccorso.Fonogramma.NonNecessario>());
        }

        [Test]
        public void IlFonogrammaEDaInviareConEventoDiInvioRichiesto()
        {
            var richiesta = new RichiestaAssistenza();
            new InviareFonogramma(richiesta, DateTime.Now, "fonte", "Cc e Polizia", "1234", "5668");

            var statoInvioFonogramma = richiesta.StatoInvioFonogramma;

            Assert.That(statoInvioFonogramma, Is.InstanceOf<SO115App.API.Models.Classi.Soccorso.Fonogramma.DaInviare>());
        }

        [Test]
        public void IlFonogrammaEInviatoConEventoDiInvio()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new InviareFonogramma(richiesta, now, "fonte", "Cc e Polizia", "1234", "5668");
            new FonogrammaInviato(richiesta, now.AddSeconds(5), "fonte", "1234", "5668");

            var statoInvioFonogramma = richiesta.StatoInvioFonogramma;

            Assert.That(statoInvioFonogramma, Is.InstanceOf<SO115App.API.Models.Classi.Soccorso.Fonogramma.Inviato>());
        }

        [Test]
        public void IlFonogrammaEDaInviareSeAdEventoDiInvioSegueEventoDiInvioRichiesto()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new InviareFonogramma(richiesta, now, "fonte", "Cc e Polizia", "1234", "5668");
            new FonogrammaInviato(richiesta, now.AddSeconds(5), "fonte", "1234", "5668");
            new InviareFonogramma(richiesta, now.AddSeconds(10), "fonte", "Cc e Polizia", "1234", "5668");

            var statoInvioFonogramma = richiesta.StatoInvioFonogramma;

            Assert.That(statoInvioFonogramma, Is.InstanceOf<SO115App.API.Models.Classi.Soccorso.Fonogramma.DaInviare>());
        }

        [Test]
        public void LaComplessitaCon20EventiEBassa()
        {
            var richiesta = new RichiestaAssistenza();
            for (int i = 0; i < 20; i++)
            {
                new Telefonata(richiesta, $"Cod{i}", DateTime.Now.AddSeconds(1 * 10), "fonte");
            }

            var complessita = richiesta.Complessita;

            Assert.That(complessita, Is.InstanceOf<SO115App.API.Models.Classi.Soccorso.Complessita.Bassa>());
        }

        [Test]
        public void LaComplessitaCon21EventiEMedia()
        {
            var richiesta = new RichiestaAssistenza();
            for (int i = 0; i < 21; i++)
            {
                new Telefonata(richiesta, $"Cod{i}", DateTime.Now.AddSeconds(1 * 10), "fonte");
            }

            var complessita = richiesta.Complessita;

            Assert.That(complessita, Is.InstanceOf<SO115App.API.Models.Classi.Soccorso.Complessita.Media>());
        }

        [Test]
        public void LaComplessitaCon60EventiEMedia()
        {
            var richiesta = new RichiestaAssistenza();
            for (int i = 0; i < 60; i++)
            {
                new Telefonata(richiesta, $"Cod{i}", DateTime.Now.AddSeconds(1 * 10), "fonte");
            }

            var complessita = richiesta.Complessita;

            Assert.That(complessita, Is.InstanceOf<SO115App.API.Models.Classi.Soccorso.Complessita.Media>());
        }

        [Test]
        public void LaComplessitaCon61EventiEAlta()
        {
            var richiesta = new RichiestaAssistenza();
            for (int i = 0; i < 61; i++)
            {
                new Telefonata(richiesta, $"Cod{i}", DateTime.Now.AddSeconds(1 * 10), "fonte");
            }

            var complessita = richiesta.Complessita;

            Assert.That(complessita, Is.InstanceOf<SO115App.API.Models.Classi.Soccorso.Complessita.Alta>());
        }

        [Test]
        public void UnaRichiestaSenzaEventiEAperta()
        {
            var richiesta = new RichiestaAssistenza();

            var aperta = !richiesta.Chiusa;

            Assert.That(aperta, Is.True);
        }

        [Test]
        public void UnaRichiestaConEventoChiusuraEChiusa()
        {
            var richiesta = new RichiestaAssistenza();
            new ChiusuraRichiesta("test", richiesta, DateTime.Now, "fonte");

            var chiusa = richiesta.Chiusa;

            Assert.That(chiusa, Is.True);
        }

        [Test]
        public void UnaRichiestaConEventoChiusuraERiaperturaEAperta()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new ChiusuraRichiesta("test", richiesta, now, "fonte");
            new RiaperturaRichiesta("test", richiesta, now.AddSeconds(10), "fonte");

            var aperta = !richiesta.Chiusa;

            Assert.That(aperta, Is.True);
        }

        [Test]
        public void UnaRichiestaConEventoChiusuraRiaperturaEChiusuraEChiusa()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new ChiusuraRichiesta("test", richiesta, now, "fonte");
            new RiaperturaRichiesta("test", richiesta, now.AddSeconds(10), "fonte");
            new ChiusuraRichiesta("test", richiesta, now.AddSeconds(20), "fonte");

            var chiusa = richiesta.Chiusa;

            Assert.That(chiusa, Is.True);
        }

        [Test]
        public void UnaRichiestaDiAssistenzaVuotaHaIdNull()
        {
            var richiesta = new RichiestaAssistenza();

            Assert.That(richiesta.Id, Is.Null);
        }
    }
}
