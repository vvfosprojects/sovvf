//-----------------------------------------------------------------------
// <copyright file="SituazioneMezziRichiesta.cs" company="CNVVF">
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
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using NUnit.Framework;

namespace Modello.IntegrationTest.Classi.Soccorso
{
    [TestFixture]
    public class SituazioneMezziRichiesta
    {
        ////[Test]
        ////public void UnaRichiestaSenzaEventiRestituisceUnaSituazioneVuota()
        ////{
        ////    var richiesta = new RichiestaAssistenza();

        //// var situazioneMezzi = richiesta.SituazioneMezzi;

        ////    CollectionAssert.IsEmpty(situazioneMezzi);
        ////}

        ////[Test]
        ////public void RichiestaConComposizioneContenenteUnSoloMezzoAssegnato()
        ////{
        ////    var richiesta = new RichiestaAssistenza() { Codice = "R1" };
        ////    new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
        ////    {
        ////        Componenti = new HashSet<ComponentePartenza>(new[] { new ComponentePartenza("XXX", "M1") })
        ////    };
        ////    var situazioneMezzi = richiesta.SituazioneMezzi;

        ////    Assert.Multiple(() =>
        ////    {
        ////        Assert.That(situazioneMezzi, Has.Count.EqualTo(1));
        ////        Assert.That(situazioneMezzi.Single.Codice, Is.EqualTo("M1"));
        ////        Assert.That(situazioneMezzi.Single.Stato, Is.InstanceOf<Assegnato>());
        ////        Assert.That(situazioneMezzi.Single.CodiceRichiestaAssistenza, Is.EqualTo("R1"));
        ////    });
        ////}
    }
}
