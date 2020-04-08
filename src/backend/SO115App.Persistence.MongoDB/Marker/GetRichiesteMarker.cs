using AutoMapper;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class GetRichiesteMarker : IGetRichiesteMarker
    {
        private readonly DbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetRichiesteMarker(DbContext dbContext, IMapper mapper, IGetTipologieByCodice getTipologie, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _getTipologie = getTipologie;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<SintesiRichiestaMarker> GetListaRichiesteMarker(SintesiRichiesteAssistenzaMarkerQuery query)
        {
            var listaSintesiRichieste = new List<RichiestaAssistenza>();
            var pinNodi = new List<PinNodo>();
            foreach (var sede in query.CodiciSedi)
            {
                pinNodi.Add(new PinNodo(sede, true));
            }

            query.Filtro = new API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza.FiltroRicercaRichiesteAssistenza
            {
                UnitaOperative = pinNodi.ToHashSet()
            };

            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            foreach (var figlio in listaSediAlberate.GetSottoAlbero(query.Filtro.UnitaOperative))
            {
                listaSintesiRichieste.AddRange(_dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Eq(x => x.CodSOCompetente, figlio.Codice)).ToList());
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
