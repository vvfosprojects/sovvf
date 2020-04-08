using SO115App.API.Models.Classi.Marker;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.Models.Classi.Utility
{
    public static class GroupListaMezziMarker
    {
        public static List<MezzoMarker> Group(List<MezzoMarker> lista)
        {
            var listaGrouped = lista.GroupBy(x => new { x.Mezzo.Coordinate.Latitudine, x.Mezzo.Coordinate.Longitudine });

            string stringaConteggio;

            var listaMezziCompatta = new List<MezzoMarker>();

            foreach (var gruppo in listaGrouped)
            {
                if (gruppo.Count() > 1)
                {
                    var mezzoMarkerAggregato = gruppo.First();
                    stringaConteggio = $"Totale:{gruppo.Count().ToString()}";

                    foreach (var genere in gruppo.GroupBy(x => x.Mezzo.Genere))
                    {
                        stringaConteggio += ($"{genere.Key}:{genere.Count().ToString()}");
                    }
                    foreach (var stato in gruppo.GroupBy(x => x.Mezzo.Stato))
                    {
                        stringaConteggio += ($"{stato.Key}:{stato.Count().ToString()}");
                    }
                    mezzoMarkerAggregato.Conteggi = stringaConteggio;

                    listaMezziCompatta.Add(mezzoMarkerAggregato);
                }
                else
                {
                    listaMezziCompatta.Add(gruppo.FirstOrDefault());
                }
            }
            return listaMezziCompatta;
        }
    }
}
