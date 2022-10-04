module.exports = {
  invoice: async (req:any, res:any) =>  {
    const QRCode = require('qrcode')
    const monerojs = require("monero-javascript");

      try{
        let wallet = req.app.locals.wallets[req.body.path]
        let address_qrcode = ""
        let address = ""
        if(req.body.payment_id){
          let integratedAddress = Object.assign(new monerojs.MoneroIntegratedAddress(),
                                 await wallet.getIntegratedAddress("",
                                  req.body.payment_id.toString(16).padStart(16, "0"))
                                 )
          address = integratedAddress.getIntegratedAddress()                      
          address_qrcode = await QRCode.toDataURL(address)
        } 
        if(req.body.amount){
          let amount_double =  req.body.amount / req.app.locals.exchange_rate[req.body.currency]
          let amount = (new monerojs.BigInteger(Math.trunc(amount_double*100000000))).multiply(10000).toString()
          let display_amount_padded = amount.padStart(100, "0")
          let display_amount_with_dot = display_amount_padded.substring(0,88) + "." + display_amount_padded.substring(88)
          let display_amount = display_amount_with_dot.replace(/^0+|0+$/g, "")
          if(display_amount.startsWith(".")){
            display_amount = "0" + display_amount
          }
          let payment_uri =  `monero:${address}?tx_amount=${display_amount}`
          let payment_uri_qrcode = await QRCode.toDataURL(payment_uri)
          res.status(200).json({address, address_qrcode,amount, display_amount, payment_uri, payment_uri_qrcode})
        } else {
          res.status(200).json({address, address_qrcode})
        }
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };