var request = require('request-promise');
const moment = require ('moment');
const _ = require('underscore');

const snapshot = {
    urls : {
      xrpcny:`https://data.ripple.com/v2/exchanges/XRP/CNY+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y`,
      xrpusd:`https://data.ripple.com/v2/exchanges/XRP/USD+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y`,
      xlmcny:`https://data.ripple.com/v2/exchanges/XLM+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/CNY+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y`,
      ultcny:`https://data.ripple.com/v2/exchanges/ULT+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/CNY+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y`,
      ultxrp:`https://data.ripple.com/v2/exchanges/ULT+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/XRP`,
      xlmxrp:`https://data.ripple.com/v2/exchanges/XLM+rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y/XRP`,
    },
    data : {},
    updated_time : new Date()
}

async function takesnapshot() {
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
  for(let pair of Object.keys(snapshot.urls)) {
    options.uri = snapshot.urls[pair];
    let rsp2 = await request(options).catch(e=>{ console.error(e); });
    if(rsp2 && rsp2.result=='success' && rsp2.count>0) {
      snapshot.data[pair] = _format(rsp2);
    }
  }
  snapshot.updated_time = new Date();
  console.log('takesnapshot done', snapshot.updated_time);
}

async function task() {
  await takesnapshot();
  setTimeout(function(){task();}, 300000);
}

task();

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

module.exports = snapshot;
