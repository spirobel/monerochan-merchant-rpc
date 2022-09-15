module.exports = {
  initialize: async (req:any, res:any) =>  {

      const monerojs = require("monero-javascript");
      try{
        let wallet = await monerojs.createWalletFull(
          {
            path: req.body.path,
            networkType: req.body.networkType,
            primaryAddress: req.body.primaryAddress,
            privateViewKey: req.body.privateViewKey,
            restoreHeight: req.body.restoreHeight,
            password: "password_is_snakeoil_in_this_case",

          }
        );
        res.status(200).json({message: 'wallet files successfully created'})
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };