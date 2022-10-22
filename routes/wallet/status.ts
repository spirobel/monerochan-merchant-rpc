module.exports = {
  status: async (req:any, res:any) =>  {
    let walletsstatus = req.app.locals.walletstatus || {}
    res.status(200).json(walletsstatus);
    },
  };