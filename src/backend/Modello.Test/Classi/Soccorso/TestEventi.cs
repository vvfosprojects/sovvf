//-----------------------------------------------------------------------
// <copyright file="TestEventi.cs" company="CNVVF">
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
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestEventi
    {
        private RichiestaAssistenza richiesta = new RichiestaAssistenza();

        [Test]
        public void Un_evento_di_inizio_presa_in_carico_non_puo_avere_una_data_di_default()
        {
            Assert.That(
                () => new InizioPresaInCarico(this.richiesta, new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_inizio_presa_in_carico_non_può_avere_una_fonte_whitespace()
        {
            Assert.That(
                () => new InizioPresaInCarico(this.richiesta, DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_inizio_presa_in_carico_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new InizioPresaInCarico(this.richiesta, now, "Fonte");

            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_arrivo_sul_posto_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new ArrivoSulPosto(this.richiesta, "M1", now, "Fonte");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_arrivo_sul_posto_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ArrivoSulPosto(this.richiesta, " ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_arrivo_sul_posto_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new ArrivoSulPosto(this.richiesta, "M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_arrivo_sul_posto_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ArrivoSulPosto(this.richiesta, "M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_partenza_in_rientro_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new PartenzaInRientro(this.richiesta, "M1", now, "Fonte");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_partenza_in_rientro_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaInRientro(this.richiesta, " ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_partenza_in_rientro_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaInRientro(this.richiesta, "M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_partenza_in_rientro_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaInRientro(this.richiesta, "M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_partenza_rientrata_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new PartenzaRientrata(this.richiesta, "M1", now, "Fonte");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_partenza_rientrata_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaRientrata(this.richiesta, " ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_partenza_rientrata_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaRientrata(this.richiesta, "M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_partenza_rientrata_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaRientrata(this.richiesta, "M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new Riassegnazione(this.richiesta, "R1", "M1", DateTime.Now, "Fonte");

            Assert.That(evento.CodiceRichiesta, Is.EqualTo("R1"));
            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_richiesta_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new Riassegnazione(this.richiesta, " ", "M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new Riassegnazione(this.richiesta, "R1", " ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new Riassegnazione(this.richiesta, "R1", "M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new Riassegnazione(this.richiesta, "R1", "M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_componente_partenza_con_codice_fiscale_e_correttamente_creato()
        {
            var evento = new ComponentePartenza("CF1");

            Assert.That(evento.CodiceFiscale, Is.EqualTo("CF1"));
            Assert.That(evento.CodiceMezzo, Is.Null);
            Assert.That(evento.Ticket, Is.Null);
            Assert.That(evento.Ruoli, Is.Not.Null);
        }

        [Test]
        public void Un_componente_partenza_con_codice_fiscale_e_mezzo_e_correttamente_creato()
        {
            var evento = new ComponentePartenza("CF1", "M1");

            Assert.That(evento.CodiceFiscale, Is.EqualTo("CF1"));
            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Ticket, Is.Null);
            Assert.That(evento.Ruoli, Is.Not.Null);
        }

        [Test]
        public void Un_componente_partenza_con_codice_fiscale_mezzo_e_ticket_e_correttamente_creato()
        {
            var evento = new ComponentePartenza("CF1", "M1", "Ticket");

            Assert.That(evento.CodiceFiscale, Is.EqualTo("CF1"));
            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Ticket, Is.EqualTo("Ticket"));
            Assert.That(evento.Ruoli, Is.Not.Null);
        }

        [Test]
        public void Un_componente_partenza_con_codice_fiscale_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComponentePartenza(" "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_componente_partenza_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComponentePartenza("CF1", " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_componente_partenza_con_ticket_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComponentePartenza("CF1", "M1", " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_composizione_partenze_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new ComposizionePartenze(this.richiesta, now, "Fonte");

            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_composizione_partenze_ha_i_componenti_non_null()
        {
            var evento = new ComposizionePartenze(this.richiesta, DateTime.Now, "Fonte");

            Assert.That(evento.Componenti, Is.Not.Null);
        }

        [Test]
        public void Un_evento_di_composizione_partenze_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComposizionePartenze(this.richiesta, new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_composizione_partenze_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComposizionePartenze(this.richiesta, DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new FuoriServizio(this.richiesta, " ", DateTime.Now, "Fonte", "motivazione"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new FuoriServizio(this.richiesta, "M1", new DateTime(), "Fonte", "motivazione"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new FuoriServizio(this.richiesta, "M1", DateTime.Now, " ", "motivazione"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_motivazione_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new FuoriServizio(this.richiesta, "M1", DateTime.Now, "Fonte", " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_parametri_corretti_puo_essere_creato()
        {
            var now = DateTime.Now;
            var evento = new FuoriServizio(this.richiesta, "M1", now, "Fonte", "motivazione");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
            Assert.That(evento.Motivazione, Is.EqualTo("motivazione"));
        }

        [Test]
        public void Un_evento_di_uscita_partenza_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new UscitaPartenza(this.richiesta, "M1", now, "Fonte");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_uscita_partenza_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new UscitaPartenza(this.richiesta, " ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_uscita_partenza_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new UscitaPartenza(this.richiesta, "M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_uscita_partenza_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new UscitaPartenza(this.richiesta, "M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_telefonata_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new Telefonata(this.richiesta, "ABC123", now, "Fonte");

            Assert.That(evento.Codice, Is.EqualTo("ABC123"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_telefonata_con_codice_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new Telefonata(this.richiesta, " ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_telefonata_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new Telefonata(this.richiesta, "ABC123", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_telefonata_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new UscitaPartenza(this.richiesta, "ABC123", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_con_richiesta_null_non_puo_essere_creato()
        {
            Assert.That(
                () => new UscitaPartenza(null, "ABC123", DateTime.Now, "Fonte"),
                Throws.ArgumentNullException);
        }

        [Test]
        public void Un_evento_non_puo_essere_creato_per_una_richiesta_che_ne_ha_gia_uno_piu_recente()
        {
            var istantePrecedente = DateTime.Now;
            var istanteSuccessivo = istantePrecedente.AddSeconds(1);

            var richiesta = new RichiestaAssistenza();
            new UscitaPartenza(richiesta, "M1", istanteSuccessivo, "Fonte");

            Assert.That(
                () => new ArrivoSulPosto(richiesta, "M1", istantePrecedente, "Fonte"),
                Throws.InstanceOf<InvalidOperationException>());
        }

        [Test]
        public void Un_evento_puo_essere_creato_per_una_richiesta_che_ne_ha_gia_uno_meno_recente()
        {
            var istantePrecedente = DateTime.Now;
            var istanteSuccessivo = istantePrecedente.AddSeconds(1);

            var richiesta = new RichiestaAssistenza();
            new UscitaPartenza(richiesta, "M1", istantePrecedente, "Fonte");
            new ArrivoSulPosto(richiesta, "M1", istanteSuccessivo, "Fonte");

            Assert.Pass();
        }
    }
}
