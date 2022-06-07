﻿using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia.GetDettagliTipoligiaByIdTipologia;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneDettaglioTipologia
{
    public class GetListaDettagliTipologiaByIdTipologia : IGetListaDettagliTipologieByIdTipologia
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetPOS _getPos;

        public GetListaDettagliTipologiaByIdTipologia(DbContext dbContext, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative, IGetPOS getPos)
        {
            _dbContext = dbContext;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getPos = getPos;
        }

        public List<TipologiaDettaglio> Get(GetDettagliTipoligiaByIdTipologiaQuery query)
        {
            var listaPin = GetGerarchia(query.IdSede);
            var lstCodiciPin = listaPin.Select(c => c.Codice).ToList();
            var lstEnti = _dbContext.TipologiaDettaglioCollection.Find(c => lstCodiciPin.Contains(c.CodSede) && c.CodiceTipologia.Equals(query.CodiceTipologia)).ToList();

            //GESTIONE RICORSIVITA'
            var result = FiltraByRicorsività(listaPin, lstEnti);

            //MAPPING E ORDINAMENTO
            return result.Select(c => new TipologiaDettaglio()
            {
                CodiceDettaglioTipologia = c.CodiceDettaglioTipologia,
                CodiceTipologia = c.CodiceTipologia,
                CodSede = c.CodSede,
                Descrizione = c.Descrizione,
                Ricorsivo = c.Ricorsivo,
                Id = c.Id,
                Pos = GetPosByTipologia(c.CodiceTipologia, c.CodiceDettaglioTipologia, c.CodSede)
            }).OrderByDescending(c => c.Descrizione).ToList();
        }

        private List<PosDAO> GetPosByTipologia(int codiceTipologia, int codiceDettaglioTipologia, string CodSede)
        {
            var filtriPos = new FiltriPOS()
            {
                idTipologia = codiceTipologia,
                idDettaglioTipologia = codiceDettaglioTipologia
            };

            var query = new GetElencoPOSQuery()
            {
                CodiceSede = CodSede,
                Filters = filtriPos
            };

            var Pos = _getPos.GetPosByCodTipologiaCodDettaglio(query);

            if (Pos != null)
                return Pos;
            else
                return null;
        }

        private List<PinNodo> GetGerarchia(string[] CodSede)
        {
            var listaPin = new List<PinNodo>();
            var sediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            foreach (var sede in CodSede)
            {
                listaPin.Add(new PinNodo(sede, true));
                foreach (var figlio in sediAlberate.Result.GetSottoAlbero(listaPin))
                {
                    PinNodo fgl = new PinNodo(figlio.Codice, true);
                    listaPin.Add(fgl);
                }
            }

            return listaPin;
        }

        private static List<TipologiaDettaglio> FiltraByRicorsività(List<PinNodo> listaPin, List<TipologiaDettaglio> lstTipologie)
        {
            return lstTipologie.Where(c =>
            {
                //LOGICA/CONDIZIONI RICORSIVITA'
                if (c.CodSede == "00")
                    return true;

                var padre = listaPin.Find(x => x.Codice == c.CodSede.Substring(0, 2) + ".1000");
                var figli = listaPin.Where(x => x.Codice.Contains(c.CodSede.Substring(0, 2)) && x != padre).ToList();

                return (padre.Ricorsivo && c.Ricorsivo) || figli.Any(x => x.Ricorsivo);
            }).ToList();
        }
    }
}
