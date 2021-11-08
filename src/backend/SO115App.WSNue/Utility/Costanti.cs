using System;

namespace SO115App.WSNue.Utility
{
    public class Costanti
    {
        public const string NUE_NAME_SPASE_SERVICE_CONTRACT = "http://entiservice.ws.nue.gov.it/";
        public const string NUE_NAME_SPACE = "http://NUE.112.it/NUE112";
        public readonly static string NUE_XSD_DIRECTORY = AppDomain.CurrentDomain.BaseDirectory + @"XSD\";
        public readonly static string XSD_INSERIMENTO_SCHEDA_NUE = NUE_XSD_DIRECTORY + "EMMA_SF_NUE112_SchedaContatto-Rev3.xsd";
    }
}
