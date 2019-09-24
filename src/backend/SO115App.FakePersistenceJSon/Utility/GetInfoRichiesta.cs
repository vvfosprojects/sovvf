using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.InfoRichiesta;

namespace SO115App.FakePersistence.JSon.Utility
{
    public class GetInfoRichiesta : IGetInfoRichiesta
    {
        private readonly IGetRichiestaById _getRichiestaById;

        public GetInfoRichiesta(IGetRichiestaById getRichiestaById)
        {
            _getRichiestaById = getRichiestaById;
        }

        public InfoRichiesta GetInfoRichiestaFromIdRichiestaMezzo(string idRichiesta)
        {
            if (idRichiesta == null) return null;

            var richiesta = _getRichiestaById.Get(idRichiesta);

            return new InfoRichiesta()
            {
                CodiceRichiesta = richiesta.CodiceRichiesta,
                Indirizzo = richiesta.Localita.Indirizzo
            };
        }
    }
}
