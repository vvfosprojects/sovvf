using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.SignalR.Utility
{
    public class UpDateHubConId
    {
        private readonly IUpDateHubConId _upDateHubConId;

        public UpDateHubConId(IUpDateHubConId upDateHubConId)
        {
            _upDateHubConId = upDateHubConId;
        }
    }
}
