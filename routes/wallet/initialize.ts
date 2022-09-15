module.exports = {
  initialize: (req:any, res:any) => {
      console.log(req.body)
      res.status(200).send('wallet initialize'+  req.body)},
  };