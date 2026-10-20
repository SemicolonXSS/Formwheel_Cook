/* Cook achievement record. Client-reported gameplay score; not a server-verified competitive result. */
import {initializeApp,getApps} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getDatabase,ref,runTransaction} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
const config={apiKey:"AIzaSyBreTSe1m0-xlbF4aupnU5isRZCihR25IE",authDomain:"formwheel.firebaseapp.com",databaseURL:"https://formwheel-default-rtdb.firebaseio.com",projectId:"formwheel",storageBucket:"formwheel.firebasestorage.app",messagingSenderId:"431583088241",appId:"1:431583088241:web:74e0e34ea1e3e1170c55d0"};
const app=getApps().find(x=>x.name==="[DEFAULT]")||initializeApp(config);
const auth=getAuth(app),db=getDatabase(app);
let user=null;
onAuthStateChanged(auth,u=>user=u&&!u.isAnonymous?u:null);
window.addEventListener("fw:cook:score",async event=>{
 const score=Number(event.detail?.score);
 if(!Number.isInteger(score)||score<0||score>100)return;
 try{
  const localKey="fw:cook:bestScore";
  localStorage.setItem(localKey,String(Math.max(score,Number(localStorage.getItem(localKey))||0)));
 }catch{}
 if(!user)return;
 try{
  await runTransaction(ref(db,"formwheelV2/achievementStats/"+user.uid+"/cookBestScore"),old=>Math.max(Number(old)||0,score),{applyLocally:false});
 }catch(error){console.warn("Cook badge score sync failed:",error.code||error.message)}
});
