using System.Collections.Generic;

namespace SO115App.Models.Classi.Triage
{
    public class Tree
    {
        public string Text { get; set; }
        public string Value { get; set; }
        public bool internalChecked { get; set; }
        public bool internalCollapsed { get; set; }
        public bool internalDisabled { get; set; }
        public List<Tree> InternalChildren { get; set; }
    }
}
