var chart_meta = {
  'chart_pool_eth': {'data':'pool_eth', 'title':'ETH Pool', 'color':'#a52714'},
  'chart_eth_price':{'data':'eth_price', 'title':'ETH Price', 'color':'#0000ff'},
  'chart_pool_value':{'data':'pool_value', 'title':'Pool', 'color':'#ff0000'},
  'chart_usm_outstanding':{'data':'usm_outstanding', 'title':'USM Outstanding', 'color':'#00ff00'},
  'chart_buffer_value':{'data':'buffer_value', 'title':'Buffer', 'color':'#a52714'},
  'chart_debt_ratio':{'data':'debt_ratio', 'title':'Debt Ratio', 'color':'#0000ff'},
  'chart_fum_outstanding':{'data':'fum_outstanding', 'title':'FUM Outstanding', 'color':'#ff0000'},
  'chart_fum_price_sell':{'data':'fum_price_sell', 'title':'FUM Sell Price', 'color':'#00ff00'},
  'chart_fum_price_buy':{'data':'fum_price_buy', 'title':'FUM Buy Price', 'color':'#a52714'}
}

var state = {}
const X_TICKS = 50

function mint(){ make_call("act/mint?user=" + $("#mint_user").val() + "&value=" + $("#mint_value").val()) }
function burn(){ make_call("act/burn?user=" + $("#burn_user").val() + "&value=" + $("#burn_value").val()) }
function fundeth(){ make_call("act/fundeth?user=" + $("#fund_eth_user").val() + "&value=" + $("#fund_eth_value").val()) }
function fundusm(){ make_call("act/fundusm?user=" + $("#fund_usm_user").val() + "&value=" + $("#fund_usm_value").val()) }
function defund(){ make_call("act/defund?user=" + $("#defund_user").val() + "&value=" + $("#defund_value").val()) }
function ethprice(){ make_call("act/ethprice?value=" + $("#fund_value").val()) }

function make_call(call){ $.get(call, function(data) { on_data_changed(); }); }

function on_data_changed() {
  $.get("state", function(new_data) {
    new_data = JSON.parse(new_data.replace(/\bNaN\b/g, "null"))
    append_new_data(new_data); 
  });
}

function append_new_data(new_data){
  for (var chart_id in chart_meta){
    var data = state[chart_id].data
    data.shift()
    data.push([data[data.length-1][0]+1, new_data[chart_meta[chart_id]['data']]])
  }
  update_charts()
}

function init_charts(){
  google.charts.load('current', { packages: ['corechart', 'line'] });
  google.charts.setOnLoadCallback(init_charts_callback);
}

function init_charts_callback(){
  $.get("state", function(new_data) {
    new_data = JSON.parse(new_data.replace(/\bNaN\b/g, "null"))
    for (var chart_id in chart_meta){
      state[chart_id] = {}
      var data = [...Array(X_TICKS).keys()].map(x => [x, new_data[chart_meta[chart_id]['data']]]);
      state[chart_id] ={
        'chart': new google.visualization.LineChart(document.getElementById(chart_id)),
        'data': data
      }
    }
    update_charts()
  });
}

function update_charts(){
  for (var chart_id in chart_meta){
    update_chart_data(chart_id)
  }
}


function update_chart_data(chart_id) {
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'X');
  data.addColumn('number', 'Y');
  data.addRows(state[chart_id].data)
  options = {
    title: chart_meta[chart_id]['title'],
    legend: {position: 'none'},
    //'chartArea': {'width': '100%', 'height': '80%'},
    colors: [chart_meta[chart_id]['color']]
  }
  state[chart_id].chart.draw(data, options);
}
