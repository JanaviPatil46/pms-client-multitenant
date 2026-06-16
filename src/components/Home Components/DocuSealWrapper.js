import React, { useEffect, useState } from "react";
import DocuSealMultiSigner from "./DocuSealMultiSigner";
import { esignAPI } from "../../services/api";

const DocuSealWrapper = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const targetEmail = sessionStorage.getItem("email");
  const accountId = sessionStorage.getItem("accountId");

  useEffect(() => {
    const fetchSignatureList = async () => {
      try {
        const res = await esignAPI.getSignatureList(accountId);

        setData(res.data || []);
      } catch (error) {
        console.error("Error fetching signature list:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) fetchSignatureList();
  }, [accountId]);

  if (loading) return null;
  if (!Array.isArray(data)) return null;

  return (
    <DocuSealMultiSigner
      submissions={data}
      targetEmail={targetEmail}
      accountId={accountId}
    />
  );
};

export default DocuSealWrapper;