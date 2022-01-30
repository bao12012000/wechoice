import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

import { connectWallet, hashShortener } from '../../sdk/iconSDK.js';


export const Wallet = ({ address, setAddress }) => {
    const handleDisconnect = () => {
        sessionStorage.removeItem('isConnected');
        localStorage.removeItem('address');
        setAddress('');
    };
  return (
    <div className="wallet-wrapper">
        {
            address? (
                <>
                <div className="avatar">    
                    <span className="address">{hashShortener(address)}</span>
                    <Avatar alt="user avatar" src="https://i.pinimg.com/originals/ae/ec/c2/aeecc22a67dac7987a80ac0724658493.jpg" />
                    <Box sx={{ '& > :not(style)': { m: 1 } }}>  
                    <Fab size="small" variant="extended" onClick={()=> handleDisconnect()} sx={{ 'background-color': '#be4040', 'color': 'white', ':hover' : {color: 'black'} }} aria-label="disconnect">
                        <LogoutIcon />
                    </Fab>
                    </Box>
                </div> 
                </>
            )
         : (
            <>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>  
            <Fab size="small" variant="extended" onClick={()=> connectWallet(setAddress)} sx={{ 'background-color': '#1c2260', 'color': 'white', ':hover' : {color: 'black'} }} aria-label="connect">
                <AccountBalanceWalletIcon />
                Connect Hana
            </Fab>
            </Box>
            </>
         )
        }
       
        <style jsx>{`
        .wallet-wrapper {
        }
        .address {
            font-family: 'Source Code Pro', monospace;
            display: inline-block;
            margin: 0 4px;
        }
        .avatar {
            display: flex;
            align-items: center;
        }
        
        `}</style>
    </div>
  );
}