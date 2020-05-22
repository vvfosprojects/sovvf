using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;
using Oracle.ManagedDataAccess.Client;

namespace SO115App.Persistence.Oracle.Core.Utility
{
    public static class Utility
    {


        public static dynamic GetDBField(OracleDataReader dr, string nomeCol)
        {
            object field = dr[nomeCol];
            if (field.GetType() == typeof(DBNull))
                return null;

            dynamic dyn = Convert.ChangeType(field, field.GetType());
            return dyn;
        }
        
        public static dynamic GetDBField(System.Data.DataRow dr, string nomeCol)
        {
            object field = dr[nomeCol];
            if (field.GetType() == typeof(DBNull))
                return null;

            dynamic dyn = Convert.ChangeType(field, field.GetType());
            return dyn;
        }
        public static dynamic GetJsonValue(JValue jValue)
        {
            if (jValue != null && jValue.Value != null)
            {
                dynamic dyn = Convert.ChangeType(jValue.Value, jValue.Value.GetType());
                return dyn;
            }
            return null;
        }

    }


}
