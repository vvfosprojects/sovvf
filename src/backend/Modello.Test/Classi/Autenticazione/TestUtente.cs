using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Autenticazione;
using NUnit.Framework;

namespace Modello.Test.Classi.Autenticazione
{
    [TestFixture]
    public class TestUtente
    {
        [Test]
        public void Un_utente_con_username_e_correttamente_creato()
        {
            var utente = new Utente("username");

            Assert.That(utente.Username, Is.EqualTo("username"));
            Assert.That(utente.ValidoDa, Is.Null);
            Assert.That(utente.ValidoFinoA, Is.Null);
            Assert.That(utente.Attivo, Is.True);
        }

        [Test]
        public void Un_utente_con_username_whitespace_non_puo_essere_creato()
        {
            Assert.That(() => new Utente(" "),
                Throws.ArgumentException);
        }

        [Test]
        public void Un_utente_con_username_e_data_fine_validita_e_correttamente_creato()
        {
            var fine = DateTime.Now;
            var utente = new Utente("username", fine);

            Assert.That(utente.Username, Is.EqualTo("username"));
            Assert.That(utente.ValidoDa, Is.Null);
            Assert.That(utente.ValidoFinoA, Is.EqualTo(fine));
            Assert.That(utente.Attivo, Is.True);
        }

        [Test]
        public void Un_utente_con_username_e_data_fine_validita_di_default_non_puo_essere_creato()
        {
            Assert.That(() => new Utente("username", new DateTime()),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_utente_con_username_data_inizio_e_fine_validita_e_correttamente_creato()
        {
            var inizio = DateTime.Now;
            var fine = DateTime.Now.AddDays(1);
            var utente = new Utente("username", inizio, fine);

            Assert.That(utente.Username, Is.EqualTo("username"));
            Assert.That(utente.ValidoDa, Is.EqualTo(inizio));
            Assert.That(utente.ValidoFinoA, Is.EqualTo(fine));
            Assert.That(utente.Attivo, Is.True);
        }

        [Test]
        public void Un_utente_con_username_data_inizio_validita_di_default_e_data_fine_validita_non_puo_essere_creato()
        {
            var fine = DateTime.Now.AddDays(1);
            Assert.That(() => new Utente("username", new DateTime(), fine),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }

        [Test]
        public void Un_utente_con_username_data_inizio_validita_e_data_fine_validita_di_default_non_puo_essere_creato()
        {
            var inizio = DateTime.Now;
            Assert.That(() => new Utente("username", inizio, new DateTime()),
                Throws.TypeOf<ArgumentOutOfRangeException>());
        }
    }
}
