using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Commands
{
    /// <summary>
    ///   link https://cuttingedge.it/blogs/steven/pivot/entry.php?id=91
    /// </summary>
    /// <typeparam name="TCommand">Il tipo del DTO che alimenta il comando</typeparam>
    public interface ICommandHandler<TCommand>
    {
        /// <summary>
        /// </summary>
        /// <param name="command"></param>
        void Handle(TCommand command);
    }
}
