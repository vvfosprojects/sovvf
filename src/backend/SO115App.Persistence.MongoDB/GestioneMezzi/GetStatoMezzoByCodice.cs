using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneMezzi
{
    public class GetStatoMezzoByCodice : IGetStatoMezzi
    {
        private readonly DbContext _dbContext;

        public GetStatoMezzoByCodice(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<StatoOperativoMezzo> Get(string codiceSede, string codiceMezzo = null)
        {
            if (codiceMezzo == null)
            {
                var listaMezziPrenotati = _dbContext.StatoMezzoCollection.Find(Builders<StatoOperativoMezzo>.Filter.Eq(x => x.CodiceSede, codiceSede)).ToList();
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
                var listaMezziPrenotati = _dbContext.StatoMezzoCollection.Find(Builders<StatoOperativoMezzo>.Filter.And(Builders<StatoOperativoMezzo>.Filter.Eq(x => x.CodiceSede, codiceSede), Builders<StatoOperativoMezzo>.Filter.Eq(x => x.CodiceMezzo, codiceMezzo))).ToList();
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
