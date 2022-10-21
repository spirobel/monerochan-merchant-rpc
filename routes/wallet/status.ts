module.exports = {
  status: async (req:any, res:any) =>  {
    let return_array: any[] = []
    
     
        let wallets = req.app.locals.wallets
        if(!wallets || wallets.length === 0){
            res.status(200).json([]);
            return;
        }
        let wallet_names = Object.keys(wallets)
        for (const wallet_name of wallet_names){
          let w =wallets[wallet_name];

          let response_object = {path: wallet_name} as any
          try{
          response_object.current_sync_height = await w.getHeight();
          response_object.daemon_sync_height = await w.getDaemonHeight();
          return_array.push(response_object);
        } catch (error){
          return_array.push({
            path: wallet_name,
            error_message: String(error)
          })
        }
          
        }
  
        res.status(200).json(return_array)
 

    },
  };