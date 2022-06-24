using SO115App.Models.Classi.ServiziEsterni.Utility;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Classi.ServiziEsterni.AFM
{
    public class InfoAFM
    {
        public string RequestKey { get; set; } = null;
        public string Description { get; set; } = null;
        public DateTime Datetime { get; set; } = default;
        public string Locality { get; set; } = null;
        public decimal Lat { get; set; } = 0;
        public decimal Lng { get; set; } = 0;
        public string RequestType { get; set; } = null;
        public string Remarks { get; set; } = null;
        public string OnSiteContact { get; set; } = null;
        public string OnSiteContactPhoneNumber { get; set; } = null;
        public bool AreReliableCoordinates { get; set; } = false;
        public string OperatorName { get; set; } = null;
        public string OperatorSurname { get; set; } = null;
        public string OperatorFiscalCode { get; set; } = null;
        public string VenueInCharge { get; set; } = null;
        public string ProgressiveNumber { get; set; } = null;
        public List<Activity> Activities { get; set; } = null;

        //ERRORI
        public List<Errore> errors { get; set; } = null;

        public bool IsError() => errors != null && errors.Count > 0;

        public string GetNoteEvento(string azione)
        {
            if (IsError())
                return azione + " soccorso AFM fallito: " + string.Concat(errors.Select(e => MapErrorsAFM.Map(e) + ". ")).TrimEnd();
            else
                return azione + " soccorso AFM accettato: " + Activities.Last().ActivityStatusType;
        }

        public string GetTargaEvento() => Activities?.Last().Aircraft.RegMark ?? "";
    }

    public class Errore
    {
        public string code { get; set; }
        public string detail { get; set; }
    }

    public class Activity
    {
        public int ActivityID { get; set; } = 0;
        public string ActivityStatusType { get; set; } = null;
        public DateTime StatusDatetime { get; set; } = default;
        public string Department { get; set; } = null;
        public string AcceptanceDatetime { get; set; } = null;
        public string TakeoffDatetime { get; set; } = null;
        public string RescueArriveDatetime { get; set; } = null;
        public string RescueLeaveDatetime { get; set; } = null;
        public string LandingDatetime { get; set; } = null;
        public Aircraft Aircraft { get; set; } = null;
    }

    public class Aircraft
    {
        public string RegMark { get; set; } = null;
        public double Distance { get; set; } = 0;
        public int EstimatedFlightTime { get; set; } = 0;
        public List<Category> RescueCategories { get; set; } = null;
    }

    public class Category
    {
        public string CategoryName { get; set; } = null;
        public string CategoryCode { get; set; } = null;
    }
}
