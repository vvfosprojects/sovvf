//-----------------------------------------------------------------------
// <copyright file="AggiungiPartenzaDallaSede.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta
{
    internal class AggiungiPartenzaDallaSede : IAzioneSuRichiesta
    {
        private readonly DateTime istantePrevisto;
        private readonly ParametriMezzo parametriMezzo;
        private readonly RichiestaConParametri richiesta;
        private readonly ParcoMezzi parcoMezzi;
        private bool eseguita = false;

        public DateTime IstantePrevisto
        {
            get
            {
                return this.istantePrevisto;
            }
        }

        public AggiungiPartenzaDallaSede(DateTime istantePrevisto, RichiestaConParametri richiesta, ParametriMezzo parametriMezzo, ParcoMezzi parcoMezzi)
        {
            this.istantePrevisto = istantePrevisto;
            this.richiesta = richiesta;
            this.parametriMezzo = parametriMezzo;
            this.parcoMezzi = parcoMezzi;
        }

        public IEnumerable<IAzioneSuRichiesta> Esegui(DateTime istanteEffettivo)
        {
            var mezzo = this.parametriMezzo.MezzoUtilizzato;

            if (mezzo == null)
                yield break;

            mezzo.ContestoMezzo.Uscita();
            this.richiesta.Richiesta.Eventi.Add(
                new UscitaPartenza()
                {
                    CodiceMezzo = parametriMezzo.MezzoUtilizzato.Codice,
                    Istante = istanteEffettivo
                });

            this.eseguita = true;

            yield return new AggiungiArrivoSulPosto(
                istanteEffettivo.AddSeconds(this.parametriMezzo.SecondiArrivoSulPosto),
                richiesta,
                parametriMezzo,
                parcoMezzi);
        }

        public bool Eseguita()
        {
            return this.eseguita;
        }
    }
}
