using SO115App.Models.Classi.ESRI;
using SO115App.Models.Classi.NUE;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI
{
    public interface INotifyUpDateSchedaContatto
    {
        public void UpDate(SchedaContatto scheda);
    }
}
