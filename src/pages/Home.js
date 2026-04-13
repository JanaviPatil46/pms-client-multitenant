
import { Box } from '@mui/material';
import React from 'react'
import { useState ,useEffect} from 'react';
import { accountsAPI } from '../services/api';
const Home = () => {
  const[accountId] = useState(sessionStorage.getItem("accountId"));
  // ✅ Fetch account details
const fetchAccountDetails = async () => {
  try {
    const res = await accountsAPI.getAccountById(accountId);


    console.log("result", res.data);
  } catch (error) {
    console.error("Error fetching account details:", error);
  }
};

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);
  return (
    <Box> <div>{accountId}</div>


    </Box>
   
  )
}

export default Home