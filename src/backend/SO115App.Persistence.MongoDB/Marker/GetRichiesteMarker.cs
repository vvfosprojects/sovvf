using AutoMapper;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class GetRichiesteMarker : IGetRichiesteMarker
    {
        private readonly DbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IGetTipologieByCodice _getTipologie;

        public GetRichiesteMarker(DbContext dbContext, IMapper mapper, IGetTipologieByCodice getTipologie)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _getTipologie = getTipologie;
        }

        public List<SintesiRichiestaMarker> GetListaRichiesteMarker(SintesiRichiesteAssistenzaMarkerQuery query)
        {
            var listaSintesiRichieste = new List<RichiestaAssistenza>();

            foreach (var sede in query.CodiciSedi)
            {
                listaSintesiRichieste.AddRange(_dbContext.RichiestaAssistenzaCollection.Find(x => x.CodSOCompetente.Equals(sede)).ToList());
            }

            var listaSintesiRichiesteMarker = new List<SintesiRichiestaMarker>();

            foreach (RichiestaAssistenza richiesta in listaSintesiRichieste)
            {
                SintesiRichiestaMarker sintesi = new SintesiRichiestaMarker()
                {
                    Aperta = richiesta.Aperta,
                    Chiusa = richiesta.Chiusa,
                    Codice = richiesta.Codice,
                    CodiceRichiesta = richiesta.CodRichiesta,
                    Descrizione = richiesta.Descrizione,
                    Id = richiesta.Id,
                    InAttesa = richiesta.InAttesa,
                    IstantePrimaAssegnazione = richiesta.IstantePrimaAssegnazione,
                    Localita = richiesta.Localita,
                    Presidiata = richiesta.Presidiata,
                    PrioritaRichiesta = richiesta.PrioritaRichiesta,
                    RilevanteGrave = richiesta.RilevanteGrave,
                    RilevanteStArCu = richiesta.RilevanteStArCu,
                    Sospesa = richiesta.Sospesa,
                    Tipologie = _getTipologie.Get(richiesta.Tipologie)
                };

                listaSintesiRichiesteMarker.Add(sintesi);
            }

            List<SintesiRichiestaMarker> listaSintesiRichiestaMarkers;

            if (listaSintesiRichiesteMarker == null) return null;
            switch (query.FiltroCentroMappa)
            {
                case null:
                    return listaSintesiRichiesteMarker;

                default:
                    listaSintesiRichiestaMarkers = listaSintesiRichiesteMarker.Where(richiesta =>
                            (richiesta.Localita.Coordinate.Latitudine >= query.FiltroCentroMappa.BottomLeft.Latitudine)
                            && (richiesta.Localita.Coordinate.Latitudine <= query.FiltroCentroMappa.TopRight.Latitudine)
                            && (richiesta.Localita.Coordinate.Longitudine >= query.FiltroCentroMappa.BottomLeft.Longitudine)
                            && (richiesta.Localita.Coordinate.Longitudine <= query.FiltroCentroMappa.TopRight.Longitudine))
                        .ToList();
                    break;
            }

            if (query.FiltroCentroMappa.FiltroRichieste == null) return listaSintesiRichiestaMarkers;
            var listaRichiesteFiltrate = new List<SintesiRichiestaMarker>();

            if (!query.FiltroCentroMappa.FiltroRichieste.Stato.Any()) return query.FiltroCentroMappa.FiltroRichieste.Priorita == null ? listaSintesiRichiestaMarkers : listaSintesiRichiestaMarkers.FindAll(x => x.PrioritaRichiesta >= query.FiltroCentroMappa.FiltroRichieste.Priorita); ;

            foreach (var statoRichiesta in query.FiltroCentroMappa.FiltroRichieste.Stato)
            {
                if (statoRichiesta == Costanti.RichiestaAssegnata)
                {
                    listaRichiesteFiltrate.AddRange(
                        listaSintesiRichiesteMarker.FindAll(x => x.Stato == Costanti.RichiestaAssegnata));
                }
                if (statoRichiesta == Costanti.RichiestaPresidiata)
                {
                    listaRichiesteFiltrate.AddRange(
                        listaSintesiRichiesteMarker.FindAll(x => x.Stato == Costanti.RichiestaPresidiata));
                }
                if (statoRichiesta == Costanti.Chiamata)
                {
                    listaRichiesteFiltrate.AddRange(
                        listaSintesiRichiesteMarker.FindAll(x => x.Stato == Costanti.Chiamata));
                }
                if (statoRichiesta == Costanti.RichiestaSospesa)
                {
                    listaRichiesteFiltrate.AddRange(
                        listaSintesiRichiesteMarker.FindAll(x => x.Stato == Costanti.RichiestaSospesa));
                }
            }
            return query.FiltroCentroMappa.FiltroRichieste.Priorita == null ? listaRichiesteFiltrate : listaRichiesteFiltrate.FindAll(x => x.PrioritaRichiesta >= query.FiltroCentroMappa.FiltroRichieste.Priorita);
        }
    }
}
