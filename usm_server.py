import math
import sys
import usm
from bottle import route, run, request, static_file


@route("/")
def static_main():
    return static_file("index.htm", root='static')

@route("<filepath:path>")
def static_all(filepath):
    return static_file(filepath, root='static')

@route('/act/mint')
def act_mint():
    usm.process_input("mint " + request.query.user + " " + request.query.value)
    print(usm.status_summary())

@route('/act/burn')
def act_burn():
    usm.process_input("burn " + request.query.user + " " + request.query.value)
    print(usm.status_summary())

@route('/act/fundeth')
def act_fundeth():
    usm.process_input("fund_eth " + request.query.user + " " + request.query.value)
    print(usm.status_summary())

@route('/act/fundusm')
def act_fundusm():
    usm.process_input("fund_usm " + request.query.user + " " + request.query.value)
    print(usm.status_summary())

@route('/act/defund')
def act_defund():
    usm.process_input("defund " + request.query.user + " " + request.query.value)
    print(usm.status_summary())

@route('/act/ethprice')
def eth_price():
    usm.process_input("price " + request.query.value)
    print(usm.status_summary())


@route('/state')
def state():
    return usm.status_summary_json()

@route('/state/pool')
def state_pool():
    return usm.status_summary_json()


run(host='localhost', port=8080, debug=True)
