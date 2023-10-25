import { getTokenData } from "./utils/getTokenData";
import Dashboard from "./components/dashboard";

export const runtime = "edge";

export default async function Home() {
  /*   
  let useDetail = [];

  if (!token) {
    token = "";
  } else {
    token = token.value;
    useDetail = await getTokenData(token);
  }
 */
  return (
    <>
      <div className="mt-16">
        <Dashboard />
      </div>
    </>
  );
}
