using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso.Squadre;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    /// <summary>
    ///   Unit test relativa alla classe <see cref="Squadra" />
    /// </summary>
    [TestFixture]
    public class TestSquadra
    {
        [Test]
        [Repeat(100)]
        public void UnaSquadraAppenaCreataHaUnTicketImpostato()
        {
            var s = new SquadraSoccorsoOrdinario();

            Assert.That(s.Ticket, Is.Not.Empty);
        }

        [Test]
        public void UnaSquadraAppenaCreataHaUnaComposizionePartenzaNonNull()
        {
            var s = new SquadraSoccorsoOrdinario();

            Assert.That(s.ComposizionePrevista, Is.Not.Null);
        }

        [Test]
        public void UnaSquadraAppenaCreataHaUnaComposizioneDisponibileNonNull()
        {
            var s = new SquadraSoccorsoOrdinario();

            Assert.That(s.ComposizioneDisponibile, Is.Not.Null);
        }
    }
}
