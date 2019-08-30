const Router = require('express-promise-router')
var request = require('request-promise');

const router = new Router()
module.exports = router

router.get('/exchanges', async (req, res) => {
  
    const node = "https://data.ripple.com/v2/network/exchange_volume?&limit=100&exchange_currency=CNY&exchange_issuer=rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y";
    
    const options = {
        method: 'GET',
        uri: node,
        json: true 
    };

    let data = await request(options).catch(e=>{
      console.log(e);
    })
    let rsp ={};
    if(data && data.result=='success') {
      let rows = data.rows[0].components;
      rows = _fiter(rows);
      _format(rows);
      rsp.result = 'success';
      rsp.data = rows;
    }else{
      rsp.result = 'error';
    }
    res.send(rsp)
})

_format = function(rows) {
  return rows;
}

_fiter = function(rows) {
  const bases = [
    {currency:"CNY",issuer:"rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y"},
    {currency:"ULT",issuer:"rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y"},
    {currency:"XLM",issuer:"rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y"}
  ];
   return rows.filter((v)=>{
    return bases.some((b)=>{
      return JSON.stringify(b)==JSON.stringify(v.base);
    })
  })

}


