const close_wallet = async (w:any) => {
  await w.stopSyncing()
  await w.close(true)
}

module.exports = {
  shutdown: async (req:any, res:any) =>  {
      try{
  
        let wallets = req.app.locals.wallets
        if(!wallets) throw "no wallet opened"
        let wallet_names = req.body
        wallet_names.forEach((wallet_name: string) => {
          let w =wallets[wallet_name];

          close_wallet(w)
    
        });
        res.status(200).json({message: 'wallet files successfully closed'})
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };