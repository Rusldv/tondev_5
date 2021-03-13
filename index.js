const path = require('path')
const fs = require('fs')

const { exec } = require('child_process')
const { exit } = require('process')
const {TonClient} = require("@tonclient/core")
const {libNode} = require("@tonclient/lib-node")

TonClient.useBinaryLibrary(libNode)

const server_addr = 'net.ton.dev'

const cli = new TonClient({
   network: { 
      server_address: server_addr 
   } 
});

let cmd;
let arg;
if(process.argv[2] && process.argv[2].trim()) {
   if(process.argv[3] && process.argv[3].trim()) {
      arg = process.argv[3]
   } else {
      console.log("Input project name")
      usagePrint()
      exit(0)
   }
   cmd = process.argv[2]
} else {
   console.log("Input command name")
   usagePrint()
   exit(0)
}

switch(cmd) {
   case "new":
     // create phrase
      cli.crypto.mnemonic_from_random({})
      .then(ph => {
         console.log(ph.phrase)
         fs.writeFile(`${arg}.phrase.txt`, ph.phrase, () => console.log("Phrase complete."))
          // Execute sol command from .tools
         exec(`node ./tondev/cli.js sol create ${arg}`, (error, stdout, stderr) => {
            if (error) {
            console.error(`error: ${error.message}`);
            return;
            }
            if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
            }
            console.log(`${stdout}`);
            exit(0)
         });
      })
      .catch(e => {
         console.log(e)
         exit(0)
      })
      break
   case "run":
      exec(`node ./tondev/cli.js sol compile ${arg}.sol`, (error, stdout, stderr) => {
         if (error) {
           console.error(`error: ${error.message}`);
           return;
         }
         if (stderr) {
           console.error(`stderr: ${stderr}`);
           return;
         }
         console.log(`${stdout}`);
         // Convert to base64
         let buff = fs.readFileSync(`${arg}.tvc`)
         let base64data = buff.toString('base64')
         //console.log(`Contract converted to base64 is: ${base64data}`)
         fs.writeFile(`${arg}.tvc.base64`, base64data, () => console.log("Base64 complete."))
       });
      break
   case "code":
      let tvc1 = fs.readFileSync(`${arg}.tvc.base64`, "utf-8");
      cli.boc.get_code_from_tvc({tvc: tvc1}).then(r => {
         console.log(r.code)
         exit(0)
      })
      break
   case "gen":
      console.log("GENERATE")
      let phrase = fs.readFileSync(`${arg}.phrase.txt`, "utf-8")
      //cli.crypto.generate_random_sign_keys()
      cli.crypto.mnemonic_derive_sign_keys({phrase: phrase})
      .then(async function (keys) {
            console.log(keys);
            let abi = fs.readFileSync(`${arg}.abi.json`, "utf-8");
            //console.log(abi)
            let tvc = fs.readFileSync(`${arg}.tvc.base64`, "utf-8");
            //console.log(tvc)
            // convert
            try {
               const r = await cli.abi.encode_message({
                  abi: {
                     type: 'Json',
                     value: abi
                  },
                  deploy_set: {
                     tvc: tvc
                  },
                  call_set: {
                     function_name: "constructor",
                  },
                  signer: {
                     type: 'Keys',
                     keys: keys
                  }
               });
               console.log(r);
               fs.writeFile(`${arg}.addr.txt`, r.address, () => {
                 console.log("Contract address writen.")
                 exit(0)
               })
            } catch (e) {
               console.log(e);
               exit(0);
            }
         })
      break
   case "newacc":
      console.log("NEWACC")
      let ph3 = fs.readFileSync(`${arg}.phrase.txt`, "utf-8")
      //cli.crypto.generate_random_sign_keys()
      cli.crypto.mnemonic_derive_sign_keys({phrase: ph3})
      .then(async function (keys) {
            console.log(keys);
            // create account from type in arg acctype
            let abi = fs.readFileSync(`${arg}.abi.json`, "utf-8");
            let tvc = fs.readFileSync(`${arg}.tvc.base64`, "utf-8");
            cli.abi.encode_account({
               state_init: {
                  type: 'Tvc',
                  tvc: tvc,
                  public_key: keys.public,
                  /*
                  init_params: {
                     abi: abi,
                     value: '{\"constructor:{}\"}'
                  }
                  */
               }
            })
            .then(acc => {
               console.log(acc.account)
               fs.writeFile(`${arg}.account.boc`, acc.account, () => {
                  console.log("Contract account writen.")
                  exit(0);
               })
            })
      })
      break
   case "dep":
      console.log("DEPLOY")
      let ph = fs.readFileSync(`${arg}.phrase.txt`, "utf-8")
      //cli.crypto.generate_random_sign_keys()
      cli.crypto.mnemonic_derive_sign_keys({phrase: ph})
      .then(async function (keys) {
            //console.log(keys);
            let abi = fs.readFileSync(`${arg}.abi.json`, "utf-8");
            //console.log(abi)
            let tvc = fs.readFileSync(`${arg}.tvc.base64`, "utf-8");
            //console.log(tvc)
            console.log("processing...")
            cli.processing.process_message({
               message_encode_params: {
                  abi: {
                  type: 'Json',
                  value: abi
                  },
                  deploy_set: {
                     tvc: tvc
                  },
                  call_set: {
                     function_name: "constructor",
                     input: {},
                  },
                  signer: {
                     type: 'Keys',
                     keys: keys
                  },
               },
               send_events: false
            })
            .then(
               r => {
                  console.log(r)
                  exit(0)
               },
               err => {
                  console.log(err)
                  exit(0)
              } 
            )
         })
      break
   case "version":
      console.log("EsayTON v0.0.1")
      break
   case "exec":
      console.log("EXEC")
      let ph4 = fs.readFileSync(`${arg}.phrase.txt`, "utf-8")
      let addr2 = fs.readFileSync(`${arg}.addr.txt`, "utf-8")
      let acc2 = fs.readFileSync(`${arg}.account.boc`, "utf-8")
      let fn2
      let inp2 = {}
      if(process.argv[4] && process.argv[4].trim()) {
         fn2 = process.argv[4]
         if(process.argv[5] && process.argv[5].trim()) {
            inp2 = JSON.parse(process.argv[5])
         }
      } else {
         usagePrint()
         exit(0)
      }
      cli.crypto.mnemonic_derive_sign_keys({phrase: ph4})
      .then(async (keys) => {
            let abi2 = fs.readFileSync(`${arg}.abi.json`, "utf-8")
            cli.abi.encode_message({
               abi: {
                  type: 'Json',
                  value: abi2
               },
               address: addr2,
               call_set: {
                  function_name: fn2,
                  input: inp2
               },
               signer: {
                  type: 'Keys',
                  keys: keys
               }
            })
            .then(msg => {
               //console.log(msg)
               cli.tvm.run_executor({
                  message: msg.message,
                  account: {
                     type: 'Account',
                     boc: acc2,
                     unlimited_balance: true
                  }
               })
               .then(res => {
                  console.log(res)
                  exit(0)
               })
               .catch(err => {
                  console.log(err)
                  exit(0)
               })
            })
            .catch(err => {
               console.log(err)
               exit(0)
            })
         })
      break
   case "call":
      console.log("CALL with json args")
      
      let ph2 = fs.readFileSync(`${arg}.phrase.txt`, "utf-8")
      let addr = fs.readFileSync(`${arg}.addr.txt`, "utf-8")
      let fn
      let inp = {}
      if(process.argv[4] && process.argv[4].trim()) {
         fn = process.argv[4]
         if(process.argv[5] && process.argv[5].trim()) {
            inp = JSON.parse(process.argv[5])
         }
      } else {
         usagePrint()
         exit(0)
      }
      // Взять четвертый аргумент - имя функции контракта и 5-й параметры в JSON
      //cli.crypto.generate_random_sign_keys()
      cli.crypto.mnemonic_derive_sign_keys({phrase: ph2})
      .then(async function (keys) {
            //console.log(keys);
            let abi = fs.readFileSync(`${arg}.abi.json`, "utf-8");
            console.log("processing...")
            cli.processing.process_message({
               message_encode_params: {
                  abi: {
                     type: 'Json',
                     value: abi
                  },
                  address: addr,
                  call_set: {
                     function_name: fn,
                     input: inp,
                  },
                  signer: {
                     type: 'Keys',
                     keys: keys
                  },
               },
               send_events: false
            })
            .then(
               r => {
                  console.log(r)
                  exit(0)
               },
               err => {
                  console.log(err)
                  exit(0)
              } 
            )
         })
      break
   default:
      usagePrint()
}

function usagePrint() {
   console.log("Usage(local):")
   console.log("\t> esayton version")
   console.log("\t> esayton new contract_name")
   console.log("\t> esayton run contract_name")
   console.log("\t> esayton code contract_name")
   console.log("\t> esayton gen contract_name")
   console.log("\t> esayton newacc contract_name")
   console.log("\t> esayton exec contract_name function_name '{\"arg1\": val1, \"arg2\": val2, ...}'")
   console.log("Usage(net):")
   console.log("\t> esayton dep contract_name")
   console.log("\t> esayton call contract_name function_name '{\"arg1\": val1, \"arg2\": val2, ...}'")
}
