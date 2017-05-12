using System;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Eventi.Segnalazioni;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestEventi
    {
        [Test]
        public void Un_evento_di_inizio_presa_in_carico_non_puo_avere_una_data_di_default()
        {
            Assert.That(
                () => new InizioPresaInCarico(new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_inizio_presa_in_carico_non_può_avere_una_fonte_whitespace()
        {
            Assert.That(
                () => new InizioPresaInCarico(DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_inizio_presa_in_carico_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new InizioPresaInCarico(now, "Fonte");

            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_arrivo_sul_posto_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new ArrivoSulPosto("M1", now, "Fonte");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_arrivo_sul_posto_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ArrivoSulPosto(" ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_arrivo_sul_posto_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new ArrivoSulPosto("M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_arrivo_sul_posto_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ArrivoSulPosto("M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_partenza_in_rientro_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new PartenzaInRientro("M1", now, "Fonte");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_partenza_in_rientro_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaInRientro(" ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_partenza_in_rientro_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaInRientro("M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_partenza_in_rientro_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaInRientro("M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_partenza_rientrata_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new PartenzaRientrata("M1", now, "Fonte");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_partenza_rientrata_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaRientrata(" ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_partenza_rientrata_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaRientrata("M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_partenza_rientrata_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new PartenzaRientrata("M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new Riassegnazione("R1", "M1", DateTime.Now, "Fonte");

            Assert.That(evento.CodiceRichiesta, Is.EqualTo("R1"));
            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_richiesta_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new Riassegnazione(" ", "M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new Riassegnazione("R1", " ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new Riassegnazione("R1", "M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_riassegnazione_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new Riassegnazione("R1", "M1", DateTime.Now, " "),
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
            var evento = new ComposizionePartenze(now, "Fonte");

            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_composizione_partenze_ha_i_componenti_non_null()
        {
            var evento = new ComposizionePartenze(DateTime.Now, "Fonte");

            Assert.That(evento.Componenti, Is.Not.Null);
        }

        [Test]
        public void Un_evento_di_composizione_partenze_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComposizionePartenze(new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_composizione_partenze_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComposizionePartenze(DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new FuoriServizio(" ", DateTime.Now, "Fonte", "motivazione"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new FuoriServizio("M1", new DateTime(), "Fonte", "motivazione"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new FuoriServizio("M1", DateTime.Now, " ", "motivazione"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_motivazione_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new FuoriServizio("M1", DateTime.Now, "Fonte", " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_fuori_servizio_con_parametri_corretti_puo_essere_creato()
        {
            var now = DateTime.Now;
            var evento = new FuoriServizio("M1", now, "Fonte", "motivazione");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
            Assert.That(evento.Motivazione, Is.EqualTo("motivazione"));
        }

        [Test]
        public void Un_evento_di_uscita_partenza_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new UscitaPartenza("M1", now, "Fonte");

            Assert.That(evento.CodiceMezzo, Is.EqualTo("M1"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_uscita_partenza_con_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new UscitaPartenza(" ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_uscita_partenza_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new UscitaPartenza("M1", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_uscita_partenza_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new UscitaPartenza("M1", DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_telefonata_con_parametri_corretti_e_correttamente_creato()
        {
            var now = DateTime.Now;
            var evento = new Telefonata("ABC123", now, "Fonte");

            Assert.That(evento.Codice, Is.EqualTo("ABC123"));
            Assert.That(evento.Istante, Is.EqualTo(now));
            Assert.That(evento.CodiceFonte, Is.EqualTo("Fonte"));
        }

        [Test]
        public void Un_evento_di_telefonata_con_codice_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new Telefonata(" ", DateTime.Now, "Fonte"),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_telefonata_con_data_di_default_non_puo_essere_creato()
        {
            Assert.That(
                () => new Telefonata("ABC123", new DateTime(), "Fonte"),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_telefonata_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new UscitaPartenza("ABC123", DateTime.Now, " "),
                Throws.ArgumentException);
        }
    }
}
