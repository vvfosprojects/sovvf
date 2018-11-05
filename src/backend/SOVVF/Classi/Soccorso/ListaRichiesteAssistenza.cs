using Modello.Classi.Soccorso;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso
{

    public class ListaRichiesteAssistenza
    {

        public ListaRichiesteAssistenza()
        {

        }


        public ListaRichiesteAssistenza(ObjectId id, Object parametri, int mezzi, RichiestaAssistenza ric)
        {
            this._id = id;
            this.Parametri = parametri;
            this.MezziAncoraDaInviare = mezzi;
            this.Richiesta = ric;
        }


        /// <summary>
        ///  Id del DB
        /// </summary>  
        /// <returns>La Richiesta di Assistenza</return>
        [BsonId]
        public ObjectId _id { get; set; }

        public Object Parametri { get; set; }

        public int MezziAncoraDaInviare { get; set; }

        /// <summary>
        ///   Restituisce una Richiesta di Assistenza
        /// </summary>  
        /// <returns>La Richiesta di Assistenza</returns>
        public RichiestaAssistenza Richiesta { get; set; }
    }

    
}
