using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Eventi.Eccezioni
{
    [Serializable]
    public class WorkflowException : Exception
    {
        public WorkflowException()
        { }

        public WorkflowException(string message)
            : base(message)
        { }

        public WorkflowException(string message, Exception innerException)
            : base(message, innerException)
        { }
    }
}
