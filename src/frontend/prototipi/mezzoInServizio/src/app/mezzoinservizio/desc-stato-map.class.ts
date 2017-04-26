export class DescStatoMap {
    private dict;

    constructor() {
        this.dict = {};
        this.dict["InSede"] = "In sede";
        this.dict["InViaggio"] = "In viaggio";
        this.dict["SulPosto"] = "Sul posto";
        this.dict["InRientro"] = "In Rientro";
        this.dict["FuoriServizio"] = "Fuori Servizio";
        ///qui tutti gli altri stati
    }
    public map(codiceStato: string): string {
        return this.dict[codiceStato];
    }
}
