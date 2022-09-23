module.exports = {
  testcallback: async (req:any, res:any) =>  {

      try{
        console.log("TESTCALLBACK: ", req.body)
        res.status(200).json({message: 'sucessfully called callback.'})
      } catch (error){
        res.status(500).json({ message:'unexpected error: ' + error });
      }

    },
  };