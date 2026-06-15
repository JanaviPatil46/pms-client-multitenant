import React, { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { jobAPI } from "../../services/api";

const ClientFacingJobs = ({ accountId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await jobAPI.getJobsByAccount(accountId, true);

      const visibleJobs =
        res?.data?.jobList?.filter(
          (job) => job.visibilityForClient === true
        ) || [];

      setJobs(visibleJobs);
      console.log("Fetched client-facing jobs:", visibleJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) fetchJobs();
  }, [accountId]);

  if (!loading && jobs.length === 0) return null;

  return (
    <div className="px-5 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Work in Progress</h3>
        <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {jobs.length}
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        // <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr">
        //   {jobs.map((job) => {
        //     const status = job?.ClientFacingStatus;

        //     return (
        //       <div
        //         key={job.id}
        //         className="group relative rounded-xl border bg-white p-4 shadow-sm 
        //                    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
        //                    flex flex-col justify-between min-h-[170px]"
        //       >
        //         {/* Status Row */}
        //         <div className="flex items-center justify-between mb-2">
        //           <div className="flex items-center gap-2">
        //             <span
        //               className="h-2 w-2 rounded-full"
        //               style={{
        //                 backgroundColor:
        //                   status?.statusColor || "#cbd5e1",
        //               }}
        //             />
        //             <span className="text-[11px] text-muted-foreground font-medium">
        //               {status?.statusName || "No Status"}
        //             </span>
        //           </div>

                 
        //         </div>

        //         {/* Title */}
        //         <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">
        //           {job.jobnameforclient || job.Name}
        //         </h4>

        //         {/* Description */}
        //         <div
        //           className="text-xs text-muted-foreground line-clamp-3 leading-relaxed"
        //           dangerouslySetInnerHTML={{
        //             __html: job.Description || "",
        //           }}
        //         />

           
                
        //       </div>
        //     );
        //   })}
        // </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr">
  {jobs.map((job) => {
    const status = job?.ClientFacingStatus;

    return (
      <div
        key={job.id}
        className="group relative rounded-2xl border bg-white p-4 shadow-sm 
                   hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                   flex flex-col justify-between min-h-[200px]"
      >
        {/* Header: Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: status?.statusColor || "#cbd5e1",
              }}
            />
            <span className="text-[11px] font-semibold tracking-wide text-gray-600 uppercase">
              {status?.statusName || "No Status"}
            </span>
          </div>
        </div>

        {/* Title */}
      <h3
  className="text-[15px] font-semibold text-gray-900 leading-snug transition-colors whitespace-normal break-words"
>
  {job.jobnameforclient?.trim()
  ? job.jobnameforclient
  : job.Name}
</h3>

        {/* Description */}
       <div
  className="mt-2 text-xs text-gray-600 leading-relaxed
             prose prose-sm max-w-none
             [&_p]:mb-2 [&_p:last-child]:mb-0 whitespace-normal break-words"
  dangerouslySetInnerHTML={{
    __html: job.Description || "<p>No description available</p>",
  }}
/>

        {/* Footer subtle gradient (optional polish) */}
        {/* <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            Job ID: {job.id?.slice?.(-6)}
          </span>
        </div> */}
      </div>
    );
  })}
</div>
      )}
    </div>
  );
};

export default ClientFacingJobs;