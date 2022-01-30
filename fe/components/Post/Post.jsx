import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import { DataGrid } from '@mui/x-data-grid';

import { transfer } from '../../sdk/iconSDK.js';
// import toast, { Toaster } from 'react-hot-toast';

const iconICX = 'https://s2.coinmarketcap.com/static/img/coins/200x200/2099.png';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const columns = [
  {
    field: 'receiver',
    headerName: 'Receiver Address',
    width: 450,
  },
  {
    field: 'sender',
    headerName: 'Sender Address',
    width: 450,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 100,
    editable: true,
  },

];

export const Post = ({ postId, userName, userAvatar, date, userAddress, shortDesc, moreDetails, url, mediaType = "video", donateHistory }) => {
  const [expanded, setExpanded] = useState(false);
  const [donationData, setDonationData] = useState([]);
  const to = userAddress || 'hxedaf3b2027fbbc0a31f589299c0b34533cd8edac'; //lisa
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };



  const donate = async (value, postId) => {
    let result = await transfer({ to: to, value: value }, postId);
    setDonationData(prevData => [...prevData, { id: result.id, sender: result.sender, receiver: result.receiver, amount: result.value }])
  }

  useEffect(() => {
    setDonationData(donateHistory?.map(item => {
      return {
        id: item.id, sender: item?.attributes.sender, receiver: item.attributes.receiver, amount: item.attributes.value
      }
    }))
  }, []);


  return (
    <Card sx={{ maxWidth: 545 }}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" src={userAvatar || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"} />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={userName}
        subheader="January 14th, 2022"
      />
      {
        (mediaType === 'video') ?
          <iframe width="100%" height="294" src={url}>
          </iframe> :
          <CardMedia
            component="img"
            height="294"
            image={url}
            alt="Paella dish"
          />
      }
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {shortDesc}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" sx={{ 'color': '#f34d6a' }} onClick={() => { donate(1, postId) }} >
          <FavoriteIcon />
          <span className="amount">1</span>
          <img width="12px" height="12px" src={iconICX} alt='icx'></img>
        </IconButton>
        <IconButton aria-label="flower" sx={{ 'color': '#ed3bef' }} onClick={() => { donate(3, postId) }}>
          <LocalFloristIcon />
          <span className="amount">3</span>
          <img width="12px" height="12px" src={iconICX} alt='icx'></img>
        </IconButton>
        <IconButton aria-label="flower" sx={{ 'color': '#811fd9' }} onClick={() => { donate(5, postId) }}>
          <LocalBarIcon />
          <span className="amount">5</span>
          <img width="12px" height="12px" src={iconICX} alt='icx'></img>
        </IconButton>
        <IconButton aria-label="flower" sx={{ 'color': '#723102' }} onClick={() => { donate(10, postId) }}>
          <LocalCafeIcon />
          <span className="amount">10</span>
          <img width="12px" height="12px" src={iconICX} alt='icx'></img>
        </IconButton>
        <IconButton aria-label="flower" sx={{ 'color': '#f9ba43' }} onClick={() => { donate(50, postId) }}>
          <EmojiEventsIcon />
          <span className="amount">50</span>
          <img width="12px" height="12px" src={iconICX} alt='icx'></img>
        </IconButton>
        <IconButton aria-label="flower" sx={{ 'color': '#4372f9' }} onClick={() => { donate(100, postId) }}>
          <LocalAirportIcon />
          <span className="amount">100</span>
          <img width="12px" height="12px" src={iconICX} alt='icx'></img>
        </IconButton>
        <IconButton aria-label="flower">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {moreDetails}
          </Typography>
          <Typography paragraph>
            Donation History
          </Typography>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={donationData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </div>
        </CardContent>
      </Collapse>
      <style jsx>{`
        .amount {
          font-size: 12px;
          color: #20c5c9;
          margin-right: 2px;
        }
      `}</style>
    </Card>
  );
}