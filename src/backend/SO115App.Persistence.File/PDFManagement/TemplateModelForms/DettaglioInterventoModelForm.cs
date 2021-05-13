using System;
using System.Collections.Generic;

namespace SO115App.Persistence.File.PDFManagement.TemplateModelForms
{
    public sealed class DettaglioInterventoModelForm
    {
        public DettaglioChiamata Chiamata { get; set; }

        public List<DettaglioPartenza> lstPartenze { get; set; }
    }
}
