//-----------------------------------------------------------------------
// <copyright file="ParametriMezzo.cs" company="CNVVF">
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

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    /// <summary>
    ///   Indica il profilo di comportamento di un mezzo in una richiesta, estratto in maniera casuale
    /// </summary>
    internal class ParametriMezzo
    {
        /// <summary>
        ///   Il generatore random
        /// </summary>
        private static readonly Faker FAKER = new Faker();

        /// <summary>
        ///   Indica il numero di secondi dalla data della segnalazione dopo i quali viene eseguita
        ///   la composizione. Solitamente è qualche secondo. Può essere molti secondi nel caso di un
        ///   mezzo la cui necessità viene individuata ad intervento in corso.
        /// </summary>
        public int SecondiComposizione { get; set; }

        /// <summary>
        ///   Indica il tempo di viaggio del mezzo, in secondi.
        /// </summary>
        public int SecondiArrivoSulPosto { get; set; }

        /// <summary>
        ///   Indica il tempo di permanenza sul posto del mezzo, in secondi.
        /// </summary>
        public int SecondiPermanenzaSulPosto { get; set; }

        /// <summary>
        ///   Indica la durata del viaggio di ritorno del mezzo, in secondi.
        /// </summary>
        public int SecondiInRientro { get; set; }

        /// <summary>
        ///   E' il mezzo che, dinamicamente, viene selezionato per evadere la richiesta.
        /// </summary>
        public Mezzo2 MezzoUtilizzato { get; set; }

        /// <summary>
        ///   Genera un'istanza della classe in modo casuale
        /// </summary>
        /// <param name="partenzaImmediata">
        ///   Indica se la partenza deve essere immediata, oppure se è un mezzo inviato in seguito
        ///   alla richiesta
        /// </param>
        /// <param name="secondiPartenzeSuccessive">
        ///   Gaussiana per la generazione del tempo dopo il quale vengono inviate le partenza
        ///   successive alla prima
        /// </param>
        /// <param name="secondiArrivoSulPosto">
        ///   Gaussiana per la generazione del tempo di viaggio verso il luogo del sinistro
        /// </param>
        /// <param name="secondiPermanenzaSulPosto">
        ///   Gaussiana per la generazione del tempo di permanenza del mezzo sul posto
        /// </param>
        /// <param name="secondiInRientro">
        ///   Gaussiana per la generazione del tempo di viaggio dal luogo del sinistro verso la sede
        ///   (sempre che il mezzo non venga rediretto su altra richiesta)
        /// </param>
        /// <returns>L'istanza casuale creata</returns>
        internal static ParametriMezzo GenerateFake(
            bool partenzaImmediata,
            Gaussiana secondiPartenzeSuccessive,
            Gaussiana secondiArrivoSulPosto,
            Gaussiana secondiPermanenzaSulPosto,
            Gaussiana secondiInRientro)
        {
            partenzaImmediata = partenzaImmediata || FAKER.Random.Number(1, 100) < 90;
            var parametri = new ParametriMezzo();

            if (partenzaImmediata)
            {
                parametri.SecondiComposizione = (int)new Gaussiana(60, 20).Genera();
            }
            else
            {
                parametri.SecondiComposizione = (int)secondiPartenzeSuccessive.Genera();
            }

            parametri.SecondiArrivoSulPosto = (int)secondiArrivoSulPosto.Genera();
            parametri.SecondiPermanenzaSulPosto = (int)secondiPermanenzaSulPosto.Genera();
            parametri.SecondiInRientro = (int)secondiInRientro.Genera();

            return parametri;
        }
    }
}