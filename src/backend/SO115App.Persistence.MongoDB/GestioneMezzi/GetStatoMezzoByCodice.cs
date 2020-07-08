using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneMezzi
{
    public class GetStatoMezzoByCodice : IGetStatoMezzi
    {
        private readonly DbContext _dbContext;

        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetStatoMezzoByCodice(DbContext dbContext, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _dbContext = dbContext;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<StatoOperativoMezzo> Get(string codiceSede, string codiceMezzo = null)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            var pinNodi = new List<PinNodo>();
            var pinNodiNoDistaccamenti = new List<PinNodo>();

            pinNodi.Add(new PinNodo(codiceSede, true));

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                pinNodi.Add(new PinNodo(figlio.Codice, true));
            }

            if (codiceMezzo == null)
            {
                var listaMezziPrenotati = _dbContext.StatoMezzoCollection.Find(Builders<StatoOperativoMezzo>.Filter.In(x => x.CodiceSede, pinNodi.Select(y => y.Codice))).ToList();
                foreach (var mezzo in listaMezziPrenotati)
                {
                    if (mezzo.IstantePrenotazione != null)
                        mezzo.IstantePrenotazione = TimeZoneInfo.ConvertTime(mezzo.IstantePrenotazione.Value, TimeZoneInfo.Local);
                    if (mezzo.IstanteScadenzaSelezione != null)

                        mezzo.IstanteScadenzaSelezione = TimeZoneInfo.ConvertTime(mezzo.IstanteScadenzaSelezione.Value, TimeZoneInfo.Local);
                }
                return listaMezziPrenotati;
            }
            else
            {
                var listaMezziPrenotati = _dbContext.StatoMezzoCollection.Find(Builders<StatoOperativoMezzo>.Filter.Eq(x => x.CodiceMezzo, codiceMezzo)).ToList();

                foreach (var mezzo in listaMezziPrenotati)
                {
                    if (mezzo.IstantePrenotazione != null)
                        mezzo.IstantePrenotazione = TimeZoneInfo.ConvertTime(mezzo.IstantePrenotazione.Value, TimeZoneInfo.Local);
                    if (mezzo.IstanteScadenzaSelezione != null)
                        mezzo.IstanteScadenzaSelezione = TimeZoneInfo.ConvertTime(mezzo.IstanteScadenzaSelezione.Value, TimeZoneInfo.Local);
                }
                return listaMezziPrenotati;
            }
        }
    }
}
