import { text } from "express";
const monerojs = require("monero-javascript");

module.exports = {
  getTransactions: async (req:any, res:any) =>  {
    let return_array: any[] = []
      try{
        let wallet = req.app.locals.wallets[req.body.path] 
        let minHeight = req.body.minHeight
        let maxHeight = req.body.maxHeight
        let transactions = await wallet.getTxs({
          minHeight, maxHeight
        })

          for (let transaction of transactions) {
            return_array.push({
              payment_id: Number("0x" + transaction.getPaymentId()) || null,
              amount: Object.assign(new monerojs.BigInteger(), transaction.getIncomingAmount()).toString(),
              height: transaction.getHeight(),
              confirmations: transaction.getNumConfirmations(),
              isConfirmed: transaction.isConfirmed()
            })
        }
  
        res.status(200).json(return_array)
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };