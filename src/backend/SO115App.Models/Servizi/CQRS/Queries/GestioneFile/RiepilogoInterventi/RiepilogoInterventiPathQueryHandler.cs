using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Persistence.File.PDFManagement;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.RiepilogoInterventi
{
    public class RiepilogoInterventiPathQueryHandler : IQueryHandler<RiepilogoInterventiPathQuery, RiepilogoInterventiPathResult>
    {
        private readonly IGetRiepilogoInterventi _getRiepilogoInterventi;
        private readonly IGetUtenteById _getUtente;
        private readonly IPDFTemplateManager<RiepilogoInterventiModelForm> _pdfManager;

        public RiepilogoInterventiPathQueryHandler(IGetRiepilogoInterventi getRiepilogoInterventi,
            IGetUtenteById getUtente,
            IPDFTemplateManager<RiepilogoInterventiModelForm> pdfManager)
        {
            _getUtente = getUtente;
            _getRiepilogoInterventi = getRiepilogoInterventi;
            _pdfManager = pdfManager;
        }

        public RiepilogoInterventiPathResult Handle(RiepilogoInterventiPathQuery query)
        {
            var operatore = _getUtente.GetUtenteByCodice(query.IdOperatore);

            var lstInterventi = _getRiepilogoInterventi.GetRiepilogoInterventi(query.Filtri).Result;

            var filename = "Riepilogo_interventi_" + DateTime.Now.ToString("dd/MM/yyyy") + ".pdf";

            var form = new RiepilogoInterventiModelForm()
            {
                lstRiepiloghi = lstInterventi.Select(i => new RiepilogoIntervento()
                {
                    Richiedente = i.Richiedente.Telefono,
                    
                }).ToList(),
                A = query.Filtri.A,
                Da = query.Filtri.Da,
                DescComando = operatore.Sede.Descrizione,
                TotInterventi = lstInterventi.Count
            };

            var memoryStream = _pdfManager.GenerateAndDownload(form, filename, "RiepiloghiInterventi");

            return new RiepilogoInterventiPathResult()
            {
                Data = memoryStream
            };
        }
    }
}
