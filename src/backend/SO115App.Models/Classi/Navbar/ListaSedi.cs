using System.Collections.Generic;


namespace SO115App.Models.Classi.Navbar
{
    public class ListaSedi
    {
        public string Text { get; set; }
        public string Value { get; set; }
        public List<Child> Children { get; set; }
    }

    public class Child
    {
        public string Text { get; set; }
        public string Value { get; set; }
        public List<Child2> Children { get; set; }
    }

    public class Child2
    {
        public string Text { get; set; }
        public string Value { get; set; }
        public List<Child3> Children { get; set; }
    }

    public class Child3
    {
        public string Text { get; set; }
        public string Value { get; set; }
    }
}
