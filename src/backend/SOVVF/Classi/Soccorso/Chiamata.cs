using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso
{
    public class Chiamata : Evento
    {
        /// <summary>
        /// E' una cosa del tipo AX554HN
        /// </summary>
        public string CodiceParlante { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string IdChiamante { get; set; }
    }
}
