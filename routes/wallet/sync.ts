
module.exports = {
  sync: async (req:any, res:any) =>  {
    const axios = require('axios').default;
    const monerojs = require("monero-javascript");
    const MoneroWalletListener = monerojs.MoneroWalletListener;

    class WalletListener extends MoneroWalletListener {
      constructor(wallet:any, callback: string ) {
        super();
        this.callback = callback
        this.wallet = wallet
       }
      async onSyncProgress(height: number, startHeight: number,
         endHeight: number, percentDone: number, message:string){
          req.app.locals.walletstatus[req.body.path] = {path:req.body.path, height, startHeight,
                                                     endHeight, percentDone, message}
      }

      async onNewBlock(height:number) { //on every new block we send the updated info
        let return_array: any[] = []    // on the transactions of the last 10 blocks to the callback url

        let wallet = this.wallet
        let minHeight = height - 10
        if(minHeight < 0){ minHeight = 0}
        let maxHeight = height
        try{
        let transactions = await wallet.getTxs({
          minHeight, maxHeight
        })

          for (let transaction of transactions) {
            let payment_id = Number("0x" + transaction.getPaymentId()) || null
            if(payment_id != null || req.body.include_transactions_without_payment_id){
            return_array.push({
              payment_id,
              amount: Object.assign(new monerojs.BigInteger(), transaction.getIncomingAmount()).toString(),
              height: transaction.getHeight(),
              confirmations: transaction.getNumConfirmations(),
              isConfirmed: transaction.isConfirmed()
            })
          }
        }
        if(return_array.length > 0 ){
          await axios.post(this.callback, {transactions: return_array},  {
          headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json'
          }
        }) }         
     }catch (error) {
      req.app.locals.walletstatus[req.body.path] = {path: req.body.path, error_message: String(error)}
      console.log("error in the new block listener with callback:",this.callback, "error message: ", error)
    }

    }
    } //END of Walletlistener definition 

      try{
        if(!req.app.locals.wallets){req.app.locals.wallets = {}}
        if(!req.app.locals.walletstatus){req.app.locals.walletstatus = {}}
        let message = ""
        if(req.app.locals.walletstatus[req.body.path]){
          message = req.app.locals.walletstatus[req.body.path].message;
        }
        if(req.app.locals.wallets[req.body.path] || message === "opening"){
          res.status(200).json({message: 'wallet already opened.'})
        }else {
     
          req.app.locals.walletstatus[req.body.path] = {path: req.body.path, message: String("opening")}

          let wallet = await monerojs.openWalletFull(
            {
              path: req.body.path,
              networkType: req.body.networkType,
              serverUri: req.body.serverUri,
              password: "password_is_snakeoil_in_this_case",
            }
          );

          req.app.locals.wallets[req.body.path] = wallet
          await wallet.addListener( new WalletListener(wallet, req.body.callback))
          await wallet.startSyncing(5000)
          req.app.locals.walletstatus[req.body.path] = {path: req.body.path, message: String("wallet successfully opened and sync started.")}
          res.status(200).json({message: 'wallet successfully opened and sync started.'})
        }
      } catch (error){
        req.app.locals.walletstatus[req.body.path] = {path: req.body.path, error_message: String(error)}
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };