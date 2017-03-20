using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using RestInterface.Models;

namespace RestInterface.Controllers
{
    public class ProvaController : ApiController
    {
        public string GetRisposta(string chiSei)
        {
            return "Ciao " + chiSei;
        }

        public Distanza CalcolaDistanza(CoppiaDiPunti c)
        {
            var stopwatch = new Stopwatch();
            stopwatch.Start();
            var p1 = c.P1;
            var p2 = c.P2;
            var distanza = Math.Sqrt(Math.Pow(p2.X - p1.X, 2) + Math.Pow(p2.Y - p1.Y, 2));
            stopwatch.Stop();
            var elapsedmsec = stopwatch.ElapsedMilliseconds;

            return new Distanza()
            {
                DistanzaCalcolata = distanza,
                Millisecondi = (int)elapsedmsec
            };
        }
    }
}
