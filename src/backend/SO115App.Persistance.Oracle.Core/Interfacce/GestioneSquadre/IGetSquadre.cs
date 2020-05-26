using SO115App.Persistence.Oracle.Core.Classi;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistance.Oracle.Core.Interfacce.GestioneSquadre
{
    public interface IGetSquadre
    {
        List<ORAGesPreaccoppiati> GetListaGesPreaccoppiati(string CodSede);
        ORASquadre GetSquadraByCodSquadra(string CodSede, decimal CodSquadra);
        List<ORASquadre> GetListaSquadre(string CodSede);
        ORASQPersonaleSquadre GetSQPersonaleSquadreByCodSquadra(string CodSede, decimal CodSquadra);
        List<ORASQPersonaleSquadre> GetListaSQPersonaleSquadre(string CodSede);
        ORAPersonaleSquadre GetPersonaleSquadraByCodSquadra(string CodSede, decimal CodSquadra);
        List<ORAPersonaleSquadre> GetListaPersonaleSquadre(string CodSede);

    }
}
