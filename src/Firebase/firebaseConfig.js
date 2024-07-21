import keys from "../keys/keys.js";


const firebaseConfig = {
 apiKey: keys.firebaseAPIKey,
 authDomain: keys.firebaseAuthDomain,
 projectId: keys.firebaseProjectId,
 storageBucket: keys.firebaseStorageBucket,
 messagingSenderId: keys.firebaseMessagingSenderId,
 appId: keys.firebaseAppId
};


export default firebaseConfig;