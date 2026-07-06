import React, { useEffect, useState } from "react";
import { DocusealForm } from "@docuseal/react";
import { esignAPI, accountDocsAPI } from "../../services/api";
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
        const res = await esignAPI.getSignatureList(accountId);

        setSubmissions(res.data || []);
        console.log("Fetched submissions:", res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching signatures:", error);
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

  const updateStatus = async (
    item,
    statusType,
    newValue,
    action,
    reason = "",
    accountId,
    accountName
  ) => {
    try {
      if (!item?.path) return alert("Invalid item selected");
      const body = {
        targetPath: item.path,
        status: {
          [statusType]: newValue,
          ...(action === "cancel" && reason ? { cancelReason: reason } : {}),
        },
        accountId,
        accountName
      };
      const res = await accountDocsAPI.updateStatus(body);
      // ✅ Axios response
      const data = res.data;

      alert(data?.message || "Status updated successfully");
      // fetchFolderTree(accountId);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    }
  };
  const matchingSubmitters = submissions
    .flatMap((submission) =>
      submission.submitters.map((s) => ({
        ...s,
        templateName: s.name,
        submissionData: submission,
      })),
    )
    .filter((s) => s.email === targetEmail && !s.completed_at);

  const allUserSubmissions = submissions
    .flatMap((submission) =>
      submission.submitters.map((s) => ({
        ...s,
        templateName: s.name,
        totalSubmitters: submission.submitters.length,
        completedCount: submission.submitters.filter((sub) => sub.completed_at)
          .length,
        allCompleted: submission.submitters.every((sub) => sub.completed_at),
      })),
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
                    {
                      s.submissionData.submitters.filter(
                        (sub) => sub.completed_at,
                      ).length
                    }{" "}
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
  console.log("Post-sign data:", data);

  try {
    // ✅ 1. Update submitter status (API.js)
    const updateSubmitterRes = await esignAPI.updateSubmitterStatus(
      data.template.external_id,
      {
        submitterEmail: targetEmail,
        submissionId: data.submission_id,
      }
    );

    const updateData = updateSubmitterRes.data;

    if (updateData.success) {
      console.log("✅ Document replaced with latest signature");

      if (updateData.allCompleted) {
        console.log("🎉 All submitters have completed signing!");

        const fullPath = decodeURIComponent(
          updateData.esignRecord.fileUrl.split("/uploads/accounts/")[1]
        );

        console.log("Full file path:", fullPath);

        // ✅ 2. Update status via API.js
        await updateStatus(
          { path: fullPath ,accountId: accountId, accountName: accountName},
          "signStatus",
          "signatureCompleted"
        );

        // ✅ 3. Notify admin via API.js
        await esignAPI.notifyAdmin({
          clientName: targetEmail,
          documentName: selectedSlug,
          message: "All parties have completed signing",
          accountId: accountId,
        });

        alert("All signatures completed! Document has been fully executed.");
      } else {
        console.log(
          `✅ You have signed. Waiting for ${updateData.pendingCount} more signer(s).`
        );

        alert(
          `Thank you for signing! Waiting for ${updateData.pendingCount} more signer(s) to complete.`
        );
      }
    } else {
      alert("Error updating signature status.");
    }
  } catch (err) {
    console.error("Error handling post-sign actions", err);
    alert("Error while updating sign status.");
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
