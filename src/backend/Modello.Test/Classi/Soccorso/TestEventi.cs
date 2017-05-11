using System;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Eventi.Partenze;
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
        public void Un_evento_di_inizio_presa_in_carico_non_può_avere_una_fonte_null()
        {
            Assert.That(
                () => new InizioPresaInCarico(DateTime.Now, null),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_inizio_presa_in_carico_non_può_avere_una_fonte_empty()
        {
            Assert.That(
                () => new InizioPresaInCarico(DateTime.Now, string.Empty),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_inizio_presa_in_carico_non_può_avere_una_fonte_whitespace()
        {
            Assert.That(
                () => new InizioPresaInCarico(DateTime.Now, " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_inizio_presa_in_carico_con_parametri_corretti_puo_essere_creato()
        {
            var evento = new InizioPresaInCarico(DateTime.Now, "Fonte");

            Assert.Pass();
        }

        [Test]
        public void Un_evento_di_arrivo_sul_posto_con_parametri_corretti_puo_essere_creato()
        {
            var evento = new ArrivoSulPosto("M1", DateTime.Now, "Fonte");

            Assert.Pass();
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
        public void Un_evento_di_partenza_in_rientro_con_parametri_corretti_puo_essere_creato()
        {
            var evento = new PartenzaInRientro("M1", DateTime.Now, "Fonte");

            Assert.Pass();
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
        public void Un_evento_di_partenza_rientrata_con_parametri_corretti_puo_essere_creato()
        {
            var evento = new PartenzaRientrata("M1", DateTime.Now, "Fonte");

            Assert.Pass();
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
        public void Un_evento_di_riassegnazione_con_parametri_corretti_puo_essere_creato()
        {
            var evento = new Riassegnazione("R1", "M1", DateTime.Now, "Fonte");

            Assert.Pass();
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
        public void Un_componente_partenza_con_parametri_corretti_puo_essere_creato()
        {
            var evento = new ComponentePartenza("M1", "ticket");

            Assert.Pass();
        }

        [Test]
        public void Un_componente_partenza_senza_parametri_puo_essere_creato()
        {
            var evento = new ComponentePartenza();

            Assert.Pass();
        }

        [Test]
        public void Un_componente_partenza_con_codice_mezzo_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComponentePartenza(" "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_componente_partenza_con_ticket_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComponentePartenza("M1", " "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_evento_di_composizione_partenze_con_parametri_corretti_puo_essere_creato()
        {
            var evento = new ComposizionePartenze(DateTime.Now, "Fonte");

            Assert.Pass();
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
                () => new ComposizionePartenze(new DateTime(), " "),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_evento_di_composizione_partenze_con_fonte_whitespace_non_puo_essere_creato()
        {
            Assert.That(
                () => new ComposizionePartenze(DateTime.Now, " "),
                Throws.ArgumentException);
        }
    }
}
