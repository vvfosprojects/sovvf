using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using SO115App.Persistence.Oracle.Servizi.Distaccamenti;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Persistence.Oracle.Servizi.Competenze
{
    public class GetCompetenzeByNomeVia
    {
        public List<ORACompetenzeByNomeVia> GetCompetenzeByNomeStrada(string CodSede, string NomeVia, string civico, string Citta)
        {
            List<ORACompetenzeByNomeVia> ListaCompetenzeElenco = new List<ORACompetenzeByNomeVia>();

            GetDistaccamentiByCodSede AnagraficaDistaccamenti = new GetDistaccamentiByCodSede();
            var ListaDistaccamenti = AnagraficaDistaccamenti.GetDistaccamentiBySede(CodSede);

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand()
            {
                Connection = conn,
                CommandText = "SELECT " +
                              "NVL(TABELLE_COMUNI.DISTACCAMENTI.CODSEDE,'') as CODSEDE, " +
                              "NVL(TABELLE_COMUNI.DISTACCAMENTI.CODDISTAC,1000) as CODDISTAC, " +
                              "NVL(SALAOPER.ROA_TRATTI.COD_DISTACCAMENTO1,1000) as COD_DISTACCAMENTO1, " +
                              "NVL(SALAOPER.ROA_TRATTI.COD_DISTACCAMENTO2,1000) as COD_DISTACCAMENTO2, " +
                              "NVL(SALAOPER.ROA_TRATTI.COD_DISTACCAMENTO3,1000) as COD_DISTACCAMENTO3, " +
                              "NVL(SALAOPER.ROA_TRATTI.ID_ZONA,0) as ID_ZONA, " +
                              "NVL(SALAOPER.ROA_TRATTI.ID_ZONA2,0) as ID_ZONA2, " +
                              "NVL(SALAOPER.ROA_TRATTI.ID_ZONA3,0) as ID_ZONA3, " +
                              "NVL(SALAOPER.INDIRIZZI_COMUNI.NAME,'') as NOMEVIA, " +
                              "NVL(SALAOPER.INDIRIZZI_COMUNI.COMUNE,'') as COMUNE, " +
                              "NVL(SALAOPER.INDIRIZZI_COMUNI.SIGLA_PROVINCIA,'') as SIGLA_PROVINCIA," +
                              "SALAOPER.HNR_CIVICI.LFTFSTHNR, " +
                              "SALAOPER.HNR_CIVICI.LFTLSTHNR, " +
                              "SALAOPER.HNR_CIVICI.RGHTFSTHNR," +
                              "SALAOPER.HNR_CIVICI.RGHTLSTHNR " +
                              "FROM SALAOPER.ROA_TRATTI " +
                              "INNER JOIN TABELLE_COMUNI.DISTACCAMENTI ON " +
                              "SALAOPER.ROA_TRATTI.COD_DISTACCAMENTO1 = TABELLE_COMUNI.DISTACCAMENTI.CODDISTAC " +
                              "INNER JOIN SALAOPER.INDIRIZZI_COMUNI ON SALAOPER.ROA_TRATTI.STLFTID = SALAOPER.INDIRIZZI_COMUNI.STID " +
                              "AND SALAOPER.ROA_TRATTI.STRGHTID = SALAOPER.INDIRIZZI_COMUNI.STID " +
                              "INNER JOIN SALAOPER.HNR_CIVICI ON SALAOPER.ROA_TRATTI.EDGID = SALAOPER.HNR_CIVICI.EDGID " +
                              "WHERE (UPPER(TABELLE_COMUNI.DISTACCAMENTI.CODSEDE) = :SEDE) " +
                              "AND   (UPPER(SALAOPER.INDIRIZZI_COMUNI.NAME) = '" + NomeVia.ToUpper() + "' ) " +
                              "AND   (UPPER(SALAOPER.INDIRIZZI_COMUNI.COMUNE) = '" + Citta.ToUpper().Trim() + "' ) " +
                              "GROUP BY TABELLE_COMUNI.DISTACCAMENTI.CODSEDE, TABELLE_COMUNI.DISTACCAMENTI.CODDISTAC, SALAOPER.ROA_TRATTI.COD_DISTACCAMENTO1, " +
                              "SALAOPER.ROA_TRATTI.COD_DISTACCAMENTO2, SALAOPER.ROA_TRATTI.COD_DISTACCAMENTO3, SALAOPER.ROA_TRATTI.ID_ZONA, SALAOPER.ROA_TRATTI.ID_ZONA2, " +
                              "SALAOPER.ROA_TRATTI.ID_ZONA3, SALAOPER.INDIRIZZI_COMUNI.NAME, SALAOPER.INDIRIZZI_COMUNI.COMUNE, SALAOPER.INDIRIZZI_COMUNI.SIGLA_PROVINCIA, " +
                              "SALAOPER.HNR_CIVICI.LFTFSTHNR, SALAOPER.HNR_CIVICI.LFTLSTHNR, SALAOPER.HNR_CIVICI.RGHTFSTHNR,SALAOPER.HNR_CIVICI.RGHTLSTHNR"
            };

            cmd.CommandType = CommandType.Text;
            cmd.Parameters.Add(new OracleParameter("SEDE", CodSede.ToUpper()));

            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORACompetenzeByNomeVia ORACompetenza = new ORACompetenzeByNomeVia()
                {
                    CODSEDE = Utility.Utility.GetDBField(dr, "CODSEDE"),
                    CODDISTAC = Convert.ToInt32(Utility.Utility.GetDBField(dr, "CODDISTAC")),
                    COD_DISTACCAMENTO1 = Convert.ToInt32(Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO1")),
                    DESC_DISTACCAMENTO1 = ListaDistaccamenti.Find(x => x.CODDISTAC.Equals(Convert.ToInt32(Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO1"))) && x.CODSEDE.Equals(CodSede.ToUpper())).DESCDISTAC,
                    COD_DISTACCAMENTO2 = Convert.ToInt32(Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO2")),
                    DESC_DISTACCAMENTO2 = ListaDistaccamenti.Find(x => x.CODDISTAC.Equals(Convert.ToInt32(Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO2"))) && x.CODSEDE.Equals(CodSede.ToUpper())).DESCDISTAC,
                    COD_DISTACCAMENTO3 = Convert.ToInt32(Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO3")),
                    DESC_DISTACCAMENTO3 = ListaDistaccamenti.Find(x => x.CODDISTAC.Equals(Convert.ToInt32(Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO3"))) && x.CODSEDE.Equals(CodSede.ToUpper())).DESCDISTAC,
                    COMUNE = Utility.Utility.GetDBField(dr, "COMUNE"),
                    ID_ZONA = Convert.ToInt32(Utility.Utility.GetDBField(dr, "ID_ZONA")),
                    ID_ZONA2 = Convert.ToInt32(Utility.Utility.GetDBField(dr, "ID_ZONA2")),
                    ID_ZONA3 = Convert.ToInt32(Utility.Utility.GetDBField(dr, "ID_ZONA3")),
                    NOMEVIA = Utility.Utility.GetDBField(dr, "NOMEVIA"),
                    SIGLA_PROVINCIA = Utility.Utility.GetDBField(dr, "SIGLA_PROVINCIA"),
                    LFTFSTHNR = Utility.Utility.GetDBField(dr, "LFTFSTHNR"),
                    LFTLSTHNR = Utility.Utility.GetDBField(dr, "LFTLSTHNR"),
                    RGHTFSTHNR = Utility.Utility.GetDBField(dr, "RGHTFSTHNR"),
                    RGHTLSTHNR = Utility.Utility.GetDBField(dr, "RGHTLSTHNR")
                };

                ListaCompetenzeElenco.Add(ORACompetenza);
            }

            conn.Dispose();
            return ListaCompetenzeElenco.FindAll(x => (Convert.ToDecimal(civico) >= Convert.ToDecimal(x.LFTFSTHNR) && Convert.ToDecimal(civico) <= Convert.ToDecimal(x.LFTLSTHNR))
                                                   || (Convert.ToDecimal(civico) >= Convert.ToDecimal(x.RGHTFSTHNR) && Convert.ToDecimal(civico) <= Convert.ToDecimal(x.RGHTLSTHNR)));
        }
    }
}
