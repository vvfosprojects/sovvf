using System;
using System.Collections.Generic;
using System.Text;

namespace CQRS.Commands
{
    public interface ICommandHandler<TCommand>
    {
        void Handle(TCommand command);
    }
}
