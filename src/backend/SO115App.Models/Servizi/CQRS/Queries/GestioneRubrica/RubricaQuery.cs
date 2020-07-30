using CQRS.Queries;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaQuery : IQuery<RubricaResult>
    {
        /// <summary>
        ///   Il filtro utilizzato per la ricerca delle voci in rubrica
        /// </summary>
        public string[] IdSede { get; set; }

        /// <summary>
        ///   L'id dell'operatore che ha fatto la richiesta di visualizzazione voci rubrica
        /// </summary>
        public string IdOperatore { get; set; }

        //FILTRO ???
    }
}
