export class DescMeteoMap {
    private dict;

    constructor() {
        this.dict = {};
        this.dict["Sereno"] = "Sereno";
        this.dict["PocoNuvoloso"] = "Poco Nuvoloso";
        this.dict["Coperto"] = "Coperto";
        this.dict["Nuvoloso"] = "Nuvoloso";
        this.dict["MoltoNuvoloso"] = "Molto Nuvoloso";
        this.dict["Pioggia"] = "Pioggia";
        this.dict["PioggiaSchiarite"] = "Pioggia e Schiarite";
        this.dict["Temporali"] = "Temporali";
        this.dict["Neve"] = "Neve";
    }
    public map(descMeteo: string): string {
        return this.dict[descMeteo];
    }
}
