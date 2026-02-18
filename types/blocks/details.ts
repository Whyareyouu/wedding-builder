export interface IDetails {
  details: {
    detail: string;
    title?: string;
  }[];
  align: "center" | "left" | "right";
  title: string;
}
