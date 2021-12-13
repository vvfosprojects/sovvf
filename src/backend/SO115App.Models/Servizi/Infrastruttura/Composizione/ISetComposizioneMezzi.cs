using SO115App.API.Models.Classi.Composizione;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.Composizione
{
    public interface ISetComposizioneMezzi
    {
        void Set(List<ComposizioneMezzi> mezzi);
    }
}
