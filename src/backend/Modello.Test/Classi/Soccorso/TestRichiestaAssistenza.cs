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
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Eventi.Fonogramma;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Eventi.Segnalazioni;
using NUnit.Framework;

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
        public void InAssenzaDiSegnalazioniLIstanteRichiestaDaEccezione()
        {
            var richiesta = new RichiestaAssistenza();

            Assert.Throws<InvalidOperationException>(() =>
            {
                var istanteRicezioneRichiesta = richiesta.IstanteRicezioneRichiesta;
            });
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

            var codiceSchedaNue = richiesta.CodiceSchedaNue;

            Assert.That(codiceSchedaNue, Is.Null);
        }

        [Test]
        public void IlCodiceSchedaNueEQuelloDellaPrimaTelefonata()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new Telefonata(richiesta, "CodRichiesta", now, "fonte") { CodiceSchedaContatto = "CodNue1" };
            new Telefonata(richiesta, "CodRichiesta", now.AddSeconds(5), "fonte") { CodiceSchedaContatto = "CodNue2" };
            var codiceSchedaNue = richiesta.CodiceSchedaNue;

            Assert.That(codiceSchedaNue, Is.EqualTo("CodNue1"));
        }

        [Test]
        public void IlCodiceSchedaNueEQuelloDellaPrimaTelefonataCheNonHaIlCodiceNull()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new Telefonata(richiesta, "CodRichiesta", now, "fonte");
            new Telefonata(richiesta, "CodRichiesta", now.AddSeconds(5), "fonte") { CodiceSchedaContatto = "CodNue2" };
            var codiceSchedaNue = richiesta.CodiceSchedaNue;

            Assert.That(codiceSchedaNue, Is.EqualTo("CodNue2"));
        }

        [Test]
        public void FonogrammaNonNecessarioPerUnaRichiestaSenzaEventiFonogramma()
        {
            var richiesta = new RichiestaAssistenza();

            var statoInvioFonogramma = richiesta.StatoInvioFonogramma;

            Assert.That(statoInvioFonogramma, Is.EqualTo(RichiestaAssistenza.StatoFonogramma.NonNecessario));
        }

        [Test]
        public void IlFonogrammaEDaInviareConEventoDiInvioRichiesto()
        {
            var richiesta = new RichiestaAssistenza();
            new InviareFonogramma(richiesta, DateTime.Now, "fonte", "Cc e Polizia");

            var statoInvioFonogramma = richiesta.StatoInvioFonogramma;

            Assert.That(statoInvioFonogramma, Is.EqualTo(RichiestaAssistenza.StatoFonogramma.DaInviare));
        }

        [Test]
        public void IlFonogrammaEInviatoConEventoDiInvio()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new InviareFonogramma(richiesta, now, "fonte", "Cc e Polizia");
            new FonogrammaInviato(richiesta, now.AddSeconds(5), "fonte");

            var statoInvioFonogramma = richiesta.StatoInvioFonogramma;

            Assert.That(statoInvioFonogramma, Is.EqualTo(RichiestaAssistenza.StatoFonogramma.Inviato));
        }

        [Test]
        public void IlFonogrammaEDaInviareSeAdEventoDiInvioSegueEventoDiInvioRichiesto()
        {
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            new InviareFonogramma(richiesta, now, "fonte", "Cc e Polizia");
            new FonogrammaInviato(richiesta, now.AddSeconds(5), "fonte");
            new InviareFonogramma(richiesta, now.AddSeconds(10), "fonte", "Cc e Polizia");

            var statoInvioFonogramma = richiesta.StatoInvioFonogramma;

            Assert.That(statoInvioFonogramma, Is.EqualTo(RichiestaAssistenza.StatoFonogramma.DaInviare));
        }
    }
}
