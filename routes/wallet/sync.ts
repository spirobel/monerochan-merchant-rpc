
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
            return_array.push({
              payment_id: Number("0x" + transaction.getPaymentId()),
              amount: Object.assign(new monerojs.BigInteger(), transaction.getIncomingAmount()).toString(),
              height: transaction.getHeight(),
              confirmations: transaction.getNumConfirmations(),
              isConfirmed: transaction.isConfirmed()
            })
        }
        if(return_array.length > 0 ){
          await axios.post(this.callback, return_array,  {
          headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json'
          }
        }) }         
     }catch (error) {
      console.log("error in the new block listener with callback:",this.callback, "error message: ", error)
    }

    }
    } //END of Walletlistener definition 

      try{
        let wallet = await monerojs.openWalletFull(
          {
            path: req.body.path,
            networkType: req.body.networkType,
            serverUri: req.body.serverUri,
            password: "password_is_snakeoil_in_this_case",
          }
        );
        if(!req.app.locals.wallets){req.app.locals.wallets = {}}
        req.app.locals.wallets[req.body.path] = wallet
        await wallet.addListener( new WalletListener(wallet, req.body.callback))
        await wallet.startSyncing(5000)
        res.status(200).json({message: 'wallet successfully opened and sync started.'})
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };