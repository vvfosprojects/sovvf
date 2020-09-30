namespace SO115App.Models.Servizi.Infrastruttura.InfoRichiesta
{
    public interface IGetInfoRichiesta
    {
        API.Models.Classi.Marker.InfoRichiesta GetInfoRichiestaFromIdRichiestaMezzo(string idRichiesta);

        API.Models.Classi.Marker.InfoRichiesta GetInfoRichiestaFromCodiceRichiestaMezzo(string CodiceRichiesta);
    }
}
