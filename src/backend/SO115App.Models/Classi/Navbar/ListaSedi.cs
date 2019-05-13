using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Navbar
{
    public class ListaSedi
    {
        public string text { get; set; }
        public string value { get; set; }
        public List<Child> children { get; set; }
    }

    public class Child
    {
        public string text { get; set; }
        public string value { get; set; }
        public List<Child2> children { get; set; }
    }

    public class Child2
    {
        public string text { get; set; }
        public string value { get; set; }
        public List<Child3> children { get; set; }
    }

    public class Child3
    {
        public string text { get; set; }
        public string value { get; set; }
    }
}
