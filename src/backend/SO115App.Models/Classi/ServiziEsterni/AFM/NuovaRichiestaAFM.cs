﻿using System;

namespace SO115App.Models.Classi.ServiziEsterni.AFM
{
    public class NuovaRichiestaAFM
    {
        public string requestKey { get; set; } = null;
        public DateTime datetime { get; set; }
        public string description { get; set; } = "";
        public string requestTypeCode { get; set; } = "0";
        public string requestType { get; set; } = "";
        public decimal lat { get; set; }
        public decimal lng { get; set; }
        public string onSiteContact { get; set; } = "";
        public string onSiteContactPhoneNumber { get; set; } = "";
        public string remarks { get; set; } = "";
        public string locality { get; set; } = "";
        public string operatorName { get; set; }
        public string operatorSurname { get; set; }
        public string operatorFiscalCode { get; set; }

        public string venueInCharge { get; set; } = "";
        public string progressiveNumber { get; set; } = "0";
        public bool areReliableCoordinates { get; set; } = false;
    }
}
