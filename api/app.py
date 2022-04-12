from flask import Flask
from flask_restful import Api
from flask_cors import CORS  # comment this on deployment
from handlers.StockApiHandler import StockApiHandler
from handlers.SymbolApiHandler import SymbolApiHandler

app = Flask(__name__)
CORS(app)  # comment this on deployment
api = Api(app)

api.add_resource(SymbolApiHandler, '/api/symbol/<string:query>')
api.add_resource(StockApiHandler, '/api/stock/<string:symbol>')
