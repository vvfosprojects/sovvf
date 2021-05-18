using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.File.PDFManagement.TemplateModelForms
{
    public sealed class RiepilogoInterventiModelForm
    {
        public string DescComando { get; set; }

        public DateTime Da { get; set; }
        public DateTime A { get; set; }
        public string TotInterventi { get; set; }

        public List<RiepilogoIntervento> lstRiepiloghi { get; set; }
    }
}
