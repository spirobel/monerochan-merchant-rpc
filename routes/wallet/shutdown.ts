const close_wallet = async (w:any, wallet_name:string, req:any) => {
  await w.stopSyncing()
  req.app.locals.walletstatus[wallet_name] = {path: wallet_name, message: 'Stopped Synchronizing'}
  await w.close(true)
  req.app.locals.walletstatus[wallet_name] = {path: wallet_name, message: 'wallet file successfully closed'}
  delete req.app.locals.wallets[wallet_name]
}

module.exports = {
  shutdown: async (req:any, res:any) =>  {
      try{
  
        let wallets = req.app.locals.wallets
        if(!wallets) throw "no wallet opened"
        let wallet_names = req.body
        wallet_names.forEach((wallet_name: string) => {
          let w =wallets[wallet_name];
          if(!w) throw wallet_name + " was not opened, so it cant be closed"
          let message = req.app.locals.walletstatus[wallet_name].message;
          if(message === "opening" || message === "closing" || message === 'Stopped Synchronizing'){
            throw wallet_name + " is already closing or not opened yet"
          } else {
            req.app.locals.walletstatus[wallet_name] = {path: wallet_name, message: String("closing")}
            close_wallet(w, wallet_name, req)
          }

    
        });
        res.status(200).json({message: 'wallet files successfully closed'})
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };