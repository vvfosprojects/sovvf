using GeoCoordinatePortable;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneInterventi
{
    public class GetInterventiInProssimita : IGetInterventiInProssimita
    {
        private readonly DbContext _dbContext;
        private readonly IGetListaSintesi _getListaSintesi;

        public GetInterventiInProssimita(DbContext dbContext, IGetListaSintesi getListaSintesi)
        {
            _dbContext = dbContext;
            _getListaSintesi = getListaSintesi;
        }

        public List<SintesiRichiesta> Get(Coordinate coordinate, HashSet<PinNodo> listaSedi)
        {

            FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza()
            {
                UnitaOperative = listaSedi
            };
            var ListaSintesi = _getListaSintesi.GetListaSintesiRichieste(filtro);

            GeoCoordinate coordinateItervento = new GeoCoordinate(coordinate.Latitudine, coordinate.Longitudine);
            foreach (var sintesi in ListaSintesi)
            {
                GeoCoordinate geoCoordinate = new GeoCoordinate(sintesi.Localita.Coordinate.Latitudine, sintesi.Localita.Coordinate.Longitudine);
                sintesi.Distance = geoCoordinate.GetDistanceTo(coordinateItervento);
            }

            //Prendo solo gli interventi distanti meno di 200 metri dall'intervento che sto creando 
            return ListaSintesi.FindAll(d=> d.Distance <=200);

        }
    }
}
