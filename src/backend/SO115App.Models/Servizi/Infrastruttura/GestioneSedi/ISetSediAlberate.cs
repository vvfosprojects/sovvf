using SO115App.API.Models.Classi.Organigramma;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSedi
{
    public interface ISetSediAlberate
    {
        void Set(UnitaOperativa unitaOperativa);
    }
}
