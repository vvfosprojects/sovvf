using SO115App.Models.Classi.ESRI;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI
{
    public interface INotify_ESRIAddRichiesta
    {
        public void Call(ESRI_RichiestaMessage message);
    }
}
