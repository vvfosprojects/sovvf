using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.ServiziEsterni.AFM
{
    public class StoricoAFM
    {
        public string RequestKey { get; set; }
        public string Description { get; set; }
        public DateTime Datetime { get; set; }
        public string Locality { get; set; }
        public decimal Lat { get; set; }
        public decimal Lng { get; set; }
        public string RequestType { get; set; }
        public string Remarks { get; set; }
        public string OnSiteContact { get; set; }
        public string OnSiteContactPhoneNumber { get; set; }
        public bool AreReliableCoordinates { get; set; }
        public string OperatorName { get; set; }
        public string OperatorSurname { get; set; }
        public string OperatorFiscalCode { get; set; }
        public string VenueInCharge { get; set; }
        public string ProgressiveNumber { get; set; }
        public List<EventoAFM> Events { get; set; }
    }

    public class EventoAFM
    {
        public int ActivityID { get; set; }
        public string Event { get; set; }
        public DateTime StatusDatetime { get; set; }
        public string ActivityStatusType { get; set; }
        public string Department { get; set; }
        public string Aircraft { get; set; }
        public string OperatorName { get; set; }
        public string OperatorSurname { get; set; }
    }
}
