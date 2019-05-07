using System;
using System.Collections.Generic;
using System.Text;

namespace CQRS.Commands.Notifiers
{
    public interface ICommandNotifier<TCommand>
    {
        void Notify(TCommand command);
    }
}
