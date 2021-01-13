using System;

namespace SO115App.Models.Classi.ServiziEsterni.AFM
{
    public class NuovaRichiestaSoccorsoAereo
    {
        public string RequestKey { get; set; }
        //{
        //    get => RequestKey; 

        //    set
        //    {
        //        if(RequestKey != null)
        //            RequestKey = 
        //                "CMD." + 
        //                value.Split('-', StringSplitOptions.RemoveEmptyEntries)[0] +
        //                "." +
        //                value.Split('-', StringSplitOptions.RemoveEmptyEntries)[2].TrimStart('0') +
        //                "." +
        //                value.Split('-', StringSplitOptions.RemoveEmptyEntries)[1];
        //    } 
        //}

        public string Description { get; set; }
        public string RequestTypeCode { get; set; }
        public string RequestType { get; set; }
        public decimal Lat { get; set; }
        public decimal Lng { get; set; }
        public string OnSiteContact { get; set; }
        public string OnSiteContactPhoneNumber { get; set; }
        public DateTime Datetime { get; set; }
        public string Remarks { get; set; }
        public string[] RescueCategories { get; set; }
        public string OperatorName { get; set; }
        public string OperatorSurname { get; set; }
        public string OperatorFiscalCode { get; set; }

        public string VenueInCharge { get; set; } = "";
        public string ProgressiveNumber { get; set; } = "";
        public bool AreReliableCoordinates { get; set; } = true;
        public bool IsConsultation { get; set; } = false;
    }
}
