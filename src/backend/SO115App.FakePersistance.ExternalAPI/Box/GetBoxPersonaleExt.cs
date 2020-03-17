//-----------------------------------------------------------------------
// <copyright file="GetPersonale.cs" company="CNVVF">
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

using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.Box
{
    public class GetBoxPersonaleExt : IGetBoxPersonale
    {
        private readonly IGetSquadreBySede _getSquadreBySede;

        public GetBoxPersonaleExt(IGetSquadreBySede getSquadreBySede)
        {
            _getSquadreBySede = getSquadreBySede;
        }

        public BoxPersonale Get(string[] codiciSede)
        {
            var personale = new BoxPersonale();
            var numeroComponenti = 0;
            var listaFunzionari = new List<Componente>();
            var ListaSquadreNelTurno = new List<Turno>();

            foreach(var sede in codiciSede) 
            {
                ListaSquadreNelTurno.AddRange(_getSquadreBySede.SquadreBySede(sede));
            }

            foreach (var turno in ListaSquadreNelTurno)
            {
                personale.SquadreAssegnate +=
                turno.ListaSquadre.Count(x => x.Stato == Squadra.StatoSquadra.InViaggio) +
                turno.ListaSquadre.Count(x => x.Stato == Squadra.StatoSquadra.SulPosto) +
                turno.ListaSquadre.Count(x => x.Stato == Squadra.StatoSquadra.InRientro);
                personale.SquadreServizio += turno.ListaSquadre.Count;

                foreach (var squadra in turno.ListaSquadre)
                {
                    numeroComponenti += squadra.Componenti.Count;
                    foreach (var componente in squadra.Componenti)
                    {
                        if (componente.TecnicoGuardia1 || componente.TecnicoGuardia2 || componente.CapoTurno ||
                            componente.FunGuardia)
                        {
                            listaFunzionari.Add(componente);
                        }
                    }
                }
            }

            personale.PersonaleTotale = numeroComponenti;
            personale.Funzionari = listaFunzionari;

            return personale;
        }
    }
}
