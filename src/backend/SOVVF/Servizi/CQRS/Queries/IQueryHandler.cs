using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Queries
{
    /// <summary>
    ///   https://cuttingedge.it/blogs/steven/pivot/entry.php?id=92
    /// </summary>
    /// <typeparam name="TResult"></typeparam>
    public interface IQuery<TResult>
    {
    }

    /// <summary>
    ///   https://cuttingedge.it/blogs/steven/pivot/entry.php?id=92
    /// </summary>
    /// <typeparam name="TQuery"></typeparam>
    /// <typeparam name="TResult"></typeparam>
    public interface IQueryHandler<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        TResult Handle(TQuery query);
    }
}
