module.exports = {
  status: async (req:any, res:any) =>  {
    let return_array: any[] = []
      try{
     
        let wallets = req.app.locals.wallets
        let wallet_names = Object.keys(wallets)
        wallet_names.forEach((wallet_name) => {
          let w =wallets[wallet_name];
          
          
          return_array.push({ path: wallet_name,
            current_sync_height: w.getHeight(),
            daemon_sync_height: w.getDaemonHeight()
          })
        });

        res.status(200).json(return_array)
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };