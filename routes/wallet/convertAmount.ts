const monerojs = require("monero-javascript");

module.exports = {
  convertAmount: async (req:any, res:any) =>  {

      try{
        req.body.amount
          let amount = req.body.amount
          let display_amount_padded = amount.padStart(100, "0")
          let display_amount_with_dot = display_amount_padded.substring(0,88) + "." + display_amount_padded.substring(88)
          let display_amount = display_amount_with_dot.replace(/^0+|0+$/g, "")
          if(display_amount.startsWith(".")){
            display_amount = "0" + display_amount
          }
          let return_amount = Number(display_amount) * req.app.locals.exchange_rate[req.body.currency]
          res.status(200).json({amount: return_amount.toString()})
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };