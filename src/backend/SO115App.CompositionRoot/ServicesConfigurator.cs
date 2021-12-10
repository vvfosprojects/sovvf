﻿//-----------------------------------------------------------------------
// <copyright file="ServicesConfigurator.cs" company="CNVVF">
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
using SimpleInjector;
using SO115App.Persistence.File.CSVManagement;
using SO115App.Persistence.File.PDFManagement;
using System.Linq;

namespace SO115App.CompositionRoot
{
    internal static class ServicesConfigurator
    {
        internal static void Configure(Container container)
        {
            container.Register(typeof(IPDFTemplateManager<>), typeof(IPDFTemplateManager<>).Assembly.DefinedTypes.Where(n => n.Name.Contains("PDFTemplateManager")).ToArray()[1]);
            container.Register(typeof(ICSVTemplateManager<>), typeof(ICSVTemplateManager<>).Assembly.DefinedTypes.Where(n => n.Name.Contains("CSVTemplateManager")).ToArray()[0]);
        }
    }
}
