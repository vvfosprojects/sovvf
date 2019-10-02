using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiGateway.Classi
{
    public class Costanti
    {
        public static string TerRegioniUrl = "http://172.16.25.10:5002/api/Regioni?startIndex=0&pageSize=900";
        public static string TerPrevinceUrl = "http://172.16.25.10:5002/api/Province?startIndex=0&pageSize=900";
        public static string TerComuniUrl = "http://172.16.25.10:5002/api/Comuni?startIndex=0&pageSize=12000";

        public static string NueUrl = "http://localhost:5001/api/SchedaContatto";

        public static string ServiziSquadreUrl = "http://172.16.15.34:5000/api/Squadre";
        public static string ServiziComponentiUrl = "http://172.16.15.34:5000/api/Componenti";

        public static string IdentityManagementUrl = "http://172.16.15.34:5001/api/Personale";
    }
}
