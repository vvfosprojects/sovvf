using CQRS.Queries;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Persistence.File.PDFManagement;
using SO115App.Persistence.File.PDFManagement.Templates.DettaglioChiamata;
using SO115App.Persistence.File.PDFManagement.Templates.DettaglioIntervento;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.DettaglioRichiesta
{
    public class DettaglioRichiestaPathQueryHandler : IQueryHandler<DettaglioRichiestaPathQuery, DettaglioRichiestaPathResult>
    {
        private readonly IGetRichiesta _getRichiesta;
        private readonly IPDFTemplateManager<DettaglioChiamataModelForm> _dettChiamataManagr;
        private readonly IPDFTemplateManager<DettaglioInterventoModelForm> _dettInterventoManagr;

        public DettaglioRichiestaPathQueryHandler(IGetRichiesta getRichiesta, 
            IPDFTemplateManager<DettaglioChiamataModelForm> dettChiamataManagr,
            IPDFTemplateManager<DettaglioInterventoModelForm> dettInterventoManagr)
        {
            _getRichiesta = getRichiesta;
            _dettChiamataManagr = dettChiamataManagr;
            _dettInterventoManagr = dettInterventoManagr;
        }

        public DettaglioRichiestaPathResult Handle(DettaglioRichiestaPathQuery query)
        {
            RichiestaAssistenza richiesta;
            string path;

            bool chiamata = query.CodiceRichiesta.Length == 17;
            string filename;

            //GENERO IL Dettaglio CHIAMATA o INTERVENTO
            if(chiamata)
            {
                _getRichiesta.GetByCodice(query.CodiceRichiesta);

                filename = "dettaglio_chiamata_" + query.CodiceRichiesta + ".pdf";

                var form = new DettaglioChiamataModelForm()
                {
                    MyProperty1 = "prop1",
                    MyProperty2 = "prop2"
                };

                _dettChiamataManagr.GenerateDocument(form, filename);

                _dettChiamataManagr.SaveDocumentOnPublicFileFolder(form);

                path = _dettChiamataManagr.GetDocumentPath("DettagliChiamate");
            }
            else // intervento
            {
                _getRichiesta.GetByCodiceRichiesta(query.CodiceRichiesta);

                filename = "dettaglio_intervento_" + query.CodiceRichiesta + ".pdf";

                var form = new DettaglioInterventoModelForm()
                {
                    MyProperty1 = "prop1",
                    MyProperty2 = "prop2"
                };

                _dettInterventoManagr.GenerateDocument(form, filename);

                _dettInterventoManagr.SaveDocumentOnPublicFileFolder(form);

                path = _dettInterventoManagr.GetDocumentPath("DettagliInterventi") + filename;
            }

            return new DettaglioRichiestaPathResult()
            {
                Data = path
            };
        }
    }
}
