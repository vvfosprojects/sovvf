//-----------------------------------------------------------------------
// <copyright file="GetMezzoPrenotato.cs" company="CNVVF">
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
using Newtonsoft.Json;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SetMezzoPrenotato;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato;

namespace SO115App.FakePersistence.JSon.Composizione
{
    /// <summary>
    ///   La classe scrive sul DB il codice mezzo e la data della prenotazione del mezzo se il mezzo
    ///   è stato prenotato per un intervento
    /// </summary>
    public class SetMezzoPrenotato : ISetMezzoPrenotato
    {
        private readonly IGetMezziPrenotati _getMezziPrenotati;
        private readonly string filepath = CostantiJson.PrenotazioneMezzo;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SetMezzoPrenotato(IGetMezziPrenotati getMezziPrenotati)
        {
            _getMezziPrenotati = getMezziPrenotati;
        }

        /// <summary>
        ///   Il metodo accetta in firma il command scrive sul DB il codice mezzo e l'istante della
        ///   prenotazione del mezzo su un intervento
        /// </summary>
        /// <param name="command">il command in ingresso</param>
        /// <returns>MezzoPrenotato</returns>
        public void Set(SetMezzoPrenotatoCommand command)
        {
            var mezzi = _getMezziPrenotati.Get(command.MezzoPrenotato.CodiceSede);
            var mezzo = mezzi.Find(x => x.CodiceMezzo.Equals(command.MezzoPrenotato.CodiceMezzo));

            if (mezzo != null && command.MezzoPrenotato.SbloccaMezzo)
            {
                mezzi.Remove(mezzo);
            }
            if (!command.MezzoPrenotato.SbloccaMezzo)
            {
                mezzi.Add(command.MezzoPrenotato);
            }

            var jsonNew = JsonConvert.SerializeObject(mezzi);
            System.IO.File.WriteAllText(filepath, jsonNew);
        }
    }
}
