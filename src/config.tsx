export const contractAddress =
  'erd1qqqqqqqqqqqqqpgq72l6vl07fkn3alyfq753mcy4nakm0l72396qkcud5x';

export const dAppName = 'Entity Workshop Dapp';

// Generate your own WalletConnect 2 ProjectId here: https://cloud.walletconnect.com/app
export const walletConnectV2ProjectId = process.env.REACT_APP_WALLET_CONNECT_ID;

export const apiTimeout = 6000;
export const transactionSize = 15;
export const TOOLS_API_URL = 'https://tools.multiversx.com';

export const BE_API = 'https://127.0.0.1:3000';

/**
 * Calls to these domains will use `nativeAuth` Baerer token
 */
export const sampleAuthenticatedDomains = [BE_API, TOOLS_API_URL];

export const authCipherAlgorithm = process.env.REACT_APP_AUTH_CIPHER_ALGORITHM;
export const authCipherPassword = process.env.REACT_APP_AUTH_CIPHER_PASSWORD;
