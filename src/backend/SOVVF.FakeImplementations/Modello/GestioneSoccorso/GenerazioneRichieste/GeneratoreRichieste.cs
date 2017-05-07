//-----------------------------------------------------------------------
// <copyright file="GeneratoreRichieste.cs" company="CNVVF">
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
using Bogus;
using Modello.Classi.Geo;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Partenze;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    internal class GeneratoreRichieste
    {
        private static readonly Random rnd = new Random();
        private readonly string codiceUnitaOperativa;
        private readonly int numeroMezzi;
        private readonly DateTime dataMin;
        private readonly DateTime dataMax;
        private readonly int richiesteMedieAlGiorno;
        private readonly int mediaSecondiPartenzaDallaSede;
        private readonly int mediaSecondiArrivoSulPosto;
        private readonly int mediaSecondiDurataIntervento;
        private readonly int mediaSecondiRientroInSede;
        private readonly float[] pesiNumeroMezziPartecipanti;

        public GeneratoreRichieste(
            string codiceUnitaOperativa,
            int numeroMezziDisponibili,
            DateTime dataMin,
            DateTime dataMax,
            int richiesteMedieAlGiorno,
            int mediaSecondiPartenzaDallaSede,
            int mediaSecondiArrivoSulPosto,
            int mediaSecondiDurataIntervento,
            int mediaSecondiRientroInSede,
            float[] pesiNumeroMezziPartecipanti)
        {
            this.codiceUnitaOperativa = codiceUnitaOperativa;
            this.numeroMezzi = numeroMezziDisponibili;
            this.dataMin = dataMin;
            this.dataMax = dataMax;
            this.richiesteMedieAlGiorno = richiesteMedieAlGiorno;
            this.mediaSecondiPartenzaDallaSede = mediaSecondiPartenzaDallaSede;
            this.mediaSecondiArrivoSulPosto = mediaSecondiArrivoSulPosto;
            this.mediaSecondiDurataIntervento = mediaSecondiDurataIntervento;
            this.mediaSecondiRientroInSede = mediaSecondiRientroInSede;
            this.pesiNumeroMezziPartecipanti = pesiNumeroMezziPartecipanti;
        }

        public IEnumerable<RichiestaAssistenza> Genera()
        {
            var fakerGeolocalizzazione = new Faker<Punto>()
                .StrictMode(true)
                .RuleFor(g => g.Latitudine, f => f.Address.Latitude())
                .RuleFor(g => g.Longitudine, f => f.Address.Longitude());

            var fakerRichiesteAssistenza = new Faker<RichiestaAssistenza>()
                .StrictMode(true)
                .RuleFor(ra => ra.Codice, f => (f.IndexGlobal).ToString())
                .RuleFor(ra => ra.CodiceUnitaOperativaCompetente, f => this.codiceUnitaOperativa)
                .RuleFor(ra => ra.CodiciUnitaOperativeAllertate, f => new HashSet<string> { this.codiceUnitaOperativa })
                .RuleFor(ra => ra.Geolocalizzazione, f => fakerGeolocalizzazione.Generate())
                .RuleFor(ra => ra.Tipologie, f => GeneraTipologie())
                .Ignore(ra => ra.Eventi);

            var numeroInterventi = (int)(this.dataMax.Subtract(this.dataMin).TotalDays * this.richiesteMedieAlGiorno);
            var richiesteConParametri = Enumerable.Range(1, numeroInterventi)
                 .Select(i => new RichiestaConParametri
                 {
                     Parametri = ParametriRichiesta.GetParametriFake(
                     this.dataMin,
                     this.dataMax,
                     this.pesiNumeroMezziPartecipanti,
                     new Gaussiana(mediaSecondiPartenzaDallaSede, mediaSecondiPartenzaDallaSede / 5),
                     new Gaussiana(mediaSecondiArrivoSulPosto, mediaSecondiArrivoSulPosto / 5),
                     new Gaussiana(mediaSecondiDurataIntervento, mediaSecondiDurataIntervento / 5),
                     new Gaussiana(mediaSecondiRientroInSede, mediaSecondiRientroInSede / 5)),
                     Richiesta = fakerRichiesteAssistenza.Generate()
                 }).ToList();

            var parcoMezzi = new ParcoMezzi(numeroMezzi, codiceUnitaOperativa);
            var azioni = richiesteConParametri
                .SelectMany(r => GetAzioni(r, parcoMezzi))
                .OrderBy(a => a.IstantePrevisto)
                .ToList();

            var dataSimulata = dataMin;
            while (azioni.Any(a => !a.Eseguita()) && azioni.Any(a => a.IstantePrevisto <= dataMax))
            {
                for (int i = 0; i < azioni.Count; i++)
                {
                    if (!azioni[i].Eseguita() && azioni[i].IstantePrevisto <= dataMax)
                    {
                        var azione = azioni[i];
                        if (azione.IstantePrevisto > dataSimulata)
                            dataSimulata = azione.IstantePrevisto;

                        azioni.AddRange(azione.Esegui(dataSimulata));

                        if (azione.Eseguita())
                            break;
                    }
                }

                azioni = azioni
                    .Where(a => !a.Eseguita())
                    .OrderBy(a => a.IstantePrevisto)
                    .ToList();
            }

            return richiesteConParametri.Select(r => r.Richiesta);
        }

        private IEnumerable<IAzioneSuRichiesta> GetAzioni(RichiestaConParametri richiesta, ParcoMezzi parcoMezzi)
        {
            foreach (var parametriMezzo in richiesta.Parametri.ParametriMezzi)
            {
                yield return new AggiungiComposizionePartenza(
                    richiesta.Parametri.DataSegnalazione.AddSeconds(parametriMezzo.SecondiComposizione),
                    richiesta,
                    parametriMezzo,
                    parcoMezzi);
            }
        }

        /// <summary>
        ///   Restituisce una lista di tipologie. Con probabilità 75% la lista contiene una sola
        ///   tipologia. Con probabilità 20% la lista contiene due tipologie. Con probabilità 5% la
        ///   lista contiene tre tipologie.
        /// </summary>
        /// <returns>La lista delle tipologie</returns>
        private List<string> GeneraTipologie()
        {
            var tipologie = new string[] {
                "Soccorso a persona",
                "Incendio generico",
                "Incendio boschivo",
                "Danni d'acqua",
                "Alluvione",
                "Esplosione",
                "Incidente stradale",
                "Apertura porta"
            };

            var f = new Faker();
            var numeroTipologie = f.Random.WeightedRandom<int>(new int[] { 1, 2, 3 }, new float[] { .7F, .2F, .1F });
            var range = Enumerable.Range(1, numeroTipologie).Select(x => f.PickRandom(tipologie));
            var set = new HashSet<string>(range); // elimina i duplicati

            return set.ToList();
        }
    }
}
