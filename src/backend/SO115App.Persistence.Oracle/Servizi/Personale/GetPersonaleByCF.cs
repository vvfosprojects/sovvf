using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System.Data;

namespace SO115App.Persistence.Oracle.Servizi.Personale
{
    public class GetPersonaleByCF
    {
        public ORAPersonaleVVF GetByCF(string codiceSede, string codiceFiscale)
        {
            var context = new DBContext();
            var infoCon = context.GetConnectionFromCodiceSede(codiceSede);

            OracleConnection conn = new OracleConnection(infoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand
            {
                Connection = conn,
                CommandText = "SELECT NVL(COGNOME,' '), NVL(NOME,' '), NVL(MATDIP,0), NVL(COD_DISTACCAMENTO,0) FROM SALAOPER.PERSONALE p WHERE MATDIP = :COD_FISC"
            };

            cmd.CommandType = CommandType.Text;
            cmd.Parameters.Add(new OracleParameter("COD_FISC",  codiceFiscale ));
            OracleDataReader dr = cmd.ExecuteReader();
            var personaSingola = new ORAPersonaleVVF();
            while (dr.Read())
            {
                personaSingola.CodFiscale = dr.GetString(2);
                personaSingola.Nominativo = $"{dr.GetString(1)}.{dr.GetString(0)}";
                personaSingola.Sede = dr.GetInt32(3).ToString();
            }

            return personaSingola;
        }
    }
}
