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
using System.Collections.Generic;
using System.Linq;
using Bogus;
using Modello.Classi.Organigramma;
using Modello.Classi.Soccorso.Mezzi.SituazioneMezzo;
using Modello.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi
{
    /// <summary>
    ///   Servizio fake che restituisce la situazione dei mezzi in servizio
    /// </summary>
    internal class GetSituazioneMezzi_RandomFake : IGetSituazioneMezzi
    {
        /// <summary>
        ///   Restituisce una situazione dei mezzi fake
        /// </summary>
        /// <param name="codiciUnitaOperative">Not used</param>
        /// <returns>La situazione dei mezzi</returns>
        public IEnumerable<SituazioneMezzo> Get(ISet<InfoUnitaOperativa> codiciUnitaOperative)
        {
            var stati = new[] { "InSede", "InViaggio", "SulPosto", "InRientro" };
            var generiMezzo = new[] { "APS", "ABP", "AS", "AV" };
            var unitaOperativa = new[] { "Centrale", "Tuscolano I", "Tuscolano II", "EUR", "Fiumicino", "Ostia", "Ostiense", "Nomentano" };
            var fakerPersonaSulMezzo = new Faker<PersonaSulMezzo>()
                .StrictMode(true)
                .RuleFor(p => p.Autista, f => f.Random.Bool())
                .RuleFor(p => p.CapoPartenza, f => f.Random.Bool())
                .RuleFor(p => p.CodiceFiscale, f => f.Random.Replace("??????##?##?###?"))
                .RuleFor(p => p.Descrizione, f => f.Parse("{{name.firstName}} {{name.lastName}}"))
                .RuleFor(p => p.Rimpiazzo, f => f.Random.Bool())
                .RuleFor(p => p.Tooltip, f => f.Random.Replace("??????##?##?###?"));
            var fakerSituazioneMezzo = new Faker<SituazioneMezzo>("it")
                .StrictMode(true)
                .RuleFor(sm => sm.Codice, f => f.Random.Replace("???#####"))
                .RuleFor(sm => sm.CodiceRichiestaAssistenza, f => f.Random.Replace("###.###.###"))
                .RuleFor(sm => sm.CodiceStato, f => f.PickRandom(stati))
                .RuleFor(sm => sm.Descrizione, f => f.PickRandom(generiMezzo) + "/" + f.Random.ReplaceNumbers("###"))
                .RuleFor(sm => sm.DescrizioneSquadra, f => f.Random.Replace("A##"))
                .RuleFor(sm => sm.DescrizioneUnitaOperativa, f => f.PickRandom(unitaOperativa))
                .RuleFor(sm => sm.Disponibile, f => f.Random.Bool())
                .RuleFor(sm => sm.IstanteAggiornamentoStato, f => f.Date.Recent())
                .RuleFor(sm => sm.PersoneSulMezzo, f => fakerPersonaSulMezzo.Generate(5).ToArray())
                .RuleFor(sm => sm.Targa, f => f.Random.ReplaceNumbers("#####"))
                .RuleFor(sm => sm.TooltipSquadra, f => f.Random.Replace("A##"));

            return fakerSituazioneMezzo.Generate(100);
        }
    }
}
