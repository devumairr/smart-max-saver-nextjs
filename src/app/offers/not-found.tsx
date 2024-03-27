import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-8">
      <h2>Offer Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
