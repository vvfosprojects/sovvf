using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.FakePersistence.JSon.Utility
{
    public class ControlliSuMappa
    {
        public static bool GetIsCompresoNelPoligono(Coordinate[] poly, Coordinate point)
        {
            var coef = poly.Skip(1).Select((p, i) =>
                                            (point.Latitudine - poly[i].Latitudine) * (p.Longitudine - poly[i].Longitudine)
                                          - (point.Longitudine - poly[i].Longitudine) * (p.Latitudine - poly[i].Latitudine))
                                    .ToList();

            if (coef.Any(p => p == 0))
                return true;

            for (int i = 1; i < coef.Count(); i++)
            {
                if (coef[i] * coef[i - 1] < 0)
                    return false;
            }
            return true;
        }
    }
}
