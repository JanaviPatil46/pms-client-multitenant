// import React, { useEffect, useState } from "react";
// import { DocusealForm } from "@docuseal/react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";


// const DocuSealMultiSigner = ({ accountId }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSlug, setSelectedSlug] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
//   const targetEmail = sessionStorage.getItem("email");

//   useEffect(() => {
//     const fetchSignatureList = async () => {
//       try {
//         const response = await fetch(
//           `https://snptaxes.com/signautrelist/${accountId}`
//         );
//         const result = await response.json();
//         console.log("Fetched signature submissions:", result);
//         setSubmissions(result);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching signature list:", error);
//         setLoading(false);
//       }
//     };

//     if (accountId) {
//       fetchSignatureList();
//     }
//   }, [accountId]);

//   const handleOpenDialog = (slug) => {
//     setSelectedSlug(slug);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setSelectedSlug(null);
//   };

//   const updateStatus = async (item, statusType, newValue) => {
//     try {
//       if (!item?.path) return alert("Invalid item selected");
//       console.log("Updating status for", item.path, statusType, newValue);
//       const body = {
//         targetPath: item.path,
//         status: { [statusType]: newValue },
//       };

//       const res = await fetch(
//         "https://www.snptaxes.com/api/accountsdoc/updateStatus",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         console.log("Status updated successfully:", data.message);
//       } else {
//         alert(data.error || "Failed to update status");
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Error updating status");
//     }
//   };

//   // Extract submitters that match the logged-in email AND are not completed
//   const matchingSubmitters = submissions
//     .flatMap((submission) =>
//       submission.submitters.map((s) => ({
//         slug: s.slug,
//         email: s.email,
//         submissionId: s.submission_id,
//         templateName: s.name,
//         createdAt: submission.createdAt,
//         fileUrl: submission.fileUrl,
//         externalId: submission.externalId,
//         submissionData: submission,
//         status: s.status,
//         completed_at: s.completed_at,
//         role: s.role,
//         allCompleted: submission.submitters.every(
//           (submitter) =>
//             submitter.status === "completed" || submitter.completed_at !== null
//         ),
//       }))
//     )
//     .filter((s) => s.email === targetEmail && !s.completed_at);

//   console.log("matchingSubmitters", matchingSubmitters);

//   if (loading) return <p>Loading...</p>;

//   // Show all documents related to the user with their status
//   const allUserSubmissions = submissions
//     .flatMap((submission) =>
//       submission.submitters.map((s) => ({
//         slug: s.slug,
//         email: s.email,
//         submissionId: s.submission_id,
//         templateName: s.name,
//         createdAt: submission.createdAt,
//         fileUrl: submission.fileUrl,
//         externalId: submission.externalId,
//         status: s.status,
//         completed_at: s.completed_at,
//         role: s.role,
//         allCompleted: submission.submitters.every(
//           (submitter) =>
//             submitter.status === "completed" || submitter.completed_at !== null
//         ),
//         totalSubmitters: submission.submitters.length,
//         completedCount: submission.submitters.filter(
//           (sub) => sub.status === "completed" || sub.completed_at !== null
//         ).length,
//       }))
//     )
//     .filter((s) => s.email === targetEmail);

//   return (
//     <>
//       <Box>
//         {/* Pending Signatures */}
//         {matchingSubmitters.length > 0 && (
//           <>
//             <Typography
//               component="h2"
//               variant="subtitle2"
//               gutterBottom
//               sx={{ fontWeight: "600" }}
//             >
//               Documents
//             </Typography>
//             <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
//               Pending Your Signature ({matchingSubmitters.length})
//             </Typography>
//             <Box
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: "20px",
//                 marginTop: "5px",
//               }}
//             >
//               {matchingSubmitters.map((s, index) => (
//                 <Card key={index} style={{ minWidth: 200 }}>
//                   <CardContent>
//                     <Typography variant="body2">
//                       Template: {s.templateName}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Role: {s.role}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Progress:{" "}
//                       {
//                         s.submissionData.submitters.filter(
//                           (sub) => sub.completed_at
//                         ).length
//                       }{" "}
//                       of {s.submissionData.submitters.length} signed
//                     </Typography>
//                     <br />
//                     <Button
//                       size="small"
//                       color="primary"
//                       onClick={() => handleOpenDialog(s.slug)}
//                       sx={{
//                         backgroundColor: "text.menu",
//                         color: "primary.contrastText",
//                         "&:hover": {
//                           backgroundColor: "menu.dark",
//                         },
//                         transition: "background-color 0.2s ease",
//                       }}
//                     >
//                       Review and Sign
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </Box>
//           </>
//         )}

//         <Box
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "20px",
//             marginTop: "5px",
//           }}
//         >
//           {allUserSubmissions.map((s, index) => (
//             <Card key={index} style={{ minWidth: 200 }}>
//               <CardContent>
//                 <Typography variant="body2">
//                   Template: {s.templateName}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Your Status: {s.completed_at ? "✓ Signed" : "⏳ Pending"}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Overall:{" "}
//                   {s.allCompleted
//                     ? "✓ All Signed"
//                     : ` ${s.completedCount}/${s.totalSubmitters} signed`}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Role: {s.role}
//                 </Typography>
//                 {s.completed_at && (
//                   <Typography variant="body2" color="success.main">
//                     ✓ Document Updated with Your Signature
//                   </Typography>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </Box>

//         <Dialog
//           open={dialogOpen}
//           onClose={handleCloseDialog}
//           fullWidth
//           maxWidth="lg"
//         >
//           <DialogTitle>
//             Signing Form
//             <IconButton
//               aria-label="close"
//               onClick={handleCloseDialog}
//               sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>

//           <DialogContent dividers>
//             {selectedSlug && (
//               <DocusealForm
//                 src={`https://docuseal.com/s/${selectedSlug}`}
//                 email={targetEmail}
//                 onComplete={async (data) => {
//                   console.log("Post-sign data:", data);

//                   try {
//                     // 1️⃣ Update this specific submitter's status and replace document
//                     const updateSubmitterRes = await fetch(
//                       `${SIGNATURE_API}/signautrelist/update-submitter/${data.template.external_id}`,
//                       {
//                         method: "PATCH",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                           submitterEmail: targetEmail,
//                           submissionId: data.submission_id,
//                         }),
//                       }
//                     );

//                     const updateData = await updateSubmitterRes.json();
//                     console.log("Update data after signing:", updateData);
//                     if (updateData.success) {
//                       console.log("✅ Document replaced with latest signature");

//                       // 2️⃣ Check if ALL submitters have now completed
//                       if (updateData.allCompleted) {
//                         console.log(
//                           "🎉 All submitters have completed signing!"
//                         );

//                         // Extract parent folder path
//                         const fullPath = decodeURIComponent(
//                           updateData.esignRecord.fileUrl.split(
//                             "/uploads/accounts/"
//                           )[1]
//                         );
//                         const parentFolderPath = fullPath
//                           .split("/")
//                           .slice(0, -1)
//                           .join("/");

//                         // 3️⃣ Update the final status only when ALL have signed
//                         await updateStatus(
//                           { path: fullPath },
//                           "signStatus",
//                           "signatureCompleted"
//                         );

//                         // 4️⃣ Notify admin
//                         await fetch(`${SIGNATURE_API}/notify-admin`, {
//                           method: "POST",
//                           headers: { "Content-Type": "application/json" },
//                           body: JSON.stringify({
//                             clientName: targetEmail,
//                             documentName: selectedSlug,
//                             message: "All parties have completed signing",
//                             accountId: accountId
//                           }),
//                         });

//                         alert(
//                           "All signatures completed! Document has been fully executed."
//                         );
//                       } else {
//                         console.log(
//                           `✅ You have signed. Document updated. Waiting for ${updateData.pendingCount} more signer(s).`
//                         );
//                         alert(
//                           `Thank you for signing! Document has been updated. Waiting for ${updateData.pendingCount} more signer(s) to complete.`
//                         );
//                       }
//                     } else {
//                       alert("Error updating signature status.");
//                     }
//                   } catch (err) {
//                     console.error("Error handling post-sign actions", err);
//                     alert("Error while updating sign status.");
//                   }

//                   handleCloseDialog();
//                   // Refresh the data
//                    window.location.reload();
//                 }}
//               />
//             )}
//           </DialogContent>
//         </Dialog>
//       </Box>
//     </>
//   );
// };
// export default DocuSealMultiSigner;


import React, { useEffect, useState } from "react";
import { DocusealForm } from "@docuseal/react";
import { accountDocsAPI } from "../../services/api";
const DocuSealMultiSigner = ({ accountId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
  const targetEmail = sessionStorage.getItem("email");

  useEffect(() => {
    const fetchSignatureList = async () => {
      try {
        const response = await fetch(
          `https://snptaxes.com/signautrelist/${accountId}`
        );
        const result = await response.json();
        setSubmissions(result);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (accountId) fetchSignatureList();
  }, [accountId]);

  const handleOpenDialog = (slug) => {
    setSelectedSlug(slug);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSlug(null);
  };

  const updateStatus = async (item, statusType, newValue) => {
  console.log("item", item, statusType, newValue);

  try {
    const body = {
      targetPath: item.path,
      status: { [statusType]: newValue },
    };

    const res = await accountDocsAPI.updateStatus(body);

    console.log("response", res);

    // ✅ Axios success check
    if (res.status !== 200) {
      alert("Failed to update status");
      return;
    }

    console.log("Status updated successfully");
  } catch (err) {
    console.error(err);
    console.log("status failed error", err);

    alert("Something went wrong");
  }
};

  const matchingSubmitters = submissions
    .flatMap((submission) =>
      submission.submitters.map((s) => ({
        ...s,
        templateName: s.name,
        submissionData: submission,
      }))
    )
    .filter((s) => s.email === targetEmail && !s.completed_at);

  const allUserSubmissions = submissions
    .flatMap((submission) =>
      submission.submitters.map((s) => ({
        ...s,
        templateName: s.name,
        totalSubmitters: submission.submitters.length,
        completedCount: submission.submitters.filter(
          (sub) => sub.completed_at
        ).length,
        allCompleted: submission.submitters.every(
          (sub) => sub.completed_at
        ),
      }))
    )
    .filter((s) => s.email === targetEmail);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      {/* 🔹 Pending Signatures */}
      {matchingSubmitters.length > 0 && (
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
              Documents
            </span>

            <span className="ml-auto text-[11px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
              {matchingSubmitters.length}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {matchingSubmitters.map((s, index) => (
              <div
                key={index}
                onClick={() => handleOpenDialog(s.slug)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-gray-800">
                    Review and Sign
                  </p>

                  <p className="text-[12px] text-gray-500 truncate mt-0.5">
                    {s.templateName}
                  </p>

                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {s.submissionData.submitters.filter(
                      (sub) => sub.completed_at
                    ).length}{" "}
                    of {s.submissionData.submitters.length} signed • {s.role}
                  </p>
                </div>

                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 All Documents */}
      {/* <div className="px-5 py-3">
        <div className="flex flex-col gap-1.5">
          {allUserSubmissions.map((s, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-gray-800">
                  {s.templateName}
                </p>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  {s.completed_at ? "✓ Signed" : "⏳ Pending"} • {s.role}
                </p>

                <p className="text-[11px] text-gray-400">
                  {s.allCompleted
                    ? "✓ All Signed"
                    : `${s.completedCount}/${s.totalSubmitters} signed`}
                </p>

                {s.completed_at && (
                  <p className="text-[11px] text-green-600 mt-0.5">
                    ✓ Document updated with your signature
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* 🔹 Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
          <div className="bg-white w-[95%] max-w-5xl rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-sm">Signing Form</h3>
              <button onClick={handleCloseDialog}>✕</button>
            </div>

            {/* Content */}
            <div className="h-[80vh] overflow-auto">
              {selectedSlug && (
                <DocusealForm
                  src={`https://docuseal.com/s/${selectedSlug}`}
                  email={targetEmail}
                  onComplete={async (data) => {
                    try {
                      const updateSubmitterRes = await fetch(
                        `${SIGNATURE_API}/signautrelist/update-submitter/${data.template.external_id}`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            submitterEmail: targetEmail,
                            submissionId: data.submission_id,
                          }),
                        }
                      );

                      const updateData = await updateSubmitterRes.json();

                      if (updateData.success) {
                        if (updateData.allCompleted) {
                          const fullPath = decodeURIComponent(
                            updateData.esignRecord.fileUrl.split(
                              "/uploads/accounts/"
                            )[1]
                          );

                          await updateStatus(
                            { path: fullPath },
                            "signStatus",
                            "signatureCompleted"
                          );

                          await fetch(`${SIGNATURE_API}/notify-admin`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              clientName: targetEmail,
                              documentName: selectedSlug,
                              message:
                                "All parties have completed signing",
                              accountId,
                            }),
                          });

                          alert("All signatures completed!");
                        } else {
                          alert(
                            `Waiting for ${updateData.pendingCount} more signer(s)`
                          );
                        }
                      }
                    } catch (err) {
                      console.error(err);
                    }

                    handleCloseDialog();
                    window.location.reload();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocuSealMultiSigner;