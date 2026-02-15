interface ColorSchemaItem {
  color: string;
  maleDressCodeImg: string;
  femaleDressCodeImg: string;
}

export interface IDressCode {
  title: string;
  colorSchema: ColorSchemaItem[];
}
