
const monerojs = require("monero-javascript");

class WalletListener extends require("monero-javascript").MoneroWalletListener {
  constructor(wallet:any ) {
    super();
    this.wallet = wallet
}
  onNewBlock(height:any) {
      console.log("new block", height)
  }
  onOutputReceived(output:any) {
      let txHash = output.getTx().getHash();
      let isConfirmed = output.getTx().isConfirmed();


      //https://github.com/monero-ecosystem/monero-javascript/issues/60
      this.wallet.getTx(txHash).then((tx:any) => {
        
          let transfers = tx.getIncomingTransfers()
          if (transfers) {

              console.log("incoming transfer",this.wallet_name, txHash, transfers[0].state)
          }
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
        await wallet.addListener( new WalletListener(wallet))
        await wallet.startSyncing(5000)
        res.status(200).json({message: 'wallet successfully opened and sync started.'})
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };