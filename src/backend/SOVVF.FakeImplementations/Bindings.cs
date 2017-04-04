//-----------------------------------------------------------------------
// <copyright file="Bindings.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using Modello.Servizi.Infrastruttura.Autenticazione;
using SimpleInjector;
using SimpleInjector.Packaging;
using SOVVF.FakeImplementations.Modello.Autenticazione;

namespace SOVVF.FakeImplementations
{
    /// <summary>
    ///   Bindings delle implementazioni fake
    /// </summary>
    public class Bindings : IPackage
    {
        /// <summary>
        ///   Contiene le regole di bindings
        /// </summary>
        /// <param name="container">Il container sul quale le registrazioni hanno effetto</param>
        public void RegisterServices(Container container)
        {
            container.Register<IGetOperatoreAutenticato, GetOperatoreAutenticato>();
        }
    }
}
