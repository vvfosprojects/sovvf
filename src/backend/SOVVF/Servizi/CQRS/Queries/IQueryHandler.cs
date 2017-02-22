// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Queries
{
    /// <summary>
    ///   Interfaccia per la gestione delle query del modello CQRS https://cuttingedge.it/blogs/steven/pivot/entry.php?id=92
    /// </summary>
    /// <typeparam name="TResult">Oggetto risultato restituito</typeparam>
    public interface IQuery<TResult>
    {
    }

    /// <summary>
    ///   Interfaccia di gestione delle query afferente al modello CQRS https://cuttingedge.it/blogs/steven/pivot/entry.php?id=92
    /// </summary>
    /// <typeparam name="TQuery">
    ///   Oggetto per il passaggio dei parametri necessari ad eseguire la query
    /// </typeparam>
    /// <typeparam name="TResult">Oggetto valorizzato con il risultato della query</typeparam>
    public interface IQueryHandler<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        /// <summary>
        ///   Metodo di gestione per il recupero di un oggetto TResult
        /// </summary>
        /// <param name="query">Parametro di filtraggio per il recupero informazioni.</param>
        /// <returns>DTO con valorizzazione risultati.</returns>
        TResult Handle(TQuery query);
    }
}
