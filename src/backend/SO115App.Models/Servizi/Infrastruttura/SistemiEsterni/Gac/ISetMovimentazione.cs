using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    internal interface ISetMovimentazione
    {
        void SetMovimentazione(string codiceMezzo, Movimentazione movimentazione);
    }
}
