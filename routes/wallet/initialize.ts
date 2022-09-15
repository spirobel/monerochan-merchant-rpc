module.exports = {
  initialize: async (req:any, res:any) =>  {
      console.log(req.body)
      const monerojs = require("monero-javascript");
      try{
        let wallet = await monerojs.createWalletFull(
          req.body
        );
        console.log(wallet)
        res.status(200).send('wallet initialize'+  req.body)
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };