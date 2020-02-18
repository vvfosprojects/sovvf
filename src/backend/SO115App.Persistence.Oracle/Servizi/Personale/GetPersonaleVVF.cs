using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System.Collections.Generic;
using System.Data;

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
                CommandText = "SELECT NVL(COGNOME,' '), NVL(NOME,' '), NVL(MATDIP,0), NVL(COD_DISTACCAMENTO,0) FROM SALAOPER.PERSONALE p WHERE NOME LIKE :NAME OR COGNOME LIKE :SURNAME"
            };

            cmd.CommandType = CommandType.Text;
            cmd.Parameters.Add(new OracleParameter("NAME", "%" + text.ToUpper() + "%"));
            cmd.Parameters.Add(new OracleParameter("SURNAME", "%" + text.ToUpper() + "%"));
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                var personaSingola = new ORAPersonaleVVF
                {
                    CodFiscale = dr.GetString(2),
                    Nominativo = $"{dr.GetString(1)}.{dr.GetString(0)}",
                    Sede = dr.GetInt32(3).ToString()
                };

                listaPersonale.Add(personaSingola);
            }

            return listaPersonale;
        }
    }
}
