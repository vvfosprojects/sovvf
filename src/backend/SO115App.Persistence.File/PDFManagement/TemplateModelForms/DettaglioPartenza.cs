using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.File.PDFManagement.TemplateModelForms
{
    public class DettaglioPartenza
    {
        public string SiglaMezzo { get; set; }
        public string TargaMezzo { get; set; }
        public string SiglaSquadra { get; set; }
        public string SchedaCapoPartenza { get; set; }
        /// <summary>
        /// ??????
        /// </summary>
        public DateTime OraAss { get; set; }
    }
}
