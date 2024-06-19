import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jumbaya",
  description: "next app",
};

export default function Home() {
  return (
    <main className="text-center p-2 flex justify-center items-center flex-col">
      <h2 className="text-6xl p-2 m-2">
        Learning usage of @tanstack/react-query in express-app
      </h2>
      
      <Link href="/config" className="rounded-md p-2 m-2 bg-blue-300">
        Go to Config Data
      </Link>
      
    </main>
  );
}
