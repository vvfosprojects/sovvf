﻿using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneDettaglioTipologia
{
    public class GetListaDettagliTipologia : IGetListaDettaglioTipologia
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetPOS _getPOS;

        public GetListaDettagliTipologia(DbContext dbContext, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
                                        IGetPOS getPOS)
        {
            _dbContext = dbContext;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getPOS = getPOS;
        }

        public List<TipologiaDettaglio> Get(DettaglioTipologiaQuery query)
        {
            string text = query.Filters?.Search?.ToLower() ?? "";

            int? CodTipologia = 0;
            if (query.Filters != null)
                CodTipologia = query.Filters?.codTipologia;

            var listaPin = GetGerarchia(query.IdSede);

            var lstCodiciPin = listaPin.Select(c => c.Codice).ToList();

            string codiceSedePadre = "";
            if (query.IdSede[0].Contains("."))
                codiceSedePadre = query.IdSede[0].Split('.')[0];  //_getAlberaturaUnitaOperative.GetCodiceSedePadre(query.IdSede[0]);
            else
                codiceSedePadre = _getAlberaturaUnitaOperative.GetCodiceSedePadre(query.IdSede[0]);

            lstCodiciPin.Add(codiceSedePadre);

            var lstEnti = new List<TipologiaDettaglio>();

            if (CodTipologia != 0 && CodTipologia != null)
                lstEnti = _dbContext.TipologiaDettaglioCollection.Find(c => lstCodiciPin.Contains(c.CodSede)
                && (c.Descrizione.ToLower().Contains(text)) && (CodTipologia == c.CodiceTipologia)).ToList();
            else
                lstEnti = _dbContext.TipologiaDettaglioCollection.Find(c => lstCodiciPin.Contains(c.CodSede)
                && (c.Descrizione.ToLower().Contains(text))).ToList();

            //GESTIONE RICORSIVITA'
            var result = lstEnti; //FiltraByRicorsività(listaPin, lstEnti);

            //MAPPING E ORDINAMENTO
            return result.Select(c => new TipologiaDettaglio()
            {
                CodiceDettaglioTipologia = c.CodiceDettaglioTipologia,
                CodiceTipologia = c.CodiceTipologia,
                CodSede = c.CodSede,
                Descrizione = c.Descrizione,
                Ricorsivo = c.Ricorsivo,
                Id = c.Id,
                Pos = _getPOS.GetPosByCodTipologiaCodDettaglio(new GetElencoPOSQuery() { CodiceSede = c.CodSede, Filters = new FiltriPOS() { idDettaglioTipologia = c.CodiceDettaglioTipologia, idTipologia = c.CodiceTipologia } })
            }).OrderByDescending(c => c.Descrizione).ToList();
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
            if (lstTipologie.Count > 0)
                return lstTipologie.Where(c =>
                {
                    //LOGICA/CONDIZIONI RICORSIVITA'
                    if (c.CodSede.Contains("."))
                    {
                        var padre = listaPin.Find(x => x.Codice == c.CodSede.Substring(0, 2) + ".1000");
                        var figli = listaPin.Where(x => x.Codice.Contains(c.CodSede.Substring(0, 2)) && x != padre).ToList();

                        return (padre.Ricorsivo && c.Ricorsivo) || figli.Any(x => x.Ricorsivo);
                    }
                    else
                    {
                        var padre = listaPin.Find(x => x.Codice == c.CodSede);
                        var figli = listaPin.Where(x => x.Codice.Contains(c.CodSede.Substring(0, 2)) && x != padre).ToList();

                        return (padre.Ricorsivo && c.Ricorsivo) || figli.Any(x => x.Ricorsivo);
                    }
                }).ToList();
            else
                return lstTipologie;
        }
    }
}
