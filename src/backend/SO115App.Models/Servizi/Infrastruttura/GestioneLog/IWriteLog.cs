using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneLog
{
    public interface IWriteLog
    {
        public void Save(LogException exception);
    }
}
