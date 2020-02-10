using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Persistence.Oracle.Servizi.Personale
{
    public class GetPersonaleVVF
    {
        public List<ORAPersonaleVVF> GetPersoneVVF(string text, string codiceSede)
        {
            var listaPersonale = new List<ORAPersonaleVVF>();
            var context = new DBContext();
            var infoCon = context.GetConnectionFromCodiceSede(codiceSede);

            OracleConnection conn = new OracleConnection(infoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand
            {
                Connection = conn,
                CommandText = $"SELECT NVL(COGNOME,' '), NVL(NOME,' '), NVL(MATDIP,0), NVL(COD_DISTACCAMENTO,0) FROM SALAOPER.PERSONALE p WHERE NOME LIKE'%{text.ToUpper()}%' OR COGNOME LIKE '%{text.ToUpper()}%'"
            };

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                var personaSingola = new ORAPersonaleVVF
                {
                    CodFiscale = dr.GetString(2),
                    Nominativo = $"{dr.GetString(1)}.{dr.GetString(0)}",
                    Sede = $"{codiceSede}.{dr.GetInt32(3).ToString()}"
                };

                listaPersonale.Add(personaSingola);
            }

            return listaPersonale;
        }
    }
}
