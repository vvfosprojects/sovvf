using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.DettaglioRichiesta
{
    public class DettaglioRichiestaQueryHandler : IQueryHandler<DettaglioRichiestaQuery, DettaglioRichiestaResult>
    {
        private readonly IGetRichiesta _getRichiesta;

        public DettaglioRichiestaQueryHandler(IGetRichiesta getRichiesta)
        {
            _getRichiesta = getRichiesta;
        }

        public DettaglioRichiestaResult Handle(DettaglioRichiestaQuery query)
        {
            string result;

            bool chiamata = query.Codice.Length == 17;

            if (chiamata)
            {
                result = _getRichiesta.GetDettaglioByCodiceChiamata(query.Codice);
            }
            else
            {
                result = _getRichiesta.GetDettaglioByCodiceIntervento(query.Codice);
            }

            return new DettaglioRichiestaResult()
            {
                Data = result
            };
        }
    }
}
