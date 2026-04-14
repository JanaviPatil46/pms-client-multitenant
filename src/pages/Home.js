
import { Box ,Grid,Paper,Stack,Typography} from '@mui/material';
import React from 'react'
import { useState ,useEffect} from 'react';
import { accountsAPI } from '../services/api';
import QuickLinks from '../components/QuickLinks';
import BillingList from '../components/Home Components/BillingList';
import OrganizersList from '../components/Home Components/OrganizersList';
import ProposalsList from '../components/Home Components/ProposalsList';
import ChatsList from "../components/Home Components/ChatsList";
import PendingApprovals from '../components/Home Components/PendingApprovals';
const Home = () => {
  const[accountId] = useState(sessionStorage.getItem("accountId"));
 const [accountName,setAccountName]=useState("")
   const [adminUserId,setAdminUserId]= useState("")
  // ✅ Fetch account details
const fetchAccountDetails = async () => {
  try {
    const res = await accountsAPI.getAccountById(accountId);
setAccountName(res.data.accountName)
setAdminUserId(res.data.adminUserId.emailSyncEmail)
    console.log("result", res.data);
  } catch (error) {
    console.error("Error fetching account details:", error);
  }
};

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);
  return (
    <Box> 
<Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        flexGrow: 1,
       
        height: "90vh",
        p: 1,
      }}
    >
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 8 }}
          
        >
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
             
              transition: "all 0.3s",
              cursor: "pointer",
              "&:hover .sign-link": {
                opacity: 1,
                visibility: "visible",
                textDecoration: "none",
                cursor: "pointer",
              },
            }}
          >
            <Stack sx={{ p: 0 }}>
              <Typography
                variant="h6"
                component="p"
                gutterBottom
                sx={{ fontWeight: "600" }}
              >
                Waiting for action
              </Typography>
            </Stack>
            <OrganizersList accountId={accountId} />
            <BillingList accountId={accountId} />
           
            <ChatsList accountId={accountId} />
            <ProposalsList accountId={accountId} />
           {/* <DocuSealWrapper accountId={accountId} /> */}
           {/* <DocuSealMultiSigner accountId={accountId} /> */}
           {/* <DocumnetApprovals accountId={accountId} adminUserId={adminUserId}/> */}
           <PendingApprovals accountId={accountId}  adminUserId={adminUserId}/>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <QuickLinks accountId={accountId}  accountName={accountName}/>
        </Grid>
      </Grid>
    </Box>

    </Box>
   
  )
}

export default Home