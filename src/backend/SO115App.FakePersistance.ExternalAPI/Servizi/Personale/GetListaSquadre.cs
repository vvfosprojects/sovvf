//-----------------------------------------------------------------------
// <copyright file="GetListaSquadre.cs" company="CNVVF">
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
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Fake.Classi.DTOFake;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    public class GetListaSquadre : IGetListaSquadre
    {
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetPersonaleByCF _getPersonaleByCF;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetListaSquadre(
             IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC,
             IGetPersonaleByCF GetPersonaleByCF,
             IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getPersonaleByCF = GetPersonaleByCF;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public async Task<IEnumerable<Squadra>> Get(List<string> sedi)
        {
            #region LEGGO DA JSON FAKE

            var filepath = Costanti.ListaSquadre;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaSquadreJson = JsonConvert.DeserializeObject<IEnumerable<SquadraFake>>(json);

            #endregion LEGGO DA JSON FAKE

            var lstcodicifiscali = listaSquadreJson
                .SelectMany(c => c.ComponentiSquadra)
                .Select(c => c.CodiceFiscale)
                .Distinct()
                .ToArray();

            var lstVVF = _getPersonaleByCF.Get(lstcodicifiscali, sedi.ToArray()).Result;


            var pinNodi = sedi.Select(s => new PinNodo(s, true));
            var ListaCodiciSedi = new List<string>();
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                var codice = figlio.Codice;
                string codiceE = "";
                codiceE = ListaCodiciSedi.Find(x => x.Equals(codice));
                if (string.IsNullOrEmpty(codiceE))
                {
                    ListaCodiciSedi.Add(codice);
                }
            }

            var result = new ConcurrentQueue<Squadra>();

            Parallel.ForEach(ListaCodiciSedi, async CodSede =>
            {
                var ListaSquadreSede = listaSquadreJson.Where(x => x.Sede.Equals(CodSede)).Distinct();

                foreach (var squadraFake in ListaSquadreSede)
                    result.Enqueue(MapSqaudra(squadraFake, lstVVF));
            });

            return result;
        }

        private Squadra MapSqaudra(SquadraFake squadraFake, IEnumerable<PersonaleVVF> lstVVF)
        {
            var distaccamento = _getDistaccamentoByCodiceSedeUC.Get(squadraFake.Sede);

            var ListaCodiciFiscaliComponentiSquadra = new List<string>();
            var ComponentiSquadra = new List<Componente>();

            foreach (var componenteFake in squadraFake.ComponentiSquadra)
            {
                var pVVf = lstVVF.FirstOrDefault(p => p.codiceFiscale.Equals(componenteFake.CodiceFiscale));

                if (pVVf != null)
                {
                    var componente = new Componente(componenteFake.DescrizioneQualificaLunga,
                    pVVf.nome, componenteFake.Tooltip, componenteFake.CapoPartenza, componenteFake.Autista, componenteFake.Rimpiazzo)
                    {
                        CodiceFiscale = pVVf.codiceFiscale,
                        OrarioFine = componenteFake.OrarioFine,
                        OrarioInizio = componenteFake.OrarioInizio,
                        Telefono = componenteFake.Telefono,
                        TecnicoGuardia1 = componenteFake.TecnicoGuardia1,
                        TecnicoGuardia2 = componenteFake.TecnicoGuardia2,
                        FunGuardia = componenteFake.FunGuardia,
                        CapoTurno = componenteFake.CapoTurno
                    };
                    ComponentiSquadra.Add(componente);
                    ListaCodiciFiscaliComponentiSquadra.Add(pVVf.codiceFiscale);
                }
            }

            Squadra.StatoSquadra Stato;

            switch (squadraFake.Stato)
            {
                case "L": Stato = Squadra.StatoSquadra.InSede; break;
                case "A": Stato = Squadra.StatoSquadra.SulPosto; break;
                case "R": Stato = Squadra.StatoSquadra.InRientro; break;
                default: Stato = Squadra.StatoSquadra.InSede; break;
            }

            var sedeDistaccamento = new Sede(squadraFake.Sede, distaccamento.Result.DescDistaccamento, distaccamento.Result.Indirizzo, distaccamento.Result.Coordinate, "", "", "", "", "");

            var s = new Squadra(squadraFake.NomeSquadra, Stato, ComponentiSquadra, sedeDistaccamento, squadraFake.Turno);

            s.Id = squadraFake.CodiceSquadra;
            s.Codice = squadraFake.CodiceSquadra;
            s.ListaCodiciFiscaliComponentiSquadra = ListaCodiciFiscaliComponentiSquadra;

            return s;
        }
    }
}
