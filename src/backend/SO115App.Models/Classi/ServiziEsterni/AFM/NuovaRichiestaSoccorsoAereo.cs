using System;

namespace SO115App.Models.Classi.ServiziEsterni.AFM
{
    public class NuovaRichiestaSoccorsoAereo
    {
        public string requestKey { get; set; }
        public DateTime datetime { get; set; }
        public string description { get; set; } = "";
        public string requestTypeCode { get; set; } = "";
        public string requestType { get; set; } = "";
        public decimal lat { get; set; }
        public decimal lng { get; set; }
        public string onSiteContact { get; set; } = "";
        public string onSiteContactPhoneNumber { get; set; } = "";
        public string remarks { get; set; } = "";
        public string[] rescueCategories { get; set; } = new string[] { "" };
        public string locality { get; set; } = "";
        public string operatorName { get; set; }
        public string operatorSurname { get; set; }
        public string operatorFiscalCode { get; set; }

        public string venueInCharge { get; set; } = "";
        public string progressiveNumber { get; set; } = "";
        public bool areReliableCoordinates { get; set; } = false;
    }
}
