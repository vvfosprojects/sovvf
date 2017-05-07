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
using System;
using Bogus;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    internal class ParametriMezzo
    {
        private static Faker faker = new Faker();
        private readonly DateTime dataSegnalazione;

        public ParametriMezzo(DateTime dataSegnalazione)
        {
            this.dataSegnalazione = dataSegnalazione;
        }

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
        public Mezzo MezzoUtilizzato { get; set; }

        internal static ParametriMezzo GenerateFake(
            DateTime dataSegnalazione,
            bool partenzaImmediata,
            Gaussiana secondiPartenzeSuccessive,
            Gaussiana secondiArrivoSulPosto,
            Gaussiana secondiPermanenzaSulPosto,
            Gaussiana secondiInRientro
            )
        {
            partenzaImmediata = partenzaImmediata || faker.Random.Number(1, 100) < 90;
            var parametri = new ParametriMezzo(dataSegnalazione);

            if (partenzaImmediata)
                parametri.SecondiComposizione = (int)new Gaussiana(60, 20).Genera();
            else
                parametri.SecondiComposizione = (int)secondiPartenzeSuccessive.Genera();

            parametri.SecondiArrivoSulPosto = (int)secondiArrivoSulPosto.Genera();
            parametri.SecondiPermanenzaSulPosto = (int)secondiPermanenzaSulPosto.Genera();
            parametri.SecondiInRientro = (int)secondiInRientro.Genera();

            return parametri;
        }
    }
}
