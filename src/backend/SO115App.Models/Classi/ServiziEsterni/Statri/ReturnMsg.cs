using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ServiziEsterni.Statri
{
    public class ReturnMsg
    {
        public Successfull[] Successfull { get; set; }
        public Error[] Failed { get; set; }
    }
}
