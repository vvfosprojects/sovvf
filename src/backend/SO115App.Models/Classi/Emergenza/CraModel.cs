﻿using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Emergenza
{
    public class CraModel
    {
        //Id MongoDB
        public string Id { get; set; }

        public string Nome { get; set; }
        public string[] Dirigenti { get; set; }
        public Coordinate Coordinate { get; set; }
        public string Indirizzo { get; set; }
        public List<DoaModel> ListaDoa { get; set; }
    }
}
