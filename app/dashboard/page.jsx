import Image from "next/image";
import Link from "next/link";
export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/">Home</Link>
      <h1>Dashboard</h1>
    </main>
  );
}
