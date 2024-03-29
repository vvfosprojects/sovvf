﻿using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCountInterventiVicinanze
{
    public class GetCountInterventiVicinanzeQueryHandler : IQueryHandler<GetCountInterventiVicinanzeQuery, GetCountInterventiVicinanzeResult>
    {
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;
        private readonly IGetListaSintesi _getListaSintesi;
        private readonly IGetInterventiInProssimita _getInterventiInProssimita;

        public GetCountInterventiVicinanzeQueryHandler(IGetCompetenzeByCoordinateIntervento getCompetenze,
                                                       IGetListaSintesi getListaSintesi,
                                                       IGetInterventiInProssimita getInterventiInProssimita)
        {
            _getCompetenze = getCompetenze;
            _getListaSintesi = getListaSintesi;
            _getInterventiInProssimita = getInterventiInProssimita;
        }

        public GetCountInterventiVicinanzeResult Handle(GetCountInterventiVicinanzeQuery query)
        {
            var competenze = query.Competenze != null ? query.Competenze : query.CodiciSede;

            var lstPinNodo = competenze.Select(c => new PinNodo(c, true)).ToHashSet();

            if (competenze[0].Contains("."))
            {
                var nodoComando = new PinNodo(competenze[0].Split('.')[0] + ".1000", true);
                lstPinNodo.Add(nodoComando);
            }

            var interventiInProssimita = _getInterventiInProssimita.Get(query.Coordinate, lstPinNodo);

            var resultStessaVia = _getListaSintesi.GetListaSintesiRichieste(new FiltroRicercaRichiesteAssistenza()
            {
                UnitaOperative = lstPinNodo,
                IndirizzoIntervento = new API.Models.Classi.Condivise.Localita(null, query.Indirizzo)
            });

            var resultChiuseStessoIndirizzo = _getListaSintesi.GetListaSintesiRichieste(new FiltroRicercaRichiesteAssistenza()
            {
                UnitaOperative = lstPinNodo,
                Chiuse = new string[] { "Chiamate chiuse", "Interventi chiusi" }
            }).Where(s => s.Localita.Indirizzo.Equals(query.Indirizzo)).ToList();

            return new GetCountInterventiVicinanzeResult()
            {
                Count = interventiInProssimita.Count,
                CountInterventiChiusiStessoIndirizzo = resultChiuseStessoIndirizzo.Count,
                CountStessaVia = resultStessaVia.Where(v => v.Localita.Indirizzo.Equals(query.Indirizzo.Split(',')[0])).ToList().Count()
            };
        }
    }
}
