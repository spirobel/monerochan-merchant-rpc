
const monerojs = require("monero-javascript");

class WalletListener extends require("monero-javascript").MoneroWalletListener {
  constructor(wallet:any, callback: string ) {
    super();
    this.callback = callback
    this.wallet = wallet
}
 
  onOutputReceived(output:any) {
      let tx_hash = output.getTx().getHash();
      //https://github.com/monero-ecosystem/monero-javascript/issues/60
      this.wallet.getTx(tx_hash).then((tx:any) => {
        
          let payment_id = tx.getPaymentId()
          let amount = Object.assign(new monerojs.BigInteger(), tx.getIncomingAmount()).toString()
          let height = tx.getHeight()
          let confirmations = tx.getNumConfirmations()
          let isConfirmed = tx.isConfirmed()
          axios.post(this.callback, { payment_id, amount, tx_hash, height, confirmations, isConfirmed })          
      });
  }
}






module.exports = {
  sync: async (req:any, res:any) =>  {

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