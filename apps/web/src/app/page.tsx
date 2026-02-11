import { helloFromShared } from "@shared/utils/hello";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


const session = await getServerSession(authOptions);
console.log(session?.user.role);


export default function Home() {
  return <p>{helloFromShared()}</p>;
}