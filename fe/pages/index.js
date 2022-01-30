import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { Wallet } from '../components/Wallet';
import { Post } from '../components/Post';
import { Header } from '../components/Header';
import { listPost } from '../dummy/post';
import axios from 'axios';
import qs from 'qs';
import { Toaster } from 'react-hot-toast';

const SERVER_URL = 'http://localhost:1337';

function Home() {
  const [address, setAddress] = useState('');
  const [postData, setPostData] = useState([]);


  useEffect(async () => {
    setAddress(localStorage.getItem('address'));
    const query = qs.stringify({
      populate: '*'
    }, {
      encodeValuesOnly: true,
    });
    //const result = (await axios.get(SERVER_URL + `/api/posts?${query}`)).data.data;
    //setPostData(result);
  }, [])
  return (
    <div className="container">
      <div><Toaster/></div>
      <Head>
        <title>We Choice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="header">
        <Header address={address} setAddress={setAddress} />
      </div>
      <main>
        {
          listPost.map((post, idx) => <div className="post-wrapper">
            <Post key={idx} userName={post.userName} userAvatar={post.userAvatar} userAddress={post.userAddress} shortDesc={post.shortDesc} moreDetails={post.moreDetails} url={post.url} mediaType={post.mediaType} donateHistory={post.donateHistory} />
          </div>)
        }
      </main>
      <footer>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Proudly made by{' '}
          <img src="/logo-white.png" alt="ICON" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .header {
          width: 100%;
          z-index: 1000;
          position: fixed;
          top: 0;
        }

        main {
          padding: 6rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .post-wrapper {
          margin-bottom: 1rem;
        }

        footer {
          width: 100%;
          height: 60px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #6363b1;
          color: white;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 1.5rem;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          text-decoration: none;
        }



        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .logo {
          height: 1.8em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: Elsie Swash Caps, cursive, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, 'Mukta', sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default Home