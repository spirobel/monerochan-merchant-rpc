module.exports = {
  shutdown: async (req:any, res:any) =>  {
      try{
        let wallet = req.app.locals.wallets[req.body.path]
        wallet.stopSyncing()
        wallet.close(true)
        res.status(200).json({message: 'wallet files successfully closed'})
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };