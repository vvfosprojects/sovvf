using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Utility
{
    public class MapMezzoDTOsuMezzo
    {
        private readonly IGetPosizioneByCodiceMezzo _getPosizioneByCodiceMezzo;

        public MapMezzoDTOsuMezzo(IGetPosizioneByCodiceMezzo getPosizioneByCodiceMezzo)
        {
            _getPosizioneByCodiceMezzo = getPosizioneByCodiceMezzo;
        }

        public List<Mezzo> MappaMezzoDTOsuMezzo(List<MezzoDTO> listaMezzoDTO)
        {
            var listaMezzi = new List<Mezzo>();
            foreach (var mezzoDTO in listaMezzoDTO)
            {
                var coordinateMezzo = _getPosizioneByCodiceMezzo.Get(mezzoDTO.Codice);
                var coordinate = new Coordinate(coordinateMezzo.Localizzazione.Lat, coordinateMezzo.Localizzazione.Lon);
                var mezzo = new Mezzo(mezzoDTO.Codice, mezzoDTO.Descrizione, mezzoDTO.Genere, mezzoDTO.Movimentazione.StatoOperativo, mezzoDTO.Appartenenza, mezzoDTO.Distaccamento, coordinate)
                {
                    StatoEfficenza = mezzoDTO.StatoEfficenza,
                    DestinazioneUso = mezzoDTO.DestinazioneUso,
                };
                listaMezzi.Add(mezzo);
            }
            return listaMezzi;
        }
    }
}
