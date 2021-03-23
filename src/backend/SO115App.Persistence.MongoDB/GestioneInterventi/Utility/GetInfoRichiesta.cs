using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.InfoRichiesta;

namespace SO115App.Persistence.MongoDB.GestioneInterventi.Utility
{
    internal class GetInfoRichiesta : IGetInfoRichiesta
    {
        private readonly IGetRichiesta _getRichiestaById;

        public GetInfoRichiesta(IGetRichiesta getRichiestaById)
        {
            _getRichiestaById = getRichiestaById;
        }

        public InfoRichiesta GetInfoRichiestaFromIdRichiestaMezzo(string idRichiesta)
        {
            if (idRichiesta == null) return null;

            var richiesta = _getRichiestaById.GetById(idRichiesta);

            return new InfoRichiesta()
            {
                CodiceRichiesta = richiesta.Codice,
                Indirizzo = richiesta.Localita.Indirizzo
            };
        }

        public InfoRichiesta GetInfoRichiestaFromCodiceRichiestaMezzo(string CodRichiesta)
        {
            if (CodRichiesta == null) return null;

            var richiesta = _getRichiestaById.GetByCodice(CodRichiesta);

            if (richiesta == null) richiesta = _getRichiestaById.GetById(CodRichiesta);

            return new InfoRichiesta()
            {
                CodiceRichiesta = richiesta.Codice,
                Indirizzo = richiesta.Localita.Indirizzo,
                SchedaContatto = richiesta.CodNue
            };
        }
    }
}
