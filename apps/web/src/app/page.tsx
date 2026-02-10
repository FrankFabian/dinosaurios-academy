import { helloFromShared } from "@shared/utils/hello";

export default function Home() {
  return <p>{helloFromShared()}</p>;
}