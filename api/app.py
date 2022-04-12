from flask import Flask
from flask_restful import Api
from flask_cors import CORS  # comment this on deployment
from handlers.StockApiHandler import StockApiHandler
from handlers.SymbolApiHandler import SymbolApiHandler
from common.extensions import cache

app = Flask(__name__)
CORS(app)  # comment this on deployment

app.config.from_object('config.BaseConfig')

api = Api(app)
cache.init_app(app)

api.add_resource(SymbolApiHandler, '/api/symbol/<string:query>')
api.add_resource(StockApiHandler, '/api/stock/<string:symbol>')
