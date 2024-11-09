import JobFilterSidebar from "@/components/jobFilterSidebar";
import JobResults from "@/components/jobResults";
import { JobFilterValues } from "@/lib/validation";
import { Metadata } from "next";
import Footer from '@/components/footer'
import Navbar from '@/components/Navbar'
// Define the PageProps interface for component props
interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
    page?: string;
  };
}

// Helper function to generate the page title based on filters
function getTitle({ q, type, location, remote }: JobFilterValues): string {
  const titlePrefix = q
    ? `${q} jobs`
    : type
    ? `${type} developer jobs`
    : remote
    ? "Remote developer jobs"
    : "All developer jobs";
  const titleSuffix = location ? ` in ${location}` : "";
  return `${titlePrefix}${titleSuffix}`;
}

// Generate metadata for the page based on search parameters
export function generateMetadata({
  searchParams: { q, type, location, remote },
}: PageProps): Metadata {
  return {
    title: `${getTitle({
      q,
      type,
      location,
      remote: remote === "true",
    })} | Dev Naukri`,
  };
}

// Main page component
export default async function Home({
  searchParams: { q, type, location, remote, page },
}: PageProps) {
  const filterValues: JobFilterValues = {
    q,
    type,
    location,
    remote: remote === "true",
  };

  return (
    <main className="m-auto   space-y-10 bg-gray-900 text-white  min-h-full w-full ">
      <Navbar/>
      <div className="space-y-5 text-center">
        <h1>{getTitle(filterValues)}</h1>
        <p className="text-muted-foreground bg-gray-900 text-white ">Black & White that can fill colours</p>
      </div>
      <section className="flex flex-col gap-4 md:flex-row bg-gray-900 text-white ">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobResults filterValues={filterValues} page={page ? parseInt(page) : undefined} />
      </section>
      <Footer/>
    </main>
  );
}
