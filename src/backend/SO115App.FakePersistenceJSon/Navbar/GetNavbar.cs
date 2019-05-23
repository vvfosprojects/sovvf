using Newtonsoft.Json;
using SO115App.API.Models.Classi.Navbar;
using SO115App.Models.Servizi.Infrastruttura.NavBar;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SO115App.FakePersistenceJSon.Navbar
{
    public class GetNavbar : IGetNavbar
    {
        public API.Models.Classi.Navbar.Navbar Get()
        {
            string filepath = "Fake/Navbar.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            API.Models.Classi.Navbar.Navbar navbars = JsonConvert.DeserializeObject<API.Models.Classi.Navbar.Navbar>(json);

            return navbars;
        }
    }
}
