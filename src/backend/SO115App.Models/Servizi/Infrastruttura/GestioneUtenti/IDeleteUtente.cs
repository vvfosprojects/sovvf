using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti
{
    public interface IDeleteUtente
    {
        void Delete(string codFisc);
    }
}
