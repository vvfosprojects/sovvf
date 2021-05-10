using Persistence.MongoDB;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestionePOS
{
    public class GetPosByIdTipologia : IGetPosByIdTipologia
    {
        private readonly DbContext _dbContext;

        public GetPosByIdTipologia(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        DtoPos IGetPosByIdTipologia.GetPosByIdTipologia(int idTipologia, int? idDettaglioTipologia)
        {
            throw new NotImplementedException();
        }
    }
}
