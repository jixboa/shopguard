import Dashboard from "./components/dashboard";

export const runtime = "edge";

export default async function Home() {
  return (
    <>
      <div className="mt-16 mb-20">
        <Dashboard />
      </div>
    </>
  );
}
