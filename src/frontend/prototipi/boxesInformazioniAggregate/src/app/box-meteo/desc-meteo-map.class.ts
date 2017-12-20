export class DescMeteoMap {
    private dict;

    constructor() {
        this.dict = {};
        this.dict["Sereno"] = "Sereno";
        this.dict["Nuvoloso"] = "Nuvoloso";
        this.dict["Pioggia"] = "Pioggia";
        this.dict["Temporali"] = "Temporali";
        this.dict["Neve"] = "Neve";
    }
    public map(descMeteo: string): string {
        return this.dict[descMeteo];
    }
}
