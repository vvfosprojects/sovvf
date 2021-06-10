using CQRS.Queries;
using SO115App.Models.Classi.Filtri;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.RiepilogoInterventi
{
    public class RiepilogoInterventiPathQuery : IQuery<RiepilogoInterventiPathResult>
    {
        public string[] IdSede { get; set; }

        public string IdOperatore { get; set; }

        public FiltriRiepilogoInterventi Filtri { get; set; }
    }
}
