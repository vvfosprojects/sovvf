using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class SituazioneMezziRichiesta
    {
        //[Test]
        //public void UnaRichiestaSenzaEventiRestituisceUnaSituazioneVuota()
        //{
        //    var richiesta = new RichiestaAssistenza();

        // var situazioneMezzi = richiesta.SituazioneMezzi;

        //    CollectionAssert.IsEmpty(situazioneMezzi);
        //}

        //[Test]
        //public void RichiestaConComposizioneContenenteUnSoloMezzoAssegnato()
        //{
        //    var richiesta = new RichiestaAssistenza() { Codice = "R1" };
        //    new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
        //    {
        //        Componenti = new HashSet<ComponentePartenza>(new[] { new ComponentePartenza("XXX", "M1") })
        //    };
        //    var situazioneMezzi = richiesta.SituazioneMezzi;

        //    Assert.Multiple(() =>
        //    {
        //        Assert.That(situazioneMezzi, Has.Count.EqualTo(1));
        //        Assert.That(situazioneMezzi.Single.Codice, Is.EqualTo("M1"));
        //        Assert.That(situazioneMezzi.Single.Stato, Is.InstanceOf<Assegnato>());
        //        Assert.That(situazioneMezzi.Single.CodiceRichiestaAssistenza, Is.EqualTo("R1"));
        //    });
        //}
    }
}
