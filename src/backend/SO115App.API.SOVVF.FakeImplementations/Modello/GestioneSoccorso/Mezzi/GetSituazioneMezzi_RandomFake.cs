//-----------------------------------------------------------------------
// <copyright file="GetSituazioneMezzi_RandomFake.cs" company="CNVVF">
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
using Bogus;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Soccorso.Mezzi.SituazioneMezzo;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi
{
    /// <summary>
    ///   Servizio fake che restituisce la situazione dei mezzi in servizio
    /// </summary>
    public class GetSituazioneMezzi_RandomFake : IGetSituazioneMezzi
    {
        /// <summary>
        ///   Restituisce una situazione dei mezzi fake
        /// </summary>
        /// <param name="codiciUnitaOperative">Not used</param>
        /// <returns>La situazione dei mezzi</returns>
        public IEnumerable<SituazioneMezzo> Get(ISet<PinNodo> codiciUnitaOperative)
        {
            var statiSenzaSquadra = new[] { "InSede", };
            var statiConSquadra = new[] { "InViaggio", "SulPosto", "InRientro" };
            var generiMezzo = new[] { "APS", "ABP", "AS", "AV" };
            var unitaOperativa = new[] { "Centrale", "Tuscolano I", "Tuscolano II", "EUR", "Fiumicino", "Ostia", "Ostiense", "Nomentano" };
            var fakerPersonaSulMezzo = new Faker<PersonaSulMezzo>("it")
                .RuleSet(
                    "CapoPartenza",
                    (set) =>
                    {
                        set.RuleFor(p => p.CapoPartenza, f => true);
                        set.RuleFor(p => p.Autista, f => false);
                    })
                .RuleSet(
                    "Autista",
                    (set) =>
                    {
                        set.RuleFor(p => p.CapoPartenza, f => false);
                        set.RuleFor(p => p.Autista, f => true);
                    })
                .StrictMode(true)
                .RuleFor(p => p.CodiceFiscale, f => f.Random.Replace("??????##?##?###?"))
                .RuleFor(p => p.Descrizione, f => f.Parse("{{name.firstName}} {{name.lastName}}"))
                .RuleFor(p => p.CapoPartenza, f => false)
                .RuleFor(p => p.Autista, f => false)
                .RuleFor(p => p.Rimpiazzo, f => f.Random.Number(10) < 1)
                .RuleFor(p => p.Tooltip, f => f.Random.Replace("??????##?##?###?"));
            var fakerSituazioneMezzo = new Faker<SituazioneMezzo>("it")
                .RuleSet(
                    "statiSenzaSquadra",
                    (set) =>
                    {
                        set.RuleFor(sm => sm.CodiceStato, f => f.PickRandom(statiSenzaSquadra));
                        set.RuleFor(sm => sm.CodiceRichiestaAssistenza, f => string.Empty);
                        set.RuleFor(sm => sm.PersoneSulMezzo, f => new PersonaSulMezzo[0]);
                    })
                .RuleSet(
                    "statiConSquadra",
                    (set) =>
                    {
                        set.RuleFor(sm => sm.CodiceStato, f => f.PickRandom(statiConSquadra));
                        set.RuleFor(sm => sm.CodiceRichiestaAssistenza, f => f.Random.Replace("###.###.###"));
                        set.RuleFor(
                            sm => sm.PersoneSulMezzo,
                            f => fakerPersonaSulMezzo.Generate(1, "default,CapoPartenza")
                            .Concat(fakerPersonaSulMezzo.Generate(1, "default,Autista"))
                            .Concat(fakerPersonaSulMezzo.Generate(3, "default"))
                            .ToArray());
                    })
                .RuleSet(
                    "nonDisponibile",
                    (set) =>
                    {
                        set.RuleFor(sm => sm.Disponibile, f => false);
                    })
                .StrictMode(true)
                .RuleFor(sm => sm.Codice, f => f.Random.Replace("???#####"))
                .RuleFor(sm => sm.CodiceRichiestaAssistenza, f => f.Random.Replace("###.###.###"))
                .RuleFor(sm => sm.CodiceStato, f => f.PickRandom(statiConSquadra))
                .RuleFor(sm => sm.Descrizione, f => f.PickRandom(generiMezzo) + "/" + f.Random.ReplaceNumbers("###"))
                .RuleFor(sm => sm.DescrizioneSquadra, f => f.Random.Replace("A##"))
                .RuleFor(sm => sm.DescrizioneUnitaOperativa, f => f.PickRandom(unitaOperativa))
                .RuleFor(sm => sm.Disponibile, f => true)
                .RuleFor(sm => sm.IstanteAggiornamentoStato, f => f.Date.Recent())
                .RuleFor(sm => sm.PersoneSulMezzo, f => new PersonaSulMezzo[0])
                .RuleFor(sm => sm.Targa, f => f.Random.ReplaceNumbers("#####"))
                .RuleFor(sm => sm.TooltipSquadra, f => f.Random.Replace("A##"));

            return fakerSituazioneMezzo.Generate(15, "default,statiConSquadra")
                .Concat(fakerSituazioneMezzo.Generate(65, "default,statiSenzaSquadra"))
                .Concat(fakerSituazioneMezzo.Generate(20, "default,statiSenzaSquadra,nonDisponibile"));
        }
    }
}