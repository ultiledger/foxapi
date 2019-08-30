const Router = require('express-promise-router')
var request = require('request-promise');
const moment = require ('moment');
const _ = require('underscore');
const router = new Router()
module.exports = router

const urls = {
  xrpcny:`https://data.ripple.com/v2/exchanges/XRP/CNY+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y`,
  xlmcny:`https://data.ripple.com/v2/exchanges/XLM+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/CNY+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y`,
  ultcny:`https://data.ripple.com/v2/exchanges/ULT+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/CNY+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y`,
  ultxrp:`https://data.ripple.com/v2/exchanges/ULT+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/XRP`,
  xlmxrp:`https://data.ripple.com/v2/exchanges/XLM+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/XRP`,
}

router.get('/', async (req, res) => {
  let rsp ={};
   let startdate = (moment(new Date().getTime()).subtract(32,'hours')).format("YYYY-MM-DDThh:mm:ss");
   let options = {
    uri: 'url',
    qs: {
      limit : 500,
      interval: '1hour',
      start:startdate,
    },
    json: true 
  };
   let datas = {};
   for(let pair of Object.keys(urls)) {
    options.uri = urls[pair];
    let rsp2 = await request(options).catch(e=>{
      console.log(e);
    })
    if(rsp2 && rsp2.result=='success' && rsp2.count>0) {
      datas[pair] = _format(rsp2);
    }
   }
   rsp.data = datas;
   rsp.result = 'success';
   res.send(rsp);
})

router.get('/pair/:pair', async (req, res) => {
    let {pair,interval} = req.params;
    let rsp ={};
    if(!pair) {
      rsp.result = 'error';
      rsp.message = 'pair is required';
      res.send(rsp)
      return;
    }
    if(!interval) {
      interval = '1hour';
    }
     const node = urls[pair];
     if(!node) {
      rsp.result = 'error';
      rsp.message = 'pair is not exist';
      res.send(rsp)
      return;
     }

     let startdate = (moment(new Date().getTime()).subtract(32,'hours')).format("YYYY-MM-DDThh:mm:ss");
     let options = {
      uri: node,
      qs: {
        limit : 500,
        interval: interval,
        start:startdate,
      },
      json: true 
    };
    let rsp2 = await request(options).catch(e=>{
      console.log(e);
    })
    if(rsp2 && rsp2.result=='success' && rsp2.count>0) {
      rsp.result = 'success';
      rsp.data = _format(rsp2);
    }else{
      rsp.result = rsp2;
    }
    res.send(rsp);
})

_format = function(rsp2) {
  let exchanges = rsp2.exchanges;
  let data = {base_volume:0,buy_volume:0};
  for(let ex of exchanges) {
    data.base_volume += Number(ex.base_volume);
    data.buy_volume += ex.buy_volume;
    data.base_currency = ex.base_currency;
    data.base_issuer = ex.base_issuer;
    data.counter_currency = ex.counter_currency;
    data.counter_issuer = ex.counter_issuer;
  }
  let last = exchanges[rsp2.count-1];
  data.close = last.close;
  let maxex = _.max(exchanges,(ex)=>{
    return ex.high
  })
  let minex = _.min(exchanges,(ex)=>{
    return ex.low
  })
  data.high = maxex.high;
  data.low = minex.low;
  data.open = last.open;
  return data;
}

