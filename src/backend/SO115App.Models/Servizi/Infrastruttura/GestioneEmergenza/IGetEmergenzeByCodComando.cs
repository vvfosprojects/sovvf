﻿using SO115App.Models.Classi.Emergenza;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza
{
    public interface IGetEmergenzeByCodComando
    {
        List<Emergenza> Get(string codComando);
    }
}
