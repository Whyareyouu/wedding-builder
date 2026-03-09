export interface ColorSchemaItem {
  id: string;
  color?: string;
  colorImage?: string;
  maleDressCodeImg?: string;
  femaleDressCodeImg?: string;
  onlyForMale?: boolean;
  onlyForFemale?: boolean;
}

export interface IDressCode {
  title: string;
  colorSchema: ColorSchemaItem[];
}
