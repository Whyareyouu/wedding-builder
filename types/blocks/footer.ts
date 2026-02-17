type GenderConfig = {
  maleEnding: string; // например "ой"
  femaleEnding: string; // например "ая"
  pluralText: string; // например "дорогие"
  singleBase: string; // например "дорог"
};

export interface IFooter {
  baseText?: string; // например "До встречи"
  genderConfig?: GenderConfig;
  disableGenderEnding?: boolean; // если true — всегда одинаковая форма
  alwaysText?: string; // если нужно полностью переопределить обращение
  pairSeparator?: string; // например " & "
}
