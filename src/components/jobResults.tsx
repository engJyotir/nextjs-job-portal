import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import JobListItem from "./JoblistItem";

interface JobResultsProps {
    filterValues: JobFilterValues;
    page?: number;
}

export default async function JobResults({
    filterValues,
    page = 1,
}: JobResultsProps) {
    const { q, type, location, remote } = filterValues;
    const jobsPerPage = 6;
    const skip = (page - 1) * jobsPerPage;

    const searchString = q
        ?.split(" ")
        .filter((word) => word.length > 0)
        .join(" & ");

    const searchFilter: Prisma.JobWhereInput = searchString
        ? {
            OR: [
                { title: { search: searchString } },
                { companyName: { search: searchString } },
                { type: { search: searchString } },
                { locationType: { search: searchString } },
                { location: { search: searchString } },
            ],
        }
        : {};

    const where: Prisma.JobWhereInput = {
        AND: [
            searchFilter,
            type ? { type } : {},
            location ? { location } : {},
            remote ? { locationType: "Remote" } : {},
            { approved: true },
        ],
    };

    const jobsPromise = prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: jobsPerPage,
        skip,
    });
    const countPromise = prisma.job.count({ where });

    const [jobs, totalResults] = await Promise.all([jobsPromise, countPromise]);

    return (
        <div className="grow space-y-6 bg-gray-900 text-gray-200 p-6 rounded-lg shadow-lg">
            {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
                    <div className="p-4 bg-gray-800 rounded-md hover:bg-gray-700 border border-gray-700 transition duration-200 ease-in-out">
                        <JobListItem job={job} />
                    </div>
                </Link>
            ))}
            {jobs.length === 0 && (
                <p className="text-center text-gray-400">
                    No jobs found. Try adjusting your search filters.
                </p>
            )}
            {jobs.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(totalResults / jobsPerPage)}
                    filterValues={filterValues}
                />
            )}
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    filterValues: JobFilterValues;
}

function Pagination({
    currentPage,
    totalPages,
    filterValues: { q, type, location, remote },
}: PaginationProps) {
    function generatePageLink(page: number) {
        const searchParams = new URLSearchParams({
            ...(q && { q }),
            ...(type && { type }),
            ...(location && { location }),
            ...(remote && { remote: "true" }),
            page: page.toString(),
        });
        return `/?${searchParams.toString()}`;
    }

    return (
        <div className="flex justify-center items-center space-x-6 mt-8 text-gray-400">
            <Link
                href={generatePageLink(currentPage - 1)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 font-semibold rounded-md bg-gray-800 hover:bg-gray-700 text-blue-400 transition duration-200 ease-in-out",
                    currentPage <= 1 && "invisible",
                )}
            >
                <ArrowLeft size={16} />
                Previous
            </Link>
            <span className="font-semibold text-gray-300">
                Page {currentPage} of {totalPages}
            </span>
            <Link
                href={generatePageLink(currentPage + 1)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 font-semibold rounded-md bg-gray-800 hover:bg-gray-700 text-blue-400 transition duration-200 ease-in-out",
                    currentPage >= totalPages && "invisible",
                )}
            >
                Next
                <ArrowRight size={16} />
            </Link>
        </div>
    );
}
