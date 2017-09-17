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
using Bogus;
using Modello.Classi.Geo;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Segnalazioni;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    /// <summary>
    ///   Classe deputata alla generazione di richieste pseudo-random. Le richieste generate
    ///   rispettano la fisica realizzabilità, rispetto ad un parco mezzi fornito in ingresso al
    ///   costruttore e dotato di uno specifico numero di mezzi.
    /// </summary>
    internal class GeneratoreRichieste
    {
        /// <summary>
        ///   Il generatore random utilizzato dall'implementazione dei metodi
        /// </summary>
        private static readonly Random RND = new Random();

        /// <summary>
        ///   L'unità operativa con cui vengono etichettate le richieste generate
        /// </summary>
        private readonly string codiceUnitaOperativa;

        /// <summary>
        ///   L'estremo superiore dell'intervallo in cui le richieste possono essere generate
        /// </summary>
        private readonly DateTime dataMax;

        /// <summary>
        ///   L'estremo inferiore dell'intervallo in cui le richieste possono essere generate
        /// </summary>
        private readonly DateTime dataMin;

        /// <summary>
        ///   Numero medio di secondi di durata del viaggio di un mezzo verso il luogo del sinistro
        /// </summary>
        private readonly int mediaSecondiArrivoSulPosto;

        /// <summary>
        ///   Numero medio di secondi di durata della permanenza di un mezzo sul luogo del sinistro
        /// </summary>
        private readonly int mediaSecondiDurataIntervento;

        /// <summary>
        ///   Il numero medio di secondi dopo i quali una partenza ritardata (cioè successiva alle
        ///   prime immediatamente inviate) esce dalla sede
        /// </summary>
        private readonly int mediaSecondiPartenzaDallaSedeSuccessive;

        /// <summary>
        ///   Numero medio di secondi di durata del viaggio di rientro di un mezzo verso la sede (se
        ///   non viene rediretto su altra richiesta)
        /// </summary>
        private readonly int mediaSecondiRientroInSede;

        /// <summary>
        ///   Il numero di mezzi considerati disponibili nel parco mezzi
        /// </summary>
        private readonly int numeroMezzi;

        /// <summary>
        ///   Pesi del numero di mezzi partecipanti ad un intervento (per es. se i pesi sono[0.75,
        ///   0.20, 0.05] significa che al 75% un intervento ha un solo mezzo, al 20% ne ha due, al
        ///   5% ne ha tre).
        /// </summary>
        private readonly float[] pesiNumeroMezziPartecipanti;

        /// <summary>
        ///   Numero medio di richieste generate in ogni giorno
        /// </summary>
        private readonly int richiesteMedieAlGiorno;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="codiceUnitaOperativa">
        ///   L'unità operativa con cui vengono etichettate le richieste generate
        /// </param>
        /// <param name="numeroMezziDisponibili">
        ///   Il numero di mezzi considerati disponibili nel parco mezzi
        /// </param>
        /// <param name="dataMin">
        ///   L'estremo inferiore dell'intervallo in cui le richieste possono essere generate
        /// </param>
        /// <param name="dataMax">
        ///   L'estremo superiore dell'intervallo in cui le richieste possono essere generate
        /// </param>
        /// <param name="richiesteMedieAlGiorno">Numero medio di richieste generate in ogni giorno</param>
        /// <param name="mediaSecondiPartenzaDallaSedeSuccessive">
        ///   Il numero medio di secondi dopo i quali una partenza ritardata (cioè successiva alle
        ///   prime immediatamente inviate) esce dalla sede
        /// </param>
        /// <param name="mediaSecondiArrivoSulPosto">
        ///   Numero medio di secondi di durata del viaggio di un mezzo verso il luogo del sinistro
        /// </param>
        /// <param name="mediaSecondiDurataIntervento">
        ///   Numero medio di secondi di durata della permanenza di un mezzo sul luogo del sinistro
        /// </param>
        /// <param name="mediaSecondiRientroInSede">
        ///   Numero medio di secondi di durata del viaggio di rientro di un mezzo verso la sede (se
        ///   non viene rediretto su altra richiesta)
        /// </param>
        /// <param name="pesiNumeroMezziPartecipanti">
        ///   Pesi del numero di mezzi partecipanti ad un intervento (per es. se i pesi sono[0.75,
        ///   0.20, 0.05] significa che al 75% un intervento ha un solo mezzo, al 20% ne ha due, al
        ///   5% ne ha tre).
        /// </param>
        public GeneratoreRichieste(
            string codiceUnitaOperativa,
            int numeroMezziDisponibili,
            DateTime dataMin,
            DateTime dataMax,
            int richiesteMedieAlGiorno,
            int mediaSecondiPartenzaDallaSedeSuccessive,
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
            this.mediaSecondiPartenzaDallaSedeSuccessive = mediaSecondiPartenzaDallaSedeSuccessive;
            this.mediaSecondiArrivoSulPosto = mediaSecondiArrivoSulPosto;
            this.mediaSecondiDurataIntervento = mediaSecondiDurataIntervento;
            this.mediaSecondiRientroInSede = mediaSecondiRientroInSede;
            this.pesiNumeroMezziPartecipanti = pesiNumeroMezziPartecipanti;
        }

        /// <summary>
        ///   Genera le richieste secondo i parametri specificati nel costruttore della classe.
        /// </summary>
        /// <returns>Le richieste pseudo-random</returns>
        public IEnumerable<RichiestaAssistenza> Genera()
        {
            var fakerGeolocalizzazione = new Faker<Punto>()
                .StrictMode(true)
                .RuleFor(g => g.Latitudine, f => f.Address.Latitude())
                .RuleFor(g => g.Longitudine, f => f.Address.Longitude());

            var fakerRichiesteAssistenza = new Faker<RichiestaAssistenza>("it")
                .StrictMode(true)
                .RuleFor(ra => ra.Id, f => f.UniqueIndex.ToString())
                .RuleFor(ra => ra.Codice, f => f.IndexGlobal.ToString())
                .RuleFor(ra => ra.CodiceUnitaOperativaCompetente, f => this.codiceUnitaOperativa)
                .RuleFor(ra => ra.CodiciUnitaOperativeAllertate, f => new HashSet<string> { this.codiceUnitaOperativa })
                .RuleFor(ra => ra.Geolocalizzazione, f => fakerGeolocalizzazione.Generate())
                .RuleFor(ra => ra.Tipologie, f => this.GeneraTipologie())
                .RuleFor(ra => ra.IstanteChiusura, f => null)
                .RuleFor(ra => ra.Indirizzo, f => f.Address.StreetAddress())
                .RuleFor(ra => ra.ZonaEmergenza, f => string.Empty)
                .RuleFor(ra => ra.Descrizione, f => f.Lorem.Sentence())
                .RuleFor(ra => ra.Richiedente, f => $"{f.Name.FirstName()} {f.Name.LastName()}")
                .RuleFor(ra => ra.NumeroRichiedente, f => f.Phone.PhoneNumber())
                .RuleFor(ra => ra.CodiciUOCompetenza, f => new[] { f.Address.StateAbbr(), f.Address.StateAbbr(), f.Address.StateAbbr() })
                .Ignore(ra => ra.Tags);

            var fakerTelefonata = new Faker<Telefonata>()
                .StrictMode(true)
                .RuleFor(t => t.CodiceSchedaContatto, f => f.Random.Replace("??###"))
                .RuleFor(t => t.CognomeChiamante, f => f.Name.LastName())
                .RuleFor(t => t.Esito, f => "Avente seguito")
                .RuleFor(t => t.Geolocalizzazione, f => fakerGeolocalizzazione.Generate())
                .RuleFor(t => t.Motivazione, f => f.Lorem.Text())
                .RuleFor(t => t.NomeChiamante, f => f.Name.FirstName())
                .RuleFor(t => t.NotePrivate, f => f.Lorem.Sentence(10))
                .RuleFor(t => t.NotePubbliche, f => f.Lorem.Sentence(10))
                .RuleFor(t => t.NumeroTelefono, f => f.Phone.PhoneNumber())
                .RuleFor(t => t.RagioneSociale, f => f.Company.CompanyName());

            var numeroInterventi = (int)(this.dataMax.Subtract(this.dataMin).TotalDays * this.richiesteMedieAlGiorno);
            var richiesteConParametri = Enumerable.Range(1, numeroInterventi)
                 .Select(i => new RichiestaConParametri
                 {
                     Parametri = ParametriRichiesta.GetParametriFake(
                     this.dataMin,
                     this.dataMax,
                     this.pesiNumeroMezziPartecipanti,
                     new Gaussiana(this.mediaSecondiPartenzaDallaSedeSuccessive, this.mediaSecondiPartenzaDallaSedeSuccessive / 3),
                     new Gaussiana(this.mediaSecondiArrivoSulPosto, this.mediaSecondiArrivoSulPosto / 3),
                     new Gaussiana(this.mediaSecondiDurataIntervento, this.mediaSecondiDurataIntervento / 3),
                     new Gaussiana(this.mediaSecondiRientroInSede, this.mediaSecondiRientroInSede / 3)),
                     Richiesta = fakerRichiesteAssistenza.Generate()
                 }).ToList();

            // Aggiunta eventi telefonata in base ai parametri selezionati per ogni richiesta
            foreach (var r in richiesteConParametri)
            {
                var t = fakerTelefonata
                    .CustomInstantiator(f => new Telefonata(r.Richiesta, f.Random.Replace("??###"), r.Parametri.DataSegnalazione, "FonteTelefonata"))
                    .Generate();
            }

            var parcoMezzi = new ParcoMezzi(this.numeroMezzi, this.codiceUnitaOperativa);
            var azioni = richiesteConParametri
                .SelectMany(r => this.GetAzioni(r, parcoMezzi))
                .Where(a => a.IstantePrevisto <= this.dataMax)
                .OrderBy(a => a.IstantePrevisto)
                .ToList();

            var dataSimulata = this.dataMin;
            var simulazioneTerminata = false;
            while (azioni.Any(a => !a.Eseguita()) && !simulazioneTerminata)
            {
                for (int i = 0; i < azioni.Count; i++)
                {
                    simulazioneTerminata = true;
                    if (!azioni[i].Eseguita())
                    {
                        var azione = azioni[i];
                        if (azione.IstantePrevisto > dataSimulata)
                        {
                            dataSimulata = azione.IstantePrevisto;
                        }

                        azioni.AddRange(azione.Esegui(dataSimulata).Where(a => a.IstantePrevisto <= this.dataMax));

                        if (azione.Eseguita())
                        {
                            simulazioneTerminata = false;
                            break;
                        }
                    }
                }

                azioni = azioni
                    .Where(a => !a.Eseguita())
                    .OrderBy(a => a.IstantePrevisto)
                    .ToList();
            }

            return richiesteConParametri.Select(r => r.Richiesta);
        }

        /// <summary>
        ///   Restituisce una lista di tipologie. Con probabilità 75% la lista contiene una sola
        ///   tipologia. Con probabilità 20% la lista contiene due tipologie. Con probabilità 5% la
        ///   lista contiene tre tipologie.
        /// </summary>
        /// <returns>La lista delle tipologie</returns>
        private List<TipologiaRichiesta> GeneraTipologie()
        {
            var tipologie =
                new TipologiaRichiesta[]
                {
                    new TipologiaRichiesta("Soccorso a persona", "Soccorso a persona"),
                    new TipologiaRichiesta("Incendio generico", "Incendio generico"),
                    new TipologiaRichiesta("Incendio boschivo", "Incendio boschivo"),
                    new TipologiaRichiesta("Danni d'acqua", "Danni d'acqua"),
                    new TipologiaRichiesta("Alluvione", "Alluvione"),
                    new TipologiaRichiesta("Esplosione", "Esplosione"),
                    new TipologiaRichiesta("Incidente stradale", "Incidente stradale"),
                    new TipologiaRichiesta("Apertura porta", "Apertura porta"),
                };

            var f = new Faker();
            var numeroTipologie = f.Random.WeightedRandom<int>(new int[] { 1, 2, 3 }, new float[] { .7F, .2F, .1F });
            var range = Enumerable.Range(1, numeroTipologie).Select(x => f.PickRandom(tipologie));
            var set = new HashSet<TipologiaRichiesta>(range); // elimina i duplicati

            return set.ToList();
        }

        /// <summary>
        ///   Restituisce l'elenco delle azioni iniziali da aggiungere ad una richiesta. L'azione si
        ///   limita alla composizione partenza, poiché ogni azione, all'atto della sua esecuzione,
        ///   restituisce l'azione successiva da eseguire.
        /// </summary>
        /// <param name="richiesta">La richiesta alla quale aggiungere l'azione</param>
        /// <param name="parcoMezzi">Il parco mezzi sul quale insistono le richieste</param>
        /// <returns>L'elenco delle azioni da aggiungere</returns>
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
    }
}
