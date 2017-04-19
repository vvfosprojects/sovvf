export class DescStatoMap {
    private dict;

    constructor() {
        this.dict = {};
        this.dict["InSede"] = "In sede";
        this.dict["InViaggio"] = "In viaggio";
        ///qui tutti gli altri stati
    }
    public map(codiceStato: string): string {
        return this.dict[codiceStato];
    }
}
