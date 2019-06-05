using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Navbar;
using System.Collections.Generic;

namespace SO115App.API.Models.Classi.Navbar
{
    public class Navbar
    {
        public ListaSedi ListaSedi { get; set; }

        public List<Tipologia> Tipologie { get; set; }

    }
}