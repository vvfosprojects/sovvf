using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Triage
{
    public class TreeTriage
    {
        public string Text { get; set; }
        public string Value { get; set; }
        public bool internalChecked { get; set; }
        public bool internalCollapsed { get; set; }
        public bool internalDisabled { get; set; }
        public List<Triage> InternalChildren { get; set; }
    }
}
