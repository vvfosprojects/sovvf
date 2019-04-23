//-----------------------------------------------------------------------
// <copyright file="GetUnitaOperativaRadice_OrganigrammaCONRidottoCablato.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma
{
    /// <summary>
    ///   Questa classe fake implementa un organigramma con radice nel CON, che ha tutte le Direzioni
    ///   Regionali come figli. La sola Direzione Regionale Lazio è popolata con i suoi Comandi
    ///   Provinciali. Non vi sono altre unità operative.
    /// </summary>
    public class GetUnitaOperativaRadice_OrganigrammaCONRidottoCablato : IGetUnitaOperativaRadice
    {
        /// <summary>
        ///   Restituisce l'unità operativa del CON correttamente popolata.
        /// </summary>
        /// <returns>L'unità operativa del CON.</returns>
        public UnitaOperativa Get()
        {
            var con = new UnitaOperativa("CON", "Centro Operativo Nazionale");
            var dirRegPiemonte = new UnitaOperativa("DR_PIE", "Direzione Regionale Piemonte");
            con.AddFiglio(dirRegPiemonte);
            var dirRegLombardia = new UnitaOperativa("DR_LOM", "Direzione Regionale Lombardia");
            con.AddFiglio(dirRegLombardia);
            var dirRegLiguria = new UnitaOperativa("DR_LIG", "Direzione Regionale Liguria");
            con.AddFiglio(dirRegLiguria);
            var dirRegVeneto = new UnitaOperativa("DR_VEN", "Direzione Regionale Veneto");
            con.AddFiglio(dirRegVeneto);
            var dirRegFvg = new UnitaOperativa("DR_FVF", "Direzione Regionale Friuli Venezia Giulia");
            con.AddFiglio(dirRegFvg);
            var dirRegToscana = new UnitaOperativa("DR_TOS", "Direzione Regionale Toscana");
            con.AddFiglio(dirRegToscana);
            var dirRegEmilia = new UnitaOperativa("DR_EMI", "Direzione Regionale Emilia Romagna");
            con.AddFiglio(dirRegEmilia);
            var dirRegLazio = new UnitaOperativa("DR_LAZ", "Direzione Regionale Lazio");
            con.AddFiglio(dirRegLazio);
            var dirRegUmbria = new UnitaOperativa("DR_UMB", "Direzione Regionale Umbria");
            con.AddFiglio(dirRegUmbria);
            var dirRegAbruzzo = new UnitaOperativa("DR_ABR", "Direzione Regionale Abruzzo");
            con.AddFiglio(dirRegAbruzzo);
            var dirRegMarche = new UnitaOperativa("DR_MAR", "Direzione Regionale Marche");
            con.AddFiglio(dirRegMarche);
            var dirRegMolise = new UnitaOperativa("DR_MOL", "Direzione Regionale Molise");
            con.AddFiglio(dirRegMolise);
            var dirRegCampania = new UnitaOperativa("DR_CAM", "Direzione Regionale Campania");
            con.AddFiglio(dirRegCampania);
            var dirRegPuglia = new UnitaOperativa("DR_PUG", "Direzione Regionale Puglia");
            con.AddFiglio(dirRegPuglia);
            var dirRegBasilicata = new UnitaOperativa("DR_BAS", "Direzione Regionale Basilicata");
            con.AddFiglio(dirRegBasilicata);
            var dirRegCalabria = new UnitaOperativa("DR_CAL", "Direzione Regionale Calabria");
            con.AddFiglio(dirRegCalabria);
            var dirRegSicilia = new UnitaOperativa("DR_SIC", "Direzione Regionale Sicilia");
            con.AddFiglio(dirRegSicilia);
            var dirRegSardegna = new UnitaOperativa("DR_SAR", "Direzione Regionale Sardegna");
            con.AddFiglio(dirRegSardegna);
            var comProRM = new UnitaOperativa("CP_RM", "Comando Provinciale Roma");
            dirRegLazio.AddFiglio(comProRM);
            var comProLT = new UnitaOperativa("CP_LT", "Comando Provinciale Latina");
            dirRegLazio.AddFiglio(comProLT);
            var comProFR = new UnitaOperativa("CP_FR", "Comando Provinciale Frosinone");
            dirRegLazio.AddFiglio(comProFR);
            var comProRI = new UnitaOperativa("CP_RI", "Comando Provinciale Rieti");
            dirRegLazio.AddFiglio(comProRI);
            var comProVT = new UnitaOperativa("CP_VT", "Comando Provinciale Viterbo");
            dirRegLazio.AddFiglio(comProVT);

            return con;
        }
    }
}
