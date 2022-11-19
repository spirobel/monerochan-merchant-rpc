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
            let payment_id = Number("0x" + transaction.getPaymentId()) || null
            if(payment_id != null || req.body.include_transactions_without_payment_id){
              return_array.push({
                payment_id,
                amount: Object.assign(new monerojs.BigInteger(), transaction.getIncomingAmount()).toString(),
                height: transaction.getHeight(),
                confirmations: transaction.getNumConfirmations(),
                isConfirmed: transaction.isConfirmed()
              })
            }

        }
  
        res.status(200).json({transactions: return_array})
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };