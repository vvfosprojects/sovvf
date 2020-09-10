using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.InfoRichiesta;

namespace SO115App.Persistence.MongoDB.GestioneInterventi.Utility
{
    class GetInfoRichiesta : IGetInfoRichiesta
    {
        private readonly IGetRichiestaById _getRichiestaById;

        public GetInfoRichiesta(IGetRichiestaById getRichiestaById)
        {
            _getRichiestaById = getRichiestaById;
        }

        public InfoRichiesta GetInfoRichiestaFromIdRichiestaMezzo(string idRichiesta)
        {
            if (idRichiesta == null) return null;

            var richiesta = _getRichiestaById.GetById(idRichiesta);

            return new InfoRichiesta()
            {
                CodiceRichiesta = richiesta.Id,
                Indirizzo = richiesta.Localita.Indirizzo
            };
        }
    }
}
