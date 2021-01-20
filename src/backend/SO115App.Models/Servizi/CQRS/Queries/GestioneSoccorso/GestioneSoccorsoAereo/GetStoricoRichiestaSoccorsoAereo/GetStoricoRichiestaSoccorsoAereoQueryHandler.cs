using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetStoricoRichiestaSoccorsoAereo
{
    public class GetStoricoRichiestaSoccorsoAereoQueryHandler : IQueryHandler<GetStoricoRichiestaSoccorsoAereoQuery, GetStoricoRichiestaSoccorsoAereoResult>
    {
        private readonly IGetHistoryRichiestaSoccorsoAereo _getHistoryRichiestaSoccorsoAereo;

        public GetStoricoRichiestaSoccorsoAereoQueryHandler(IGetHistoryRichiestaSoccorsoAereo getHistoryRichiestaSoccorsoAereo)
        {
            _getHistoryRichiestaSoccorsoAereo = getHistoryRichiestaSoccorsoAereo;
        }

        public GetStoricoRichiestaSoccorsoAereoResult Handle(GetStoricoRichiestaSoccorsoAereoQuery query)
        {
            string value = query.RequestKey;
            string sede = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[0];
            string seq = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[2].TrimStart('0');
            string data = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[1];

            seq = seq == "" ? "0" : seq;

            var requestKey = "CMD." + sede + '.' + seq + '.' + data;

            var result = _getHistoryRichiestaSoccorsoAereo.Get(requestKey);

            return new GetStoricoRichiestaSoccorsoAereoResult()
            {
                Data = result
            };
        }
    }
}
