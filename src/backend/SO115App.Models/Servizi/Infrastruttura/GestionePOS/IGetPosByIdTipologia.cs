using SO115App.Models.Classi.Pos;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestionePOS
{
    public interface IGetPosByIdTipologia
    {
        public DtoPos GetPosByIdTipologia(int idTipologia, int? idDettaglioTipologia);
    }
}
