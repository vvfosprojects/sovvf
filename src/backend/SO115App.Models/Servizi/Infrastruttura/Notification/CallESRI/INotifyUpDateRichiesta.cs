using SO115App.Models.Classi.ESRI;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI
{
    public interface INotifyUpDateRichiesta
    {
        public void UpDate(ESRI_RichiestaMessage messaggio);
    }
}
