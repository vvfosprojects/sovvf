using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Utenti.Autenticazione
{
    public class CasAuthSuccess
    {
        public string User { get; set; }
        public string Id { get; set; }
        public CasAttributes Attributes { get; set; }
    }
}
