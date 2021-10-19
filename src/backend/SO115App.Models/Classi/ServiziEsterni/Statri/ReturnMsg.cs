using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ServiziEsterni.Statri
{
    public class ReturnMsg
    {
        public Successfull[] SuccessfullImport { get; set; }
        public Error[] FailedImport { get; set; }
    }
}
