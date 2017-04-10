using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Organigramma;
using Modello.Servizi.Infrastruttura.Organigramma;

namespace SOVVF.FakeImplementations.Modello.Organigramma
{
    internal class GetUnitaOperativaRadice_OrganigrammaCONRidottoCablato : IGetUnitaOperativaRadice
    {
        public UnitaOperativa Get()
        {
            var con = new UnitaOperativa()
            {
                Codice = "CON",
                Nome = "Centro Operativo Nazionale"
            };

            #region Le 18 Direzioni Regionali

            var dirRegPiemonte = new UnitaOperativa()
            {
                Codice = "DR_PIE",
                Nome = "Direzione Regionale Piemonte"
            };
            con.AddFiglio(dirRegPiemonte);

            var dirRegLombardia = new UnitaOperativa()
            {
                Codice = "DR_LOM",
                Nome = "Direzione Regionale Lombardia"
            };
            con.AddFiglio(dirRegLombardia);

            var dirRegLiguria = new UnitaOperativa()
            {
                Codice = "DR_LIG",
                Nome = "Direzione Regionale Liguria"
            };
            con.AddFiglio(dirRegLiguria);

            var dirRegVeneto = new UnitaOperativa()
            {
                Codice = "DR_VEN",
                Nome = "Direzione Regionale Veneto"
            };
            con.AddFiglio(dirRegVeneto);

            var dirRegFvg = new UnitaOperativa()
            {
                Codice = "DR_FVF",
                Nome = "Direzione Regionale Friuli Venezia Giulia"
            };
            con.AddFiglio(dirRegFvg);

            var dirRegToscana = new UnitaOperativa()
            {
                Codice = "DR_TOS",
                Nome = "Direzione Regionale Toscana"
            };
            con.AddFiglio(dirRegToscana);

            var dirRegEmilia = new UnitaOperativa()
            {
                Codice = "DR_EMI",
                Nome = "Direzione Regionale Emilia Romagna"
            };
            con.AddFiglio(dirRegEmilia);

            var dirRegLazio = new UnitaOperativa()
            {
                Codice = "DR_LAZ",
                Nome = "Direzione Regionale Lazio"
            };
            con.AddFiglio(dirRegLazio);

            var dirRegUmbria = new UnitaOperativa()
            {
                Codice = "DR_UMB",
                Nome = "Direzione Regionale Umbria"
            };
            con.AddFiglio(dirRegUmbria);

            var dirRegAbruzzo = new UnitaOperativa()
            {
                Codice = "DR_ABR",
                Nome = "Direzione Regionale Abruzzo"
            };
            con.AddFiglio(dirRegAbruzzo);

            var dirRegMarche = new UnitaOperativa()
            {
                Codice = "DR_MAR",
                Nome = "Direzione Regionale Marche"
            };
            con.AddFiglio(dirRegMarche);

            var dirRegMolise = new UnitaOperativa()
            {
                Codice = "DR_MOL",
                Nome = "Direzione Regionale Molise"
            };
            con.AddFiglio(dirRegMolise);

            var dirRegCampania = new UnitaOperativa()
            {
                Codice = "DR_CAM",
                Nome = "Direzione Regionale Campania"
            };
            con.AddFiglio(dirRegCampania);

            var dirRegPuglia = new UnitaOperativa()
            {
                Codice = "DR_PUG",
                Nome = "Direzione Regionale Puglia"
            };
            con.AddFiglio(dirRegPuglia);

            var dirRegBasilicata = new UnitaOperativa()
            {
                Codice = "DR_BAS",
                Nome = "Direzione Regionale Basilicata"
            };
            con.AddFiglio(dirRegBasilicata);

            var dirRegCalabria = new UnitaOperativa()
            {
                Codice = "DR_CAL",
                Nome = "Direzione Regionale Calabria"
            };
            con.AddFiglio(dirRegCalabria);

            var dirRegSicilia = new UnitaOperativa()
            {
                Codice = "DR_SIC",
                Nome = "Direzione Regionale Sicilia"
            };
            con.AddFiglio(dirRegSicilia);

            var dirRegSardegna = new UnitaOperativa()
            {
                Codice = "DR_SAR",
                Nome = "Direzione Regionale Sardegna"
            };
            con.AddFiglio(dirRegSardegna);

            #endregion Le 18 Direzioni Regionali

            #region I Comandi Provinciali del Lazio

            var comProRM = new UnitaOperativa()
            {
                Codice = "CP_RM",
                Nome = "Comando Provinciale Roma"
            };
            dirRegLazio.AddFiglio(comProRM);

            var comProLT = new UnitaOperativa()
            {
                Codice = "CP_LT",
                Nome = "Comando Provinciale Latina"
            };
            dirRegLazio.AddFiglio(comProLT);

            var comProFR = new UnitaOperativa()
            {
                Codice = "CP_FR",
                Nome = "Comando Provinciale Frosinone"
            };
            dirRegLazio.AddFiglio(comProFR);

            var comProRI = new UnitaOperativa()
            {
                Codice = "CP_RI",
                Nome = "Comando Provinciale Rieti"
            };
            dirRegLazio.AddFiglio(comProRI);

            var comProVT = new UnitaOperativa()
            {
                Codice = "CP_VT",
                Nome = "Comando Provinciale Viterbo"
            };
            dirRegLazio.AddFiglio(comProVT);

            #endregion I Comandi Provinciali del Lazio

            return con;
        }
    }
}
