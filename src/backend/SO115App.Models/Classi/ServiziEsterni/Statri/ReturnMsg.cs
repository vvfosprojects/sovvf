using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ServiziEsterni.Statri
{
    public class ReturnMsg
    {
        public List<SuccessfullImport> SuccessfullImport { get; set; }
        public List<FailedImport> FailedImport { get; set; }
    }
}
