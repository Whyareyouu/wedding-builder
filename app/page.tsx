import { InviteBuilder } from "@/components/shared/InviteBuilder";
import appConfig from "../configs/app-config.json";
import { IConfigApp } from "@/types/blocks/config";

export default function Home() {
  return <InviteBuilder config={appConfig as IConfigApp} />;
}
