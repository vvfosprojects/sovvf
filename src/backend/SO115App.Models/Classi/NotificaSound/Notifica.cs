using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Models.Classi.NotificaSound
{
    public class Notifica
    {
        public DataSound data { get; set; }

    }

    public class DataSound
    {
        public string title { get; set; }
        public string text { get; set; }
        public List<Button> buttons { get; set; }
        public string timeToClose { get; set; }

    }

    public class Button
    {
        public string bgColor { get; set; }
        public string text { get; set; }
    }

    //var avvisoNotifica = new
    //{
    //    data = new
    //    { 
    //        title = "",
    //        text = "",
    //        buttons = new [] 
    //        {
    //            new
    //            {
    //                bgColor = "",
    //                text = ""
    //            },
    //        },
    //        timeToClose = ""
    //    },
    //};
}
