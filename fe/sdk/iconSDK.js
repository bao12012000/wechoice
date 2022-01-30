/* eslint-disable @typescript-eslint/ban-ts-comment */
import IconService from 'icon-sdk-js';
import { toast } from 'react-hot-toast';
const { IconConverter, IconBuilder, IconAmount, IconUtil, HttpProvider } = IconService;
const { IcxTransactionBuilder } = IconBuilder;
import axios from 'axios';

const SERVER_URL = 'http://188.166.223.9:1337';
export default class Request {
  constructor(id, method, params) {
    this.jsonrpc = '2.0';
    this.id = id;
    this.method = method;
    this.params = params;
  }
}

export const NETWORKS = {
  sejong: {
    name: 'Sejong Testnet',
    endpoint: 'https://sejong.net.solidwallet.io/api/v3',
    nid: '0x53',
  },
};
const ADDRESS = 'address';
const rawTransaction = 'rawTransaction';

export const httpProvider = new HttpProvider(NETWORKS.sejong.endpoint);

const iconService = new IconService(httpProvider);

export const hashShortener = (hashStr) => {
  if (!hashStr) return '';
  const len = hashStr.length;
  return `${hashStr.substring(0, 6)}...${hashStr.substring(len - 4)}`;
};

export const convertToICX = (balance) => {
  return IconService.IconAmount.of(balance, IconService.IconAmount.Unit.LOOP)
    .convertUnit(IconService.IconAmount.Unit.ICX)
    .toString();
};

export const getBalance = (address) => {
  return iconService
    .getBalance(address || localStorage.getItem('ADDRESS'))
    .execute()
    .then(balance => {
      return convertToICX(balance);
    });
};

const delay = ms => new Promise(res => setTimeout(res, ms));

export const createTransaction = async (hash, postId) => {
  await delay(5000);
  const transaction = await iconService.getTransactionResult(hash).execute();
  if (transaction.status == 0 || transaction.status == '0x0') {
    return;
  }

  const blockInfo = await iconService.getBlockByHash(transaction.blockHash).execute();
  let history = {};
  for (const transConfirmed of blockInfo.confirmedTransactionList) {
    if (transConfirmed.txHash == hash) {
      history = {
        sender: transConfirmed.from,
        receiver: transConfirmed.to,
        value: IconConverter.toNumber(transConfirmed.value) / Math.pow(10, 18),
        transactionHash: hash,
        blockHash: transaction.blockHash,
        blockNumber: transaction.blockHeight.toString(),
        post: postId
      }
     let result = await axios.post(SERVER_URL + `/api/histories`, {
        data: history
      })
      history.id = result.data.data.id
    }
  }
  return history;

}


export const connectWallet = (setAddress) => {
  if (window) {
    const customEvent = new CustomEvent('ICONEX_RELAY_REQUEST', {
      detail: {
        type: 'REQUEST_ADDRESS',
      },
    });
    window.dispatchEvent(customEvent);
    const eventHandler = (event) => {
      const { type, payload } = event?.detail;
      if (type === 'RESPONSE_ADDRESS') {
        localStorage.setItem(ADDRESS, payload);
        sessionStorage.setItem('isConnected', 'connected');
        setAddress(payload);
      }
    };
    window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
  }
};

export const transfer = (transaction, postId) => {
  const { from = localStorage.getItem('address'), to, value } = transaction;
  if (!from) {
    toast.error('Connect wallet first!');
    return;
  }

  const txObj = new IcxTransactionBuilder()
    .from(from)
    .to(to)
    .value(IconAmount.of(value, IconAmount.Unit.ICX).toLoop())
    .stepLimit(IconConverter.toBigNumber(1000000000))
    .nid(IconConverter.toBigNumber(NETWORKS.sejong.nid))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp(new Date().getTime() * 1000)
    .build();
  const rawTxObj = IconConverter.toRawTransaction(txObj)
  const tx = {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: rawTxObj,
    id: 50889,
  };
  return signTx(tx, postId);
};

export const checkRs = async (txHash) => {
  try {
    const transactionResult = await iconService.getTransactionResult(txHash).execute();
    if (transactionResult.status === 1) {
      toast.success('Thanks for your donation!')
    }
  } catch (error) {
  }
}

export const signTx = async (transaction, postId) => {
  return new Promise((resolve, reject) => {
    window.dispatchEvent(
      new CustomEvent('ICONEX_RELAY_REQUEST', {
        detail: {
          type: 'REQUEST_JSON-RPC',
          payload: transaction,
        },
      })
    );

    window.addEventListener(
      'ICONEX_RELAY_RESPONSE',
      async function (event) {
        const type = event.detail.type;
        const payload = event.detail.payload;
        if (type === 'RESPONSE_JSON-RPC') {
          toast.success('Please waiting for a bit!')
          const result = await createTransaction(payload?.result, postId)
          resolve(result);
          toast.success('Thanks for your donation!');
        }
      },
      { once: true }
    );
  });
};

