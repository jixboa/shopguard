import { cookies } from "next/headers";
import { getTokenData } from "./utils/getTokenData";
import Dashboard from "./components/dashboard";

export default async function Home() {
  const cookieStore = await cookies();
  let token = await cookieStore.get("token");

  let useDetail = [];

  if (!token) {
    token = "";
  } else {
    token = token.value;
    useDetail = await getTokenData(token);
  }

  return (
    <>
      <div className="mt-16">
        <Dashboard {...useDetail} />
      </div>
    </>
  );
}
