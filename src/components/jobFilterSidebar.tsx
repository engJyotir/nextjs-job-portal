import { jobTypes } from "@/lib/job-types";
import prisma from "@/lib/prisma";
import { JobFilterValues, jobFilterSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./formsubmitbutton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import Image from 'next/image';
import logo from '@/assets/QR.png';

async function filterJobs(formData: FormData) {
  "use server";
  const values = Object.fromEntries(formData.entries());
  const { q, type, location, remote } = jobFilterSchema.parse(values);
  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });
  redirect(`/?${searchParams.toString()}`);
}

interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}

export default async function JobFilterSidebar({
  defaultValues,
}: JobFilterSidebarProps) {
  const distinctLocations = (await prisma?.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <aside className="lg:sticky top-0 h-fit rounded-lg bg-gray-900 text-gray-200 p-4 border-r border-gray-700 shadow-lg">
      <form action={filterJobs} key={JSON.stringify(defaultValues)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q" className="text-gray-400">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues?.q}
              className="bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type" className="text-gray-400">Type</Label>
            <Select
              id="type"
              name="type"
              defaultValue={defaultValues?.type || ""}
              className="bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500/20"
            >
              <option value="" className="bg-gray-800 text-gray-200">All types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type} className="bg-gray-800 text-gray-200">
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location" className="text-gray-400">Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultValues?.location || ""}
              className="bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500/20"
            >
              <option value="" className="bg-gray-800 text-gray-200">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location} className="bg-gray-800 text-gray-200">
                  {location}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-blue-500 bg-gray-800 text-gray-200 border border-gray-700 rounded focus:ring focus:ring-blue-500/20"
              defaultChecked={defaultValues?.remote}
            />
            <Label htmlFor="remote" className="text-gray-400">Remote jobs</Label>
          </div>
        </div>

        <div className="bg-gray-800 p-2 rounded-lg shadow-md">
          <FormSubmitButton className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md transition-colors duration-200 ease-in-out">
            Filter jobs
          </FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
