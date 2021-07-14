using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Persistence.File.CSVManagement;
using SO115App.Persistence.File.CSVManagement.TemplateModelForms;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.ChiamateInSospeso
{
    public class ChiamateInSospesoQueryHandler : IQueryHandler<ChiamateInSospesoQuery, ChiamateInSospesoResult>
    {
        private readonly ICSVManager _csvManager;
        private readonly IGetListaSintesi _getListaSintesi;

        public ChiamateInSospesoQueryHandler(ICSVManager csvManager, IGetListaSintesi getListaSintesi)
        {
            _csvManager = csvManager;
            _getListaSintesi = getListaSintesi;
        }

        public ChiamateInSospesoResult Handle(ChiamateInSospesoQuery query)
        {
            MemoryStream stream = null;

            var filtro = new FiltroRicercaRichiesteAssistenza()
            {
                idOperatore = query.IdOperatore,
                StatiRichiesta = new List<string>() { "C" },
                UnitaOperative = query.IdSede.Select(cod => new PinNodo(cod)).ToHashSet()
            };

            var lstSintesi = _getListaSintesi.GetListaSintesiRichieste(filtro);

            if (lstSintesi?.Count == 0)
                return null;
            
            var lstChiamateInSospeso = lstSintesi.Select(sintesi => new ChiamataInSospeso()
            {
                //CodTipologia = string.Join(',', sintesi.Tipologie.Select(t => t.Codice).ToString()),
                //DataChiamata = sintesi.IstanteRicezioneRichiesta.ToString(),
                //Comune = sintesi.Localita.Citta,
                //DettaglioTipologia = sintesi.DettaglioTipologia.Descrizione,
                X = sintesi.Localita.Coordinate.Latitudine.ToString(),
                Y = sintesi.Localita.Coordinate.Longitudine.ToString(),
                //TODO FINIRE MAPPING
            }).ToList();

            stream = _csvManager.GenerateAndDownload(lstChiamateInSospeso);

            return new ChiamateInSospesoResult()
            {
                Data = stream
            };
        }
    }
}
