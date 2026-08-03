import { Suspense } from "react";
import { HomeExperience } from "@/components/HomeExperience";

export default function HomePage() {
  return (
    <Suspense fallback={<main className="page" />}>
      <HomeExperience />
    </Suspense>
  );
}
