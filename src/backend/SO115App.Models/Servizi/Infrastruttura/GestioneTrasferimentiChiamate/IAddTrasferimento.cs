﻿using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate
{
    public interface IAddTrasferimento
    {
        void Add(TrasferimentoChiamata trasferimento, RichiestaAssistenza richiesta);
    }
}
