module.exports = {
    create: (req:any, res:any) => {
      console.log(req.body)
      res.status(200).send('wallet create'+  req.body)},
  };