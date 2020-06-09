using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Utenti.Autenticazione
{
    public class CasResponceService
    {
        public CasAuthFail AuthenticationFailure { get; set; }

        public CasAuthSuccess AuthenticationSuccess { get; set; }
    }
}
