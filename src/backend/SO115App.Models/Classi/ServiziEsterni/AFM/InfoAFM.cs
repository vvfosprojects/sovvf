using SO115App.Models.Classi.ServiziEsterni.Utility;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Classi.ServiziEsterni.AFM
{
    public class InfoAFM
    {
        public string requestKey { get; set; } = null;
        public string description { get; set; } = null;
        public DateTime datetime { get; set; } = default;
        public string locality { get; set; } = null;
        public decimal lat { get; set; } = 0;
        public decimal lng { get; set; } = 0;
        public string requestType { get; set; } = null;
        public string remarks { get; set; } = null;
        public string onSiteContact { get; set; } = null;
        public string onSiteContactPhoneNumber { get; set; } = null;
        public bool areReliableCoordinates { get; set; } = false;
        public string operatorName { get; set; } = null;
        public string operatorSurname { get; set; } = null;
        public string operatorFiscalCode { get; set; } = null;
        public string venueInCharge { get; set; } = null;
        public string progressiveNumber { get; set; } = null;
        public List<Activity> activities { get; set; } = null;


        //ERRORI
        public List<Errore> errors { get; set; } = null;

        public bool IsError() => errors != null && errors.Count > 0;
        public string GetNoteEvento(string azione)
        {
            if (IsError())
                return azione + " soccorso AFM fallito: " + string.Concat(errors.Select(e => MapErrorsAFM.Map(e) + ". ")).TrimEnd();
            else
                return azione + " soccorso AFM accettato: " + activities.Last().activityStatusType;
        }
        public string GetTargaEvento() => activities?.Last().aircraft.regMark ?? "";
    }

    public class Errore
    {
        public string code { get; set; }
        public string detail { get; set; }
    }

    public class Activity
    {
        public int activityID { get; set; } = 0;
        public string activityStatusType { get; set; } = null;
        public DateTime statusDatetime { get; set; } = default;
        public string department { get; set; } = null;
        public string acceptanceDatetime { get; set; } = null;
        public string takeoffDatetime { get; set; } = null;
        public string rescueArriveDatetime { get; set; } = null;
        public string rescueLeaveDatetime { get; set; } = null;
        public string landingDatetime { get; set; } = null;
        public Aircraft aircraft { get; set; } = null;

    }

    public class Aircraft
    {
        public string regMark { get; set; } = null;
        public double distance { get; set; } = 0;
        public int estimatedFlightTime { get; set; } = 0;
        public List<Category> rescueCategories { get; set; } = null;
    }

    public class Category
    {
        public string categoryName { get; set; } = null;
        public string categoryCode { get; set; } = null;
    }
}
